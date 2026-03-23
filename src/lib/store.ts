"use client"

import { BolaoData, Match, Participant, Prediction } from "./types"
import { STORAGE_KEY, BOLAO_UPDATED_EVENT, DEFAULT_SCORING, DEFAULT_POOL_NAME, DEFAULT_ADMIN_PASSWORD } from "./constants"
import { ALL_MATCHES } from "./matches-data"
import { TEAMS } from "./teams-data"

function getDefaultData(): BolaoData {
  return {
    teams: [...TEAMS],
    matches: ALL_MATCHES.map((m) => ({ ...m })),
    participants: [],
    predictions: [],
    adminPassword: DEFAULT_ADMIN_PASSWORD,
    activeParticipantId: null,
    settings: {
      poolName: DEFAULT_POOL_NAME,
      scoringSystem: { ...DEFAULT_SCORING },
    },
  }
}

export function getBolaoData(): BolaoData {
  if (typeof window === "undefined") return getDefaultData()
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const data = getDefaultData()
    saveBolaoData(data)
    return data
  }
  return JSON.parse(raw)
}

export function saveBolaoData(data: BolaoData): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  window.dispatchEvent(new CustomEvent(BOLAO_UPDATED_EVENT))
}

// Participant operations
export function addParticipant(name: string, email?: string, phone?: string): Participant {
  const data = getBolaoData()
  const participant: Participant = {
    id: crypto.randomUUID(),
    name,
    email,
    phone,
    createdAt: new Date().toISOString(),
    isAdmin: data.participants.length === 0, // First participant is admin
  }
  data.participants.push(participant)
  if (!data.activeParticipantId) {
    data.activeParticipantId = participant.id
  }
  saveBolaoData(data)
  return participant
}

export function removeParticipant(id: string): void {
  const data = getBolaoData()
  data.participants = data.participants.filter((p) => p.id !== id)
  data.predictions = data.predictions.filter((p) => p.participantId !== id)
  if (data.activeParticipantId === id) {
    data.activeParticipantId = data.participants[0]?.id ?? null
  }
  saveBolaoData(data)
}

export function setActiveParticipant(id: string): void {
  const data = getBolaoData()
  data.activeParticipantId = id
  saveBolaoData(data)
}

// Prediction operations
export function savePrediction(participantId: string, matchId: string, homeScore: number, awayScore: number): void {
  const data = getBolaoData()
  const existing = data.predictions.find(
    (p) => p.participantId === participantId && p.matchId === matchId
  )
  if (existing) {
    existing.homeScore = homeScore
    existing.awayScore = awayScore
    existing.updatedAt = new Date().toISOString()
  } else {
    data.predictions.push({
      id: crypto.randomUUID(),
      participantId,
      matchId,
      homeScore,
      awayScore,
      updatedAt: new Date().toISOString(),
    })
  }
  saveBolaoData(data)
}

export function getPredictionsForParticipant(participantId: string): Prediction[] {
  const data = getBolaoData()
  return data.predictions.filter((p) => p.participantId === participantId)
}

// Match result operations (admin)
export function saveMatchResult(
  matchId: string,
  homeScore: number,
  awayScore: number,
  homePenalties?: number,
  awayPenalties?: number
): void {
  const data = getBolaoData()
  const match = data.matches.find((m) => m.id === matchId)
  if (match) {
    match.homeScore = homeScore
    match.awayScore = awayScore
    match.homePenalties = homePenalties
    match.awayPenalties = awayPenalties
    match.status = "finished"
    saveBolaoData(data)
  }
}

export function updateMatchTeams(matchId: string, homeTeamId: string, awayTeamId: string): void {
  const data = getBolaoData()
  const match = data.matches.find((m) => m.id === matchId)
  if (match) {
    match.homeTeamId = homeTeamId
    match.awayTeamId = awayTeamId
    saveBolaoData(data)
  }
}

// Export/Import
export function exportData(): string {
  return JSON.stringify(getBolaoData(), null, 2)
}

export function importData(json: string): boolean {
  try {
    const data = JSON.parse(json) as BolaoData
    if (!data.teams || !data.matches || !data.participants) return false
    saveBolaoData(data)
    return true
  } catch {
    return false
  }
}

// Admin
export function checkAdminPassword(password: string): boolean {
  const data = getBolaoData()
  return data.adminPassword === password
}

export function changeAdminPassword(newPassword: string): void {
  const data = getBolaoData()
  data.adminPassword = newPassword
  saveBolaoData(data)
}

export function updateScoringSystem(scoring: Partial<BolaoData["settings"]["scoringSystem"]>): void {
  const data = getBolaoData()
  data.settings.scoringSystem = { ...data.settings.scoringSystem, ...scoring }
  saveBolaoData(data)
}

export function updatePoolName(name: string): void {
  const data = getBolaoData()
  data.settings.poolName = name
  saveBolaoData(data)
}
