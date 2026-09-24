-- Execute uma vez no SQL Editor do Supabase. Tabelas novas: não alteram o quiz antigo.
create extension if not exists pgcrypto;
create table if not exists public.ap_rooms (
 id uuid primary key default gen_random_uuid(), pin text not null unique check(pin ~ '^[0-9]{6}$'),
 host_id uuid not null, host_name text not null, status text not null default 'lobby' check(status in ('lobby','question','finished')),
 questions jsonb not null, current_question integer not null default 0,
 started_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.ap_players (
 id uuid primary key default gen_random_uuid(), room_id uuid not null references public.ap_rooms(id) on delete cascade,
 user_id uuid not null, nickname text not null, score integer not null default 0,
 streak integer not null default 0, answered_question integer not null default -1,
 selected_answer integer, is_correct boolean, last_points integer not null default 0,
 joined_at timestamptz not null default now(), unique(room_id,user_id),unique(room_id,nickname)
);
create index if not exists ap_players_room_idx on public.ap_players(room_id);
alter table public.ap_rooms enable row level security;
alter table public.ap_players enable row level security;
-- Leitura somente para quem participa; todas as gravações ocorrem em RPC transacionais.
create policy "ap_rooms_select" on public.ap_rooms for select to authenticated using
 (host_id=auth.uid() or exists(select 1 from public.ap_players p where p.room_id=id and p.user_id=auth.uid()));
create policy "ap_players_select" on public.ap_players for select to authenticated using
 (exists(select 1 from public.ap_rooms r where r.id=room_id and (r.host_id=auth.uid() or exists(select 1 from public.ap_players p2 where p2.room_id=r.id and p2.user_id=auth.uid()))));
-- Evita recursão entre políticas de leitura: consulta via RPC com security definer.
drop policy if exists "ap_rooms_select" on public.ap_rooms;
drop policy if exists "ap_players_select" on public.ap_players;
create policy "ap_rooms_select" on public.ap_rooms for select to authenticated using (host_id=auth.uid() or id in (select room_id from public.ap_players where user_id=auth.uid()));
create policy "ap_players_select" on public.ap_players for select to authenticated using (user_id=auth.uid());
-- As leituras completas da sala são fornecidas por ap_snapshot.
create or replace function public.ap_snapshot(p_pin text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare r public.ap_rooms%rowtype; result jsonb;
begin
 select * into r from ap_rooms where pin=p_pin;
 if not found then raise exception 'Sala não encontrada'; end if;
 if not exists(select 1 from ap_players where room_id=r.id and user_id=auth.uid()) then raise exception 'Você não participa desta sala'; end if;
 select jsonb_build_object('room',to_jsonb(r),'players',coalesce(jsonb_agg(to_jsonb(p) order by p.joined_at),'[]'::jsonb),'server_now',extract(epoch from clock_timestamp())*1000)
 into result from ap_players p where p.room_id=r.id;
 return result;
end $$;
create or replace function public.ap_create(p_pin text,p_name text,p_questions jsonb)
returns jsonb language plpgsql security definer set search_path=public as $$
declare r public.ap_rooms%rowtype;
begin
 if auth.uid() is null then raise exception 'Faça login primeiro'; end if;
 if p_pin !~ '^[0-9]{6}$' or length(trim(p_name)) not between 1 and 32 or jsonb_typeof(p_questions)!='array' or jsonb_array_length(p_questions) not between 7 and 12 then raise exception 'Dados inválidos'; end if;
 insert into ap_rooms(pin,host_id,host_name,questions) values(p_pin,auth.uid(),trim(p_name),p_questions) returning * into r;
 insert into ap_players(room_id,user_id,nickname) values(r.id,auth.uid(),trim(p_name));
 return jsonb_build_object('pin',r.pin);
exception when unique_violation then raise exception 'PIN já utilizado; tente criar outra sala';
end $$;
create or replace function public.ap_join(p_pin text,p_name text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare r public.ap_rooms%rowtype; previous public.ap_players%rowtype;
begin
 if auth.uid() is null then raise exception 'Faça login primeiro'; end if;
 if length(trim(p_name)) not between 1 and 32 then raise exception 'Apelido deve ter entre 1 e 32 caracteres'; end if;
 select * into r from ap_rooms where pin=p_pin for update;
 if not found then raise exception 'Sala não encontrada'; end if;
 select * into previous from ap_players where room_id=r.id and user_id=auth.uid();
 if found then return jsonb_build_object('pin',r.pin,'nickname',previous.nickname); end if;
 if r.status!='lobby' then raise exception 'A partida já começou'; end if;
 if exists(select 1 from ap_players where room_id=r.id and lower(nickname)=lower(trim(p_name))) then raise exception 'Apelido já utilizado'; end if;
 insert into ap_players(room_id,user_id,nickname) values(r.id,auth.uid(),trim(p_name));
 return jsonb_build_object('pin',r.pin,'nickname',trim(p_name));
exception when unique_violation then raise exception 'Apelido ou sessão já cadastrado nesta sala';
end $$;
create or replace function public.ap_start(p_pin text)
returns void language plpgsql security definer set search_path=public as $$
declare r public.ap_rooms%rowtype;
begin
 select * into r from ap_rooms where pin=p_pin for update;
 if not found or r.host_id is distinct from auth.uid() then raise exception 'Somente o anfitrião pode iniciar'; end if;
 if r.status not in ('lobby','finished') then raise exception 'Partida já iniciada'; end if;
 update ap_players set score=0,streak=0,answered_question=-1,selected_answer=null,is_correct=null,last_points=0 where room_id=r.id;
 update ap_rooms set status='question',current_question=0,started_at=clock_timestamp() where id=r.id;
end $$;
create or replace function public.ap_answer(p_pin text,p_index integer)
returns jsonb language plpgsql security definer set search_path=public as $$
declare r public.ap_rooms%rowtype; p public.ap_players%rowtype; correct integer; earned integer; next_streak integer; remaining numeric;
begin
 select * into r from ap_rooms where pin=p_pin for update;
 if not found or r.status!='question' then raise exception 'Não há pergunta aberta'; end if;
 select * into p from ap_players where room_id=r.id and user_id=auth.uid() for update;
 if not found then raise exception 'Você não participa desta sala'; end if;
 if p.answered_question=r.current_question then raise exception 'Você já respondeu esta pergunta'; end if;
 remaining:=35-extract(epoch from (clock_timestamp()-r.started_at));
 if remaining<=0 then raise exception 'Tempo esgotado'; end if;
 if p_index<0 or p_index>=jsonb_array_length(r.questions->r.current_question->'options') then raise exception 'Alternativa inválida'; end if;
 correct:=(r.questions->r.current_question->>'correctIndex')::integer;
 next_streak:=case when p_index=correct then p.streak+1 else 0 end;
 earned:=case when p_index=correct then 500+round(greatest(0,remaining)/35*500)::integer+(next_streak-1)*100 else 0 end;
 update ap_players set answered_question=r.current_question,selected_answer=p_index,is_correct=(p_index=correct),last_points=earned,streak=next_streak,score=score+earned where id=p.id;
 return jsonb_build_object('correct',p_index=correct,'points',earned);
end $$;
create or replace function public.ap_advance(p_pin text,p_expected_question integer,p_expected_started_at timestamptz,p_auto boolean default false)
returns boolean language plpgsql security definer set search_path=public as $$
declare r public.ap_rooms%rowtype; total integer; answered integer;
begin
 select * into r from ap_rooms where pin=p_pin for update;
 if not found or r.host_id is distinct from auth.uid() then raise exception 'Somente o anfitrião pode avançar'; end if;
 if r.status!='question' or r.current_question!=p_expected_question or r.started_at is distinct from p_expected_started_at then return false; end if;
 if p_auto then
   select count(*),count(*) filter(where answered_question=r.current_question) into total,answered from ap_players where room_id=r.id;
   if clock_timestamp()<r.started_at+interval '35 seconds' and (total=0 or answered<total) then return false; end if;
   if clock_timestamp()<r.started_at+interval '4 seconds' then return false; end if;
 end if;
 if r.current_question+1>=jsonb_array_length(r.questions) then
   update ap_rooms set status='finished' where id=r.id;
 else
   update ap_rooms set current_question=r.current_question+1,started_at=clock_timestamp() where id=r.id;
 end if;
 return true;
end $$;
revoke all on function public.ap_snapshot(text),public.ap_create(text,text,jsonb),public.ap_join(text,text),public.ap_start(text),public.ap_answer(text,integer),public.ap_advance(text,integer,timestamptz,boolean) from public;
grant execute on function public.ap_snapshot(text),public.ap_create(text,text,jsonb),public.ap_join(text,text),public.ap_start(text),public.ap_answer(text,integer),public.ap_advance(text,integer,timestamptz,boolean) to authenticated;
-- Realtime opcional: polling mantém o jogo funcional mesmo sem ele.
do $$ begin alter publication supabase_realtime add table public.ap_rooms; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.ap_players; exception when duplicate_object then null; end $$;
