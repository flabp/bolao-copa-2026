import { ScoringSystem } from "./types"

export const STORAGE_KEY = "bolao-copa-2026"
export const BOLAO_UPDATED_EVENT = "bolao-updated"

export const DEFAULT_SCORING: ScoringSystem = {
  exactScore: 10,
  correctResult: 5,
  correctGoalDiff: 3,
  correctOneTeamScore: 1,
  knockoutMultiplier: 1.5,
  lateKnockoutMultiplier: 2,
}

export const DEFAULT_POOL_NAME = "Bolao da Copa 2026"
export const DEFAULT_ADMIN_PASSWORD = "admin123"
