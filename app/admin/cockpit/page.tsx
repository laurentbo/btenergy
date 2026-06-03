import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CockpitClient } from './CockpitClient'

const ADMIN_EMAIL = 'laurent.bocle@gmail.com'

export type ProfileData = {
  id: string
  email: string
  prenom: string
  current_day: number
  program_start: string | null
  created_at: string
  role: string
}

export type EntryData = {
  user_id: string
  day: number
  energie: number
  humeur: number
  hydratation: number
  sommeil: number
  created_at: string
}

export type MoodItem = {
  score: number
  label: string
  emoji: string
  count: number
}

export type CockpitData = {
  totalUsers: number
  activeUsers: number
  completedUsers: number
  atRiskUsers: number
  avgDay: number
  weekDistribution: { S1: number; S2: number; S3: number }
  dayHistogram: { day: number; count: number }[]
  moodDistribution: MoodItem[]
  energieDistribution: { range: string; count: number }[]
  avgEnergie: number | null
  profiles: ProfileData[]
  recentEntries: EntryData[]
  atRiskProfileIds: string[]
  alertProfileIds: string[]
  profileMap: Record<string, ProfileData>
  userEnergieAvg: Record<string, number>
}

const MOOD_MAP: Record<number, { label: string; emoji: string }> = {
  1: { label: 'Épuisé',      emoji: '😩' },
  2: { label: 'Fatigué',     emoji: '😔' },
  3: { label: 'Moyen',       emoji: '😐' },
  4: { label: 'Passable',    emoji: '🙁' },
  5: { label: 'OK',          emoji: '😶' },
  6: { label: 'Bien',        emoji: '🙂' },
  7: { label: 'Plutôt bien', emoji: '😊' },
  8: { label: 'Très bien',   emoji: '😁' },
  9: { label: 'Super',       emoji: '🤩' },
  10:{ label: 'Excellent',   emoji: '🌟' },
}

export default async function CockpitPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== ADMIN_EMAIL) redirect('/dashboard')

  const [{ data: allProfiles }, { data: allEntries }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, email, prenom, current_day, program_start, created_at, role')
      .order('created_at', { ascending: false }),
    supabase
      .from('journal_entries')
      .select('user_id, day, energie, humeur, hydratation, sommeil, created_at')
      .order('created_at', { ascending: false }),
  ])

  const profiles = ((allProfiles ?? []).filter(p => p.role === 'collaborateur')) as ProfileData[]

  // Only keep entries from collaborateurs
  const collaborateurIds = new Set(profiles.map(p => p.id))
  const entries = ((allEntries ?? []) as EntryData[]).filter(e => collaborateurIds.has(e.user_id))

  const now = Date.now()
  const threeDaysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000)
  const twoDaysAgo  = new Date(now - 2 * 24 * 60 * 60 * 1000)

  const recentIds3d = new Set(entries.filter(e => new Date(e.created_at) > threeDaysAgo).map(e => e.user_id))
  const recentIds2d = new Set(entries.filter(e => new Date(e.created_at) > twoDaysAgo).map(e => e.user_id))

  const activeProfiles    = profiles.filter(p => p.current_day >= 1 && p.current_day <= 20)
  const atRiskProfileIds  = activeProfiles.filter(p => !recentIds3d.has(p.id)).map(p => p.id)
  const alertProfileIds   = activeProfiles.filter(p => !recentIds2d.has(p.id)).map(p => p.id)

  const totalUsers     = profiles.length
  const activeUsers    = activeProfiles.length
  const completedUsers = profiles.filter(p => p.current_day >= 21).length
  const atRiskUsers    = atRiskProfileIds.length
  const avgDay = activeUsers > 0
    ? Math.round(activeProfiles.reduce((s, p) => s + p.current_day, 0) / activeUsers)
    : 0

  const weekDistribution = {
    S1: profiles.filter(p => p.current_day >= 1  && p.current_day <= 7).length,
    S2: profiles.filter(p => p.current_day >= 8  && p.current_day <= 14).length,
    S3: profiles.filter(p => p.current_day >= 15 && p.current_day <= 21).length,
  }

  const dayHistogram = Array.from({ length: 21 }, (_, i) => ({
    day: i + 1,
    count: profiles.filter(p => p.current_day === i + 1).length,
  }))

  // Mood distribution — humeur is assumed 1–10
  const moodCounts: Record<number, number> = {}
  entries.forEach(e => {
    if (e.humeur != null) moodCounts[e.humeur] = (moodCounts[e.humeur] ?? 0) + 1
  })
  const moodDistribution: MoodItem[] = Object.entries(moodCounts)
    .map(([k, count]) => ({
      score: Number(k),
      label: MOOD_MAP[Number(k)]?.label ?? `Score ${k}`,
      emoji: MOOD_MAP[Number(k)]?.emoji ?? '❓',
      count,
    }))
    .sort((a, b) => a.score - b.score)

  // Energie × 10 → 0–100 scale for vitality
  const energieDistribution = [
    { range: '0–39',   count: entries.filter(e => e.energie * 10 < 40).length },
    { range: '40–59',  count: entries.filter(e => e.energie * 10 >= 40 && e.energie * 10 < 60).length },
    { range: '60–79',  count: entries.filter(e => e.energie * 10 >= 60 && e.energie * 10 < 80).length },
    { range: '80–100', count: entries.filter(e => e.energie * 10 >= 80).length },
  ]

  const withEnergie = entries.filter(e => e.energie != null)
  const avgEnergie = withEnergie.length > 0
    ? Math.round(withEnergie.reduce((s, e) => s + e.energie, 0) / withEnergie.length * 10)
    : null

  // Per-user average energie (0–100)
  const userEnergieMap: Record<string, { sum: number; n: number }> = {}
  entries.forEach(e => {
    if (e.energie != null) {
      if (!userEnergieMap[e.user_id]) userEnergieMap[e.user_id] = { sum: 0, n: 0 }
      userEnergieMap[e.user_id].sum += e.energie
      userEnergieMap[e.user_id].n   += 1
    }
  })
  const userEnergieAvg: Record<string, number> = {}
  Object.entries(userEnergieMap).forEach(([uid, { sum, n }]) => {
    userEnergieAvg[uid] = Math.round(sum / n * 10)
  })

  const profileMap: Record<string, ProfileData> = {}
  profiles.forEach(p => { profileMap[p.id] = p })

  const data: CockpitData = {
    totalUsers, activeUsers, completedUsers, atRiskUsers, avgDay,
    weekDistribution, dayHistogram, moodDistribution, energieDistribution, avgEnergie,
    profiles, recentEntries: entries.slice(0, 20),
    atRiskProfileIds, alertProfileIds, profileMap, userEnergieAvg,
  }

  return <CockpitClient data={data} />
}
