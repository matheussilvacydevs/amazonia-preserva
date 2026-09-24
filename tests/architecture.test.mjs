import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const sql=readFileSync(new URL('../supabase/schema.sql',import.meta.url),'utf8');const ui=readFileSync(new URL('../components/MultiplayerQuizEngine.jsx',import.meta.url),'utf8');
test('answer uses a locked room and per-question player record',()=>{assert.match(sql,/ap_answer[\s\S]*?for update/);assert.match(sql,/answered_question=r\.current_question/);assert.match(sql,/auth\.uid\(\)/)});
test('advance rejects stale question and only host can advance',()=>{assert.match(sql,/r\.host_id is distinct from auth\.uid\(\)/);assert.match(sql,/r\.started_at is distinct from p_expected_started_at/)});
test('client retains manual and automatic advance and polling fallback',()=>{assert.match(ui,/setInterval\(tick,2000\)/);assert.match(ui,/setTimeout\(\(\)=>advance\(true\),delay\)/);assert.match(ui,/onClick=\{\(\)=>advance\(false\)\}/)});
