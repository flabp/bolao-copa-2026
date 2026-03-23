"use client"

import { useCallback, useEffect, useState } from "react"
import { BolaoData, LeaderboardEntry, Match, MatchPhase, Prediction } from "@/lib/types"
import { getBolaoData, savePrediction as storeSavePrediction, saveMatchResult as storeSaveResult } from "@/lib/store"
import { BOLAO_UPDATED_EVENT } from "@/lib/constants"
import { calculateLeaderboard } from "@/lib/scoring"
import { useAuth } from "@/hooks/use-auth"

export function useBolao() {
  const [data, setData] = useState<BolaoData | null>(null)
  const { currentParticipantId } = useAuth()

  const reload = useCallback(() => {
    setData(getBolaoData())
  }, [])

  useEffect(() => {
    reload()
    const handler = () => reload()
    window.addEventListener(BOLAO_UPDATED_EVENT, handler)
    window.addEventListener("storage", handler)
    return () => {
      window.removeEventListener(BOLAO_UPDATED_EVENT, handler)
      window.removeEventListener("storage", handler)
    }
  }, [reload])

  const matches = data?.matches ?? []
  const predictions = data?.predictions ?? []
  const participants = data?.participants ?? []
  const teams = data?.teams ?? []
  const settings = data?.settings
  const activeParticipantId = currentParticipantId

  const activeParticipant = participants.find((p) => p.id === activeParticipantId) ?? null

  const leaderboard: LeaderboardEntry[] = settings
    ? calculateLeaderboard(participants, predictions, matches, settings.scoringSystem)
    : []

  const getMatchesByPhase = (phase: MatchPhase): Match[] =>
    matches.filter((m) => m.phase === phase)

  const getMatchesByGroup = (group: string): Match[] =>
    matches.filter((m) => m.group === group)

  const getPrediction = (matchId: string, participantId?: string): Prediction | undefined => {
    const pid = participantId ?? activeParticipantId
    if (!pid) return undefined
    return predictions.find((p) => p.matchId === matchId && p.participantId === pid)
  }

  const savePrediction = (matchId: string, homeScore: number, awayScore: number) => {
    if (!activeParticipantId) return
    storeSavePrediction(activeParticipantId, matchId, homeScore, awayScore)
  }

  const saveResult = (matchId: string, homeScore: number, awayScore: number, homePen?: number, awayPen?: number) => {
    storeSaveResult(matchId, homeScore, awayScore, homePen, awayPen)
  }

  const finishedMatchesCount = matches.filter((m) => m.status === "finished").length
  const totalMatches = matches.length
  const userPredictionsCount = activeParticipantId
    ? predictions.filter((p) => p.participantId === activeParticipantId).length
    : 0

  const isMatchLocked = (match: Match): boolean => {
    return match.status !== "scheduled" || new Date(match.dateTime) <= new Date()
  }

  return {
    data,
    matches,
    predictions,
    participants,
    teams,
    settings,
    activeParticipant,
    activeParticipantId,
    leaderboard,
    finishedMatchesCount,
    totalMatches,
    userPredictionsCount,
    getMatchesByPhase,
    getMatchesByGroup,
    getPrediction,
    savePrediction,
    saveResult,
    isMatchLocked,
    reload,
  }
}
