/**
 * Football API Integration for automatic match result updates.
 * Uses API-Football (https://www.api-football.com/)
 * Free tier: 100 requests/day
 *
 * The FIFA World Cup 2026 league ID in API-Football is typically 1.
 * Season: 2026
 */

// API key is now server-side only (FOOTBALL_API_KEY, no NEXT_PUBLIC_ prefix)
// Client-side code should call /api/sync-results instead of using this directly
const API_KEY = ""

const BASE_URL = "https://v3.football.api-sports.io"

// FIFA World Cup 2026 IDs - may need updating when the tournament starts
const WORLD_CUP_LEAGUE_ID = 1 // FIFA World Cup
const WORLD_CUP_SEASON = 2026

interface ApiFixture {
  fixture: {
    id: number
    date: string
    status: {
      short: string // "FT", "NS", "1H", "2H", "HT", "ET", "PEN", "AET"
      long: string
    }
  }
  teams: {
    home: { id: number; name: string }
    away: { id: number; name: string }
  }
  goals: {
    home: number | null
    away: number | null
  }
  score: {
    penalty: {
      home: number | null
      away: number | null
    }
  }
}

interface MatchResultFromApi {
  apiFixtureId: number
  homeTeamName: string
  awayTeamName: string
  homeScore: number
  awayScore: number
  homePenalties?: number
  awayPenalties?: number
  status: "scheduled" | "in_progress" | "finished"
  dateTime: string
}

// Map API team names to our team IDs
const TEAM_NAME_MAP: Record<string, string> = {
  "Mexico": "MEX",
  "South Africa": "ZAF",
  "South Korea": "KOR",
  "Canada": "CAN",
  "Switzerland": "SUI",
  "Qatar": "QAT",
  "Brazil": "BRA",
  "Morocco": "MAR",
  "Haiti": "HTI",
  "Scotland": "SCO",
  "USA": "USA",
  "United States": "USA",
  "Paraguay": "PAR",
  "Australia": "AUS",
  "Germany": "GER",
  "Curacao": "CUR",
  "Curaçao": "CUR",
  "Ivory Coast": "CIV",
  "Côte d'Ivoire": "CIV",
  "Cote D'Ivoire": "CIV",
  "Ecuador": "ECU",
  "Netherlands": "NED",
  "Holland": "NED",
  "Japan": "JPN",
  "Tunisia": "TUN",
  "Belgium": "BEL",
  "Egypt": "EGY",
  "Iran": "IRN",
  "New Zealand": "NZL",
  "Spain": "ESP",
  "Cape Verde": "CPV",
  "Cabo Verde": "CPV",
  "Saudi Arabia": "KSA",
  "Uruguay": "URU",
  "France": "FRA",
  "Senegal": "SEN",
  "Norway": "NOR",
  "Argentina": "ARG",
  "Algeria": "ALG",
  "Austria": "AUT",
  "Jordan": "JOR",
  "Portugal": "POR",
  "Uzbekistan": "UZB",
  "Colombia": "COL",
  "England": "ENG",
  "Croatia": "CRO",
  "Ghana": "GHA",
  "Panama": "PAN",
}

function mapApiStatus(status: string): "scheduled" | "in_progress" | "finished" {
  const finished = ["FT", "AET", "PEN"]
  const inProgress = ["1H", "2H", "HT", "ET"]
  if (finished.includes(status)) return "finished"
  if (inProgress.includes(status)) return "in_progress"
  return "scheduled"
}

export function isFootballApiConfigured(): boolean {
  return !!API_KEY
}

export async function fetchWorldCupResults(): Promise<MatchResultFromApi[]> {
  if (!API_KEY) {
    throw new Error("API-Football key not configured. Add NEXT_PUBLIC_FOOTBALL_API_KEY to .env.local")
  }

  const response = await fetch(
    `${BASE_URL}/fixtures?league=${WORLD_CUP_LEAGUE_ID}&season=${WORLD_CUP_SEASON}`,
    {
      headers: {
        "x-apisports-key": API_KEY,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  const json = await response.json()
  const fixtures: ApiFixture[] = json.response || []

  return fixtures
    .filter((f) => f.fixture.status.short !== "NS") // exclude not started
    .map((f) => ({
      apiFixtureId: f.fixture.id,
      homeTeamName: f.teams.home.name,
      awayTeamName: f.teams.away.name,
      homeScore: f.goals.home ?? 0,
      awayScore: f.goals.away ?? 0,
      homePenalties: f.score.penalty.home ?? undefined,
      awayPenalties: f.score.penalty.away ?? undefined,
      status: mapApiStatus(f.fixture.status.short),
      dateTime: f.fixture.date,
    }))
}

// Fetch only today's matches (lighter on API quota)
export async function fetchTodayResults(): Promise<MatchResultFromApi[]> {
  if (!API_KEY) {
    throw new Error("API-Football key not configured")
  }

  const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD

  const response = await fetch(
    `${BASE_URL}/fixtures?league=${WORLD_CUP_LEAGUE_ID}&season=${WORLD_CUP_SEASON}&date=${today}`,
    {
      headers: {
        "x-apisports-key": API_KEY,
      },
    }
  )

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  const json = await response.json()
  const fixtures: ApiFixture[] = json.response || []

  return fixtures.map((f) => ({
    apiFixtureId: f.fixture.id,
    homeTeamName: f.teams.home.name,
    awayTeamName: f.teams.away.name,
    homeScore: f.goals.home ?? 0,
    awayScore: f.goals.away ?? 0,
    homePenalties: f.score.penalty.home ?? undefined,
    awayPenalties: f.score.penalty.away ?? undefined,
    status: mapApiStatus(f.fixture.status.short),
    dateTime: f.fixture.date,
  }))
}

export function findMatchingTeamId(apiTeamName: string): string | undefined {
  // Try direct mapping first
  if (TEAM_NAME_MAP[apiTeamName]) return TEAM_NAME_MAP[apiTeamName]

  // Try case-insensitive search
  const lower = apiTeamName.toLowerCase()
  for (const [key, value] of Object.entries(TEAM_NAME_MAP)) {
    if (key.toLowerCase() === lower) return value
  }

  return undefined
}

export { type MatchResultFromApi }
