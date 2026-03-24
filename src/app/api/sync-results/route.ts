import { NextRequest, NextResponse } from "next/server"
import { supabaseServer, isServerConfigured } from "@/lib/supabase-server"

const API_KEY = process.env.FOOTBALL_API_KEY || ""
const BASE_URL = "https://v3.football.api-sports.io"
const WORLD_CUP_LEAGUE_ID = 1
const WORLD_CUP_SEASON = 2026

export async function POST(request: NextRequest) {
  if (!isServerConfigured()) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 })
  }

  const { participantId } = await request.json()

  // Validate admin
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

  if (!API_KEY) {
    return NextResponse.json({ error: "Football API key not configured" }, { status: 500 })
  }

  const today = new Date().toISOString().split("T")[0]
  const response = await fetch(
    `${BASE_URL}/fixtures?league=${WORLD_CUP_LEAGUE_ID}&season=${WORLD_CUP_SEASON}&date=${today}`,
    { headers: { "x-apisports-key": API_KEY } }
  )

  if (!response.ok) {
    return NextResponse.json({ error: `API error: ${response.status}` }, { status: 502 })
  }

  const json = await response.json()
  const fixtures = json.response || []

  return NextResponse.json({ results: fixtures })
}
