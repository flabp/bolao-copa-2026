export interface Team {
  id: string
  name: string
  shortName: string
  flag: string
  group: string
  isPlaceholder: boolean
  placeholderLabel?: string
}

export type MatchPhase =
  | "group"
  | "round-of-32"
  | "round-of-16"
  | "quarter-finals"
  | "semi-finals"
  | "third-place"
  | "final"

export interface Match {
  id: string
  homeTeamId: string
  awayTeamId: string
  group?: string
  phase: MatchPhase
  matchday?: number
  dateTime: string
  venue: string
  city: string
  country: string
  status: "scheduled" | "in_progress" | "finished"
  homeScore?: number
  awayScore?: number
  homePenalties?: number
  awayPenalties?: number
}

export interface Participant {
  id: string
  name: string
  email?: string
  phone?: string
  createdAt: string
  isAdmin: boolean
}

export interface Prediction {
  id: string
  participantId: string
  matchId: string
  homeScore: number
  awayScore: number
  updatedAt: string
}

export interface PointsBreakdown {
  participantId: string
  matchId: string
  exactScore: boolean
  correctResult: boolean
  correctGoalDiff: boolean
  correctHomeScore: boolean
  correctAwayScore: boolean
  points: number
}

export interface LeaderboardEntry {
  participant: Participant
  totalPoints: number
  exactScores: number
  correctResults: number
  matchesPredicted: number
  rank: number
}

export interface ScoringSystem {
  exactScore: number
  correctResult: number
  correctGoalDiff: number
  correctOneTeamScore: number
  knockoutMultiplier: number
  lateKnockoutMultiplier: number
}

export interface BolaoData {
  teams: Team[]
  matches: Match[]
  participants: Participant[]
  predictions: Prediction[]
  adminPassword: string
  activeParticipantId: string | null
  settings: {
    poolName: string
    scoringSystem: ScoringSystem
  }
}

export interface GroupStanding {
  team: Team
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
}

export const PHASE_LABELS: Record<MatchPhase, string> = {
  group: "Fase de Grupos",
  "round-of-32": "32 avos de Final",
  "round-of-16": "Oitavas de Final",
  "quarter-finals": "Quartas de Final",
  "semi-finals": "Semifinais",
  "third-place": "Disputa de 3o Lugar",
  final: "Final",
}
