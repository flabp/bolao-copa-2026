"use client"

import { useCallback, useEffect, useState } from "react"
import { LeaderboardEntry, Match, MatchPhase, Prediction, Participant, ScoringSystem } from "@/lib/types"
import { getBolaoData } from "@/lib/store"
import {
  getParticipants,
  getPredictionsForParticipantAsync,
  getMatchResults,
} from "@/lib/supabase-store"
import { isSupabaseConfigured } from "@/lib/supabase"
import { ALL_MATCHES } from "@/lib/matches-data"
import { TEAMS } from "@/lib/teams-data"
import { BOLAO_UPDATED_EVENT, DEFAULT_SCORING } from "@/lib/constants"
import { calculateLeaderboard } from "@/lib/scoring"
import { useAuth } from "@/hooks/use-auth"

export function useBolao() {
  const { currentParticipantId } = useAuth()
  const [matches, setMatches] = useState<Match[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [allPredictions, setAllPredictions] = useState<Prediction[]>([])
  const [participants, setParticipants] = useState<Participant[]>([])
  const [settings, setSettings] = useState<{ scoringSystem: ScoringSystem } | null>(null)
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    try {
      if (isSupabaseConfigured()) {
        // Load participants from Supabase
        const parts = await getParticipants()
        setParticipants(parts)

        // Load match results from Supabase and merge with static match data
        const results = await getMatchResults()
        const mergedMatches = ALL_MATCHES.map((m) => {
          const result = results[m.id]
          if (result) {
            return {
              ...m,
              homeScore: result.homeScore,
              awayScore: result.awayScore,
              homePenalties: result.homePenalties,
              awayPenalties: result.awayPenalties,
              status: result.status as Match["status"],
            }
          }
          return m
        })
        setMatches(mergedMatches)

        // Load current user's predictions
        if (currentParticipantId) {
          const preds = await getPredictionsForParticipantAsync(currentParticipantId)
          setPredictions(preds)
        }

        // Load all predictions for leaderboard
        const allPreds: Prediction[] = []
        for (const p of parts) {
          const pPreds = await getPredictionsForParticipantAsync(p.id)
          allPreds.push(...pPreds)
        }
        setAllPredictions(allPreds)

        setSettings({ scoringSystem: DEFAULT_SCORING })
      } else {
        // Fallback to localStorage
        const data = getBolaoData()
        setMatches(data.matches)
        setPredictions(data.predictions)
        setAllPredictions(data.predictions)
        setParticipants(data.participants)
        setSettings(data.settings)
      }
    } catch (err) {
      console.error("Error loading bolao data:", err)
      // Fallback to localStorage on error
      const data = getBolaoData()
      setMatches(data.matches)
      setPredictions(data.predictions)
      setAllPredictions(data.predictions)
      setParticipants(data.participants)
      setSettings(data.settings)
    } finally {
      setLoading(false)
    }
  }, [currentParticipantId])

  useEffect(() => {
    reload()
    const handler = () => reload()
    window.addEventListener(BOLAO_UPDATED_EVENT, handler)
    return () => {
      window.removeEventListener(BOLAO_UPDATED_EVENT, handler)
    }
  }, [reload])

  const teams = TEAMS
  const activeParticipantId = currentParticipantId
  const activeParticipant = participants.find((p) => p.id === activeParticipantId) ?? null

  const leaderboard: LeaderboardEntry[] = settings
    ? calculateLeaderboard(participants, allPredictions, matches, settings.scoringSystem)
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

  const savePrediction = async (matchId: string, homeScore: number, awayScore: number) => {
    if (!activeParticipantId) return
    const res = await fetch("/api/save-prediction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId: activeParticipantId, matchId, homeScore, awayScore }),
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || "Erro ao salvar palpite")
    }
    // Update local state immediately
    setPredictions((prev) => {
      const existing = prev.findIndex((p) => p.matchId === matchId && p.participantId === activeParticipantId)
      const newPred: Prediction = {
        id: `${activeParticipantId}-${matchId}`,
        participantId: activeParticipantId,
        matchId,
        homeScore,
        awayScore,
        updatedAt: new Date().toISOString(),
      }
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = newPred
        return updated
      }
      return [...prev, newPred]
    })
  }

  const saveResult = async (matchId: string, homeScore: number, awayScore: number, homePen?: number, awayPen?: number) => {
    const res = await fetch("/api/save-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        participantId: activeParticipantId,
        matchId,
        homeScore,
        awayScore,
        homePenalties: homePen,
        awayPenalties: awayPen,
      }),
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || "Erro ao salvar resultado")
    }
    // Update local match state
    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId
          ? { ...m, homeScore, awayScore, homePenalties: homePen, awayPenalties: awayPen, status: "finished" as const }
          : m
      )
    )
  }

  const finishedMatchesCount = matches.filter((m) => m.status === "finished").length
  const totalMatches = matches.length
  const userPredictionsCount = activeParticipantId
    ? predictions.filter((p) => p.participantId === activeParticipantId).length
    : 0

  const isMatchLocked = (match: Match): boolean => {
    if (match.status !== "scheduled") return true
    const kickoff = new Date(match.dateTime).getTime()
    const now = Date.now()
    const tenMinutes = 10 * 60 * 1000
    return now >= kickoff - tenMinutes
  }

  return {
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
    loading,
    getMatchesByPhase,
    getMatchesByGroup,
    getPrediction,
    savePrediction,
    saveResult,
    isMatchLocked,
    reload,
  }
}
