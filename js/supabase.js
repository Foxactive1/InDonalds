// js/supabase.js
// As credenciais são injetadas pelo Vercel via variáveis de ambiente.
// NUNCA comite chaves reais aqui — use o painel Vercel > Settings > Environment Variables.

const SUPABASE_URL = window.__SUPABASE_URL__ || "";
const SUPABASE_KEY = window.__SUPABASE_KEY__ || "";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    "[supabase.js] Credenciais ausentes. " +
    "Defina SUPABASE_URL e SUPABASE_KEY nas variáveis de ambiente do Vercel " +
    "e certifique-se de que o snippet de injeção está no <head> de cada página."
  );
}

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
