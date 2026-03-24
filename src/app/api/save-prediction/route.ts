import { NextRequest, NextResponse } from "next/server"
import { supabaseServer, isServerConfigured } from "@/lib/supabase-server"

// Import matches data for lockout validation
import { ALL_MATCHES } from "@/lib/matches-data"

export async function POST(request: NextRequest) {
  if (!isServerConfigured()) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 })
  }

  const { participantId, matchId, homeScore, awayScore } = await request.json()

  if (!participantId || !matchId || homeScore === undefined || awayScore === undefined) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
  }

  // Validate scores
  const h = Math.min(99, Math.max(0, parseInt(homeScore)))
  const a = Math.min(99, Math.max(0, parseInt(awayScore)))
  if (isNaN(h) || isNaN(a)) {
    return NextResponse.json({ error: "Placar invalido" }, { status: 400 })
  }

  // Server-side lockout check
  const match = ALL_MATCHES.find(m => m.id === matchId)
  if (match) {
    const kickoff = new Date(match.dateTime).getTime()
    const now = Date.now()
    const tenMinutes = 10 * 60 * 1000
    if (now >= kickoff - tenMinutes) {
      return NextResponse.json({ error: "Palpite bloqueado. Faltam menos de 10 minutos para o jogo." }, { status: 403 })
    }
  }

  // Verify participant exists
  const { data: participant } = await supabaseServer!
    .from("participants")
    .select("id")
    .eq("id", participantId)
    .single()

  if (!participant) {
    return NextResponse.json({ error: "Participante nao encontrado" }, { status: 404 })
  }

  // Save prediction
  const { error } = await supabaseServer!.from("predictions").upsert({
    participant_id: participantId,
    match_id: matchId,
    home_score: h,
    away_score: a,
    updated_at: new Date().toISOString(),
  }, { onConflict: "participant_id,match_id" })

  if (error) {
    return NextResponse.json({ error: "Erro ao salvar palpite" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
