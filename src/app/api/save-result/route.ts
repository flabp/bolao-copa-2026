import { NextRequest, NextResponse } from "next/server"
import { supabaseServer, isServerConfigured } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  if (!isServerConfigured()) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 })
  }

  const { participantId, matchId, homeScore, awayScore, homePenalties, awayPenalties } = await request.json()

  // Validate admin status server-side
  if (!participantId) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
  }

  const { data: participant } = await supabaseServer!
    .from("participants")
    .select("id, is_admin")
    .eq("id", participantId)
    .single()

  if (!participant || !participant.is_admin) {
    return NextResponse.json({ error: "Acesso restrito a administradores" }, { status: 403 })
  }

  // Save result
  const { error } = await supabaseServer!.from("match_results").upsert({
    match_id: matchId,
    home_score: homeScore,
    away_score: awayScore,
    home_penalties: homePenalties ?? null,
    away_penalties: awayPenalties ?? null,
    status: "finished",
    updated_at: new Date().toISOString(),
  })

  if (error) {
    return NextResponse.json({ error: "Erro ao salvar resultado" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
