// js/supabase.js — InNovaIdeia © 2026
//
// ⚠️  ATENÇÃO: A chave "anon" do Supabase é PÚBLICA por design.
//     Ela só permite o que as políticas RLS do banco autorizam.
//     Nunca use aqui a "service_role" key (essa sim é secreta).
//
// Como obter suas credenciais:
//   Supabase Dashboard → seu projeto → Settings → API
//   Copie "Project URL" e "anon / public" key.

const SUPABASE_URL = "https://sloyzgjbmmkypofeetrv.supabase.co";
const SUPABASE_KEY = "COLE_AQUI_SUA_ANON_KEY";   // ← substitua pela anon key real

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
