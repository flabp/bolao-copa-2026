import { supabase, isSupabaseConfigured } from "./supabase"
import { Participant, Prediction } from "./types"
import { BOLAO_UPDATED_EVENT } from "./constants"
import * as localStore from "./store"

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(BOLAO_UPDATED_EVENT))
  }
}

// --- Authentication ---

export async function authenticateParticipant(name: string, code: string): Promise<Participant | null> {
  if (!isSupabaseConfigured()) {
    // Fallback: check localStorage
    const data = localStore.getBolaoData()
    const p = data.participants.find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    )
    return p || null
  }
  const { data, error } = await supabase!
    .from("participants")
    .select("*")
    .ilike("name", name)
    .eq("password_code", code)
    .single()
  if (error || !data) return null
  return {
    id: data.id,
    name: data.name,
    email: data.email || "",
    phone: data.phone || "",
    createdAt: data.created_at,
    isAdmin: data.is_admin || false,
  }
}

// --- Participants ---

export async function getParticipants(): Promise<Participant[]> {
  if (!isSupabaseConfigured()) {
    return localStore.getBolaoData().participants
  }
  const { data, error } = await supabase!.from("participants").select("*").order("created_at")
  if (error) throw error
  return (data || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    email: p.email || "",
    phone: p.phone || "",
    createdAt: p.created_at,
    isAdmin: p.is_admin || false,
  }))
}

export async function addParticipantAsync(name: string, email?: string, phone?: string, passwordCode?: string, isAdmin?: boolean): Promise<Participant> {
  if (!isSupabaseConfigured()) {
    return localStore.addParticipant(name, email, phone)
  }
  const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"]
  const color = colors[Math.floor(Math.random() * colors.length)]
  const { data, error } = await supabase!.from("participants").insert({
    name,
    email: email || null,
    phone: phone || null,
    avatar_color: color,
    password_code: passwordCode || null,
    is_admin: isAdmin || false,
  }).select().single()
  if (error) throw error
  notify()
  return {
    id: data.id,
    name: data.name,
    email: data.email || "",
    phone: data.phone || "",
    createdAt: data.created_at,
    isAdmin: data.is_admin || false,
  }
}

export async function removeParticipantAsync(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    localStore.removeParticipant(id)
    return
  }
  const { error } = await supabase!.from("participants").delete().eq("id", id)
  if (error) throw error
  notify()
}

// --- Predictions ---

export async function getPredictionsForParticipantAsync(participantId: string): Promise<Prediction[]> {
  if (!isSupabaseConfigured()) {
    return localStore.getPredictionsForParticipant(participantId)
  }
  const { data, error } = await supabase!.from("predictions").select("*").eq("participant_id", participantId)
  if (error) throw error
  return (data || []).map((p: any) => ({
    id: p.id,
    participantId: p.participant_id,
    matchId: p.match_id,
    homeScore: p.home_score,
    awayScore: p.away_score,
    updatedAt: p.updated_at,
  }))
}

export async function savePredictionAsync(
  participantId: string,
  matchId: string,
  homeScore: number,
  awayScore: number
): Promise<void> {
  if (!isSupabaseConfigured()) {
    localStore.savePrediction(participantId, matchId, homeScore, awayScore)
    return
  }
  const { error } = await supabase!.from("predictions").upsert({
    participant_id: participantId,
    match_id: matchId,
    home_score: homeScore,
    away_score: awayScore,
    updated_at: new Date().toISOString(),
  }, { onConflict: "participant_id,match_id" })
  if (error) throw error
  notify()
}

// --- Match Results ---

export async function getMatchResults(): Promise<Record<string, { homeScore: number, awayScore: number, status: string, homePenalties?: number, awayPenalties?: number }>> {
  if (!isSupabaseConfigured()) {
    const data = localStore.getBolaoData()
    const results: Record<string, any> = {}
    data.matches.filter(m => m.status === "finished").forEach(m => {
      results[m.id] = { homeScore: m.homeScore, awayScore: m.awayScore, status: m.status, homePenalties: m.homePenalties, awayPenalties: m.awayPenalties }
    })
    return results
  }
  const { data, error } = await supabase!.from("match_results").select("*")
  if (error) throw error
  const results: Record<string, any> = {}
  ;(data || []).forEach((r: any) => {
    results[r.match_id] = {
      homeScore: r.home_score,
      awayScore: r.away_score,
      status: r.status,
      homePenalties: r.home_penalties,
      awayPenalties: r.away_penalties,
    }
  })
  return results
}

export async function saveMatchResultAsync(
  matchId: string,
  homeScore: number,
  awayScore: number,
  homePenalties?: number,
  awayPenalties?: number
): Promise<void> {
  if (!isSupabaseConfigured()) {
    localStore.saveMatchResult(matchId, homeScore, awayScore, homePenalties, awayPenalties)
    return
  }
  const { error } = await supabase!.from("match_results").upsert({
    match_id: matchId,
    home_score: homeScore,
    away_score: awayScore,
    home_penalties: homePenalties ?? null,
    away_penalties: awayPenalties ?? null,
    status: "finished",
    updated_at: new Date().toISOString(),
  })
  if (error) throw error
  notify()
}

// --- Settings ---

export async function checkAdminPasswordAsync(password: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return localStore.checkAdminPassword(password)
  }
  const { data, error } = await supabase!.from("settings").select("value").eq("key", "admin_password").single()
  if (error) return false
  return data.value === password
}
