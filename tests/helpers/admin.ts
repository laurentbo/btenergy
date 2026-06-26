import { createClient, type SupabaseClient } from "@supabase/supabase-js"

const TEST_EMAIL = process.env.TEST_USER_EMAIL!
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD!

let _admin: SupabaseClient | null = null

function admin(): SupabaseClient {
  if (_admin) return _admin
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY manquants — colle la clé service_role dans .env.test"
    )
  }
  _admin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
  return _admin
}

async function findUserByEmail(email: string) {
  const sb = admin()
  let page = 1
  for (;;) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const found = data.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
    if (found) return found
    if (data.users.length < 200) return null
    page++
  }
}

let _userId: string | null = null

// Supabase révoque TOUTES les sessions actives dès qu'on appelle
// updateUserById avec un password — même une valeur identique. Si on le
// faisait à chaque setStartDate/getFirstName, on casserait en plein test la
// session posée par auth.setup.ts. On vérifie donc d'abord, via un vrai essai
// de connexion (anon, jetable), si le mot de passe attendu est déjà en place ;
// on ne touche au mot de passe que s'il a fallu le redéfinir.
async function passwordAlreadyCorrect(): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const probe = createClient(url, anonKey, { auth: { autoRefreshToken: false, persistSession: false } })
  const { data, error } = await probe.auth.signInWithPassword({ email: TEST_EMAIL, password: TEST_PASSWORD })
  // scope "local" — sinon signOut() révoque par défaut TOUTES les sessions de
  // l'utilisateur, y compris celle posée par auth.setup.ts pour les tests.
  if (data.session) await probe.auth.signOut({ scope: "local" })
  return !error
}

// Crée le compte de test (mot de passe connu) s'il n'existe pas, ou fixe son
// mot de passe seulement si besoin. S'assure aussi que le profil a un
// prénom — sinon le test de personnalisation n'aurait rien à vérifier.
// Idempotent et sûr à appeler plusieurs fois dans le même run.
export async function ensureTestUser(): Promise<{ id: string }> {
  const sb = admin()
  let user = await findUserByEmail(TEST_EMAIL)

  if (!user) {
    const { data, error } = await sb.auth.admin.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
    })
    if (error) throw error
    user = data.user
  } else if (!(await passwordAlreadyCorrect())) {
    const { error } = await sb.auth.admin.updateUserById(user.id, { password: TEST_PASSWORD })
    if (error) throw error
  }

  const { data: profile } = await sb.from("profiles").select("prenom").eq("id", user.id).maybeSingle()
  if (!profile) {
    const { error } = await sb.from("profiles").insert({ id: user.id, email: TEST_EMAIL, prenom: "Testeur" })
    if (error) throw error
  } else if (!profile.prenom) {
    const { error } = await sb.from("profiles").update({ prenom: "Testeur" }).eq("id", user.id)
    if (error) throw error
  }

  _userId = user.id
  return { id: user.id }
}

function todayParis(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Paris" })
}

function addDaysParis(offsetDays: number): string {
  const [y, m, d] = todayParis().split("-").map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  dt.setUTCDate(dt.getUTCDate() + offsetDays)
  return dt.toISOString().slice(0, 10)
}

// Règle profiles.start_date du compte de test à (aujourd'hui Europe/Paris) + offsetDays.
// offsetDays === null => start_date NULL (guard NULL/invalide).
export async function setStartDate(offsetDays: number | null): Promise<void> {
  const sb = admin()
  const { id } = await ensureTestUser()
  const value = offsetDays === null ? null : addDaysParis(offsetDays)
  const { error } = await sb.from("profiles").update({ start_date: value }).eq("id", id)
  if (error) throw error
}

export async function getFirstName(): Promise<string> {
  const sb = admin()
  const { id } = await ensureTestUser()
  const { data, error } = await sb.from("profiles").select("prenom").eq("id", id).maybeSingle()
  if (error) throw error
  return data?.prenom ?? ""
}
