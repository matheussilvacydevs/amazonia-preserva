"use client";
import {useCallback,useEffect,useRef,useState} from 'react';
import {auth,db,rpc} from '../lib/supabase';
const DURATION=35;
const card='bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xl space-y-5';
const btn='w-full py-3.5 bg-amazon-700 hover:bg-amazon-600 text-white font-bold text-sm rounded-xl disabled:opacity-50';
function err(e){return e?.message||'Ocorreu um erro de conexão';}
export function MultiplayerQuizEngine({questions,onBack}){
 const [view,setView]=useState('menu'),[name,setName]=useState(''),[pin,setPin]=useState(''),[count,setCount]=useState(7),[snapshot,setSnapshot]=useState(null),[user,setUser]=useState(null),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[now,setNow]=useState(Date.now());
 const offset=useRef(0),advanceKey=useRef(''),inFlight=useRef(false),lastResultAt=useRef({key:'',at:0}),networkFailures=useRef(0);
 const showError=e=>{console.error(e);setMessage(err(e))};
 useEffect(()=>{auth().then(setUser).catch(showError)},[]);
 const refresh=useCallback(async(roomPin)=>{
   if(!roomPin)return null;

   let lastError;

   for(let attempt=0;attempt<3;attempt++){
     try{
       const started=Date.now();
       const data=await rpc('ap_snapshot',{p_pin:roomPin});

       networkFailures.current=0;

       // Ajusta a diferença entre relógio local e relógio do servidor.
       offset.current=data.server_now-(started+Date.now())/2;

       setSnapshot(old=>{
         if(
           old?.room?.id===data.room.id &&
           old.room.current_question===data.room.current_question &&
           old.room.started_at===data.room.started_at &&
           JSON.stringify(old.players)===JSON.stringify(data.players) &&
           old.room.status===data.room.status
         ) return old;

         return data;
       });

       return data;
     }catch(e){
       lastError=e;

       const transient =
         e?.message?.includes('Failed to fetch') ||
         e?.message?.includes('NetworkError') ||
         e?.message?.includes('fetch');

       if(!transient) throw e;

       if(attempt<2){
         await new Promise(resolve=>setTimeout(resolve,350*(attempt+1)));
       }
     }
   }

   networkFailures.current+=1;

   // Mantém o último snapshot válido.
   // Uma falha temporária de polling não derruba a partida.
   if(networkFailures.current===1){
     console.warn('[MULTIPLAYER] conexão instável; mantendo último estado válido.');
   }

   return null;
 },[]);
 useEffect(()=>{
  if(view!=='room'||!pin)return;
  let active=true;const tick=()=>{if(active)refresh(pin).catch(showError)};
  tick();const polling=setInterval(tick,2000);
  let channel;
  try{channel=db().channel('ap-'+pin).on('postgres_changes',{event:'*',schema:'public',table:'ap_rooms'},tick).on('postgres_changes',{event:'*',schema:'public',table:'ap_players'},tick).subscribe()}catch(e){console.warn('Realtime indisponível; polling ativo',e)}
  return()=>{active=false;clearInterval(polling);if(channel)db().removeChannel(channel)};
 },[view,pin,refresh]);
 useEffect(()=>{const id=setInterval(()=>setNow(Date.now()),200);return()=>clearInterval(id)},[]);
 const room=snapshot?.room,players=snapshot?.players||[],me=players.find(p=>p.user_id===user?.id),host=Boolean(room&&user&&room.host_id===user.id),qIndex=room?.current_question??0,q=room?.questions?.[qIndex];
 const startMs=room?.started_at?new Date(room.started_at).getTime():0;
 const elapsed=startMs?(now+offset.current-startMs)/1000:0;
 const remaining=room?.status==='question'?Math.max(0,Math.ceil(DURATION-elapsed)):DURATION;
 const answered=players.filter(p=>p.answered_question===qIndex).length;
 const results=room?.status==='question'&&(remaining<=0||(players.length>0&&answered===players.length));
 const questionKey=room?.id+':'+qIndex+':'+room?.started_at;
 const act=async(fn)=>{if(busy)return;setBusy(true);setMessage('');try{await fn()}catch(e){showError(e)}finally{setBusy(false)}};
 const create=()=>act(async()=>{const clean=name.trim();if(!clean)throw Error('Digite seu apelido');const selected=[...questions].sort(()=>Math.random()-.5).slice(0,count);for(let i=0;i<5;i++){const code=String(Math.floor(100000+Math.random()*900000));try{await rpc('ap_create',{p_pin:code,p_name:clean,p_questions:selected});setPin(code);setView('room');await refresh(code);return}catch(e){if(!err(e).includes('PIN já utilizado'))throw e}}throw Error('Não foi possível gerar um PIN livre')});
 const join=()=>act(async()=>{const code=pin.replace(/\D/g,'').slice(0,6);if(code.length!==6)throw Error('PIN deve ter seis dígitos');const joined=await rpc('ap_join',{p_pin:code,p_name:name.trim()});setName(joined.nickname);setPin(code);setView('room');await refresh(code)});
 const start=()=>act(async()=>{await rpc('ap_start',{p_pin:pin});await refresh(pin)});
 const answer=i=>act(async()=>{if(!me||me.answered_question===qIndex||results)return;await rpc('ap_answer',{p_pin:pin,p_index:i});await refresh(pin)});
 const advance=useCallback(async(auto=false)=>{
   if(!room||inFlight.current)return;
   inFlight.current=true;
   try{const changed=await rpc('ap_advance',{p_pin:room.pin,p_expected_question:room.current_question,p_expected_started_at:room.started_at,p_auto:auto});if(changed)await refresh(room.pin)}catch(e){showError(e)}finally{inFlight.current=false}
 },[room,refresh]);
 // Avanço automático pelo host após 4s de resultados. O banco rejeita avanço duplicado.
 useEffect(()=>{
   if(!host||!results||!room)return;
   if(lastResultAt.current.key!==questionKey)lastResultAt.current={key:questionKey,at:Date.now()};
   const delay=Math.max(0,4000-(Date.now()-lastResultAt.current.at));
   const id=setTimeout(()=>advance(true),delay);
   return()=>clearTimeout(id);
 },[host,results,questionKey,advance,room]);
 const resetView=()=>{setView('menu');setPin('');setSnapshot(null);setMessage('')};
 return <div className="max-w-2xl mx-auto px-4 py-10 space-y-5">
  <button className="text-xs font-bold text-stone-500" onClick={view==='menu'?onBack:resetView}>← {view==='menu'?'Voltar ao Quiz':'Sair da Sala'}</button>
  {message&&<div role="alert" className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-xl text-sm">{message}</div>}
  {view==='menu'&&<div className={card}><div className="text-5xl text-center">👥</div><h2 className="text-2xl font-black text-center">Quiz Multiplayer</h2><p className="text-center text-sm text-stone-500">Salas em tempo real com respostas independentes para cada jogador.</p><button className={btn} onClick={()=>setView('create')}>Criar Nova Sala</button><button className={btn} onClick={()=>setView('join')}>Entrar com Código PIN</button></div>}
  {(view==='create'||view==='join')&&<div className={card}><h2 className="text-xl font-black">{view==='create'?'Criar sala':'Entrar em sala'}</h2><label className="block text-xs font-bold">Seu apelido<input maxLength={32} value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full p-3 border rounded-xl" placeholder="Ex: João"/></label>{view==='create'?<label className="block text-xs font-bold">Número de perguntas<select value={count} onChange={e=>setCount(+e.target.value)} className="mt-2 w-full p-3 border rounded-xl">{[7,8,9,10,11,12].map(n=><option key={n} value={n}>{n}</option>)}</select></label>:<label className="block text-xs font-bold">PIN<input inputMode="numeric" value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,'').slice(0,6))} className="mt-2 w-full p-3 border rounded-xl" placeholder="000000"/></label>}<button disabled={busy||!user} className={btn} onClick={view==='create'?create:join}>{busy?'Aguarde...':view==='create'?'Criar Sala':'Entrar na Sala'}</button></div>}
  {view==='room'&&!room&&<div className={card}>Conectando à sala...</div>}
  {room?.status==='lobby'&&<div className={card}><p className="text-center text-xs uppercase tracking-widest text-stone-500">Código PIN da sala</p><div className="text-center text-4xl font-black font-mono text-fire-600">{pin}</div><button className="text-xs text-amazon-700 block mx-auto" onClick={()=>navigator.clipboard.writeText(pin)}>Copiar PIN</button><h3 className="font-bold">Jogadores conectados ({players.length})</h3><div className="flex flex-wrap gap-2">{players.map(p=><span className="bg-stone-100 px-3 py-2 rounded-xl text-sm" key={p.id}>👤 {p.nickname}{p.user_id===room.host_id?' 👑':''}</span>)}</div>{host?<button disabled={busy} className="w-full py-4 bg-fire-600 text-white font-bold rounded-xl" onClick={start}>Iniciar Partida</button>:<p className="text-center text-sm text-amber-700">Aguardando o anfitrião iniciar...</p>}</div>}
  {room?.status==='question'&&q&&<><div className="bg-white p-5 rounded-2xl border flex items-center justify-between"><div><p className="text-xs text-stone-500">Pergunta {qIndex+1} de {room.questions.length}</p><p className="text-xs text-stone-500">Respostas: {answered}/{players.length}</p></div><div className={'text-xl font-black '+(remaining<=5?'text-red-600':'text-amazon-700')}>{remaining}s</div>{results?<div className="text-sm font-black text-amazon-700">{me?.score||0} pts</div>:<div />}</div><div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden"><div className="h-full bg-amazon-600" style={{width:`${remaining/DURATION*100}%`}}/></div><div className={card}><p className="text-xs uppercase font-bold text-stone-500">{q.category} • {q.difficulty}</p><h2 className="text-xl font-extrabold">{q.question}</h2><div className="grid gap-3">{q.options.map((option,i)=>{const selected=me?.answered_question===qIndex&&me.selected_answer===i;const correct=results&&i===q.correctIndex;return <button key={i} disabled={busy||!me||me.answered_question===qIndex||results} onClick={()=>answer(i)} className={'w-full text-left p-4 rounded-xl border-2 text-sm font-semibold '+(correct?'bg-emerald-600 text-white border-emerald-600':selected?'bg-amber-100 border-amber-500':results?'bg-stone-50 opacity-50':'bg-stone-50 hover:bg-stone-100 border-stone-200')}>{String.fromCharCode(65+i)}. {option}</button>})}</div>{me?.answered_question===qIndex&&!results&&<p className="text-center text-amber-700 text-sm">Resposta registrada! Aguardando os outros jogadores.</p>}{results&&<div className="bg-amazon-50 border border-amazon-200 p-4 rounded-xl text-sm"><strong>Explicação científica:</strong> {q.explanation}</div>}{results&&host&&<button disabled={busy} className={btn} onClick={()=>advance(false)}>Avançar agora →</button>}{results&&!host&&<p className="text-center text-xs text-stone-500">Próxima pergunta automaticamente...</p>}</div>{results&&<div className={card}><h3 className="font-black">Placar</h3>{[...players].sort((a,b)=>b.score-a.score).map(p=><div key={p.id} className="flex justify-between text-sm border-b py-2"><span>{p.nickname}{p.user_id===user?.id?' (você)':''}</span><strong>{p.score} pts</strong></div>)}</div>}</>}
  {room?.status==='finished'&&<div className={card}><div className="text-5xl text-center">🏆</div><h2 className="text-2xl font-black text-center">Pódio Final</h2>{[...players].sort((a,b)=>b.score-a.score).map((p,i)=><div className="flex justify-between bg-stone-50 p-4 rounded-xl" key={p.id}><strong>{['🥇','🥈','🥉'][i]||'#'+(i+1)} {p.nickname}</strong><span>{p.score} pts</span></div>)}{host&&<button className={btn} onClick={start} disabled={busy}>Jogar novamente</button>}</div>}
 </div>
}
