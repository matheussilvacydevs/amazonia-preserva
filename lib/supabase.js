"use client";

import { createClient } from "@supabase/supabase-js";

let instance;
let authPromise;

export function db() {
  if (!instance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error(
        "Configure .env.local com URL e chave pública do Supabase"
      );
    }

    instance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return instance;
}

export async function auth() {
  if (!authPromise) {
    authPromise = (async () => {
      const client = db();

      console.log("[SUPABASE] verificando sessão...");

      const {
        data: { session },
        error: sessionError,
      } = await client.auth.getSession();

      if (sessionError) {
        console.error("[SUPABASE] getSession:", sessionError);
        throw sessionError;
      }

      if (session?.user) {
        console.log("[SUPABASE] sessão existente:", session.user.id);
        return session.user;
      }

      console.log("[SUPABASE] criando sessão anônima...");

      const { data, error } = await client.auth.signInAnonymously();

      if (error) {
        console.error("[SUPABASE] signInAnonymously:", error);
        throw error;
      }

      console.log("[SUPABASE] sessão criada:", data.user?.id);

      return data.user;
    })();
  }

  try {
    return await authPromise;
  } catch (error) {
    authPromise = null;
    throw error;
  }
}

export async function rpc(name, args = {}) {
  await auth();

  console.log(`[RPC] → ${name}`, args);

  try {
    const { data, error } = await db().rpc(name, args);

    if (error) {
      console.error(
        `[RPC] ${name} ERRO | code=${error?.code || "?"} | message=${error?.message || "?"} | details=${error?.details || "-"} | hint=${error?.hint || "-"}`
      );

      const e = new Error(error.message || `Erro na RPC ${name}`);
      e.code = error.code;
      e.details = error.details;
      e.hint = error.hint;
      throw e;
    }

    console.log(`[RPC] ← ${name} OK`);

    return data;
  } catch (error) {
    console.error(`[RPC] ${name} FALHA DE FETCH`, {
      name: error?.name,
      message: error?.message,
      cause: error?.cause,
      stack: error?.stack,
    });

    throw error;
  }
}
