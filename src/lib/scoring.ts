import { Match, MatchPhase, Participant, PointsBreakdown, Prediction, ScoringSystem, LeaderboardEntry } from "./types"

function getPhaseMultiplier(phase: MatchPhase, scoring: ScoringSystem): number {
  switch (phase) {
    case "group":
      return 1
    case "round-of-32":
    case "round-of-16":
      return scoring.knockoutMultiplier
    case "quarter-finals":
    case "semi-finals":
    case "third-place":
    case "final":
      return scoring.lateKnockoutMultiplier
  }
}

function getResultType(home: number, away: number): "home" | "draw" | "away" {
  if (home > away) return "home"
  if (home < away) return "away"
  return "draw"
}

export function calculateMatchPoints(
  prediction: Prediction,
  match: Match,
  scoring: ScoringSystem
): PointsBreakdown {
  const breakdown: PointsBreakdown = {
    participantId: prediction.participantId,
    matchId: match.id,
    exactScore: false,
    correctResult: false,
    correctGoalDiff: false,
    correctHomeScore: false,
    correctAwayScore: false,
    points: 0,
  }

  if (match.homeScore === undefined || match.awayScore === undefined) return breakdown

  const realHome = match.homeScore
  const realAway = match.awayScore
  const predHome = prediction.homeScore
  const predAway = prediction.awayScore
  const multiplier = getPhaseMultiplier(match.phase, scoring)

  // Exact score
  if (predHome === realHome && predAway === realAway) {
    breakdown.exactScore = true
    breakdown.correctResult = true
    breakdown.correctGoalDiff = true
    breakdown.correctHomeScore = true
    breakdown.correctAwayScore = true
    breakdown.points = Math.round(scoring.exactScore * multiplier)
    return breakdown
  }

  let points = 0

  // Correct result (win/draw/loss)
  const realResult = getResultType(realHome, realAway)
  const predResult = getResultType(predHome, predAway)
  if (realResult === predResult) {
    breakdown.correctResult = true
    points += scoring.correctResult
  }

  // Correct goal difference
  if (realHome - realAway === predHome - predAway) {
    breakdown.correctGoalDiff = true
    points += scoring.correctGoalDiff
  }

  // Correct individual team scores
  if (predHome === realHome) {
    breakdown.correctHomeScore = true
    points += scoring.correctOneTeamScore
  }
  if (predAway === realAway) {
    breakdown.correctAwayScore = true
    points += scoring.correctOneTeamScore
  }

  breakdown.points = Math.round(points * multiplier)
  return breakdown
}

export function calculateLeaderboard(
  participants: Participant[],
  predictions: Prediction[],
  matches: Match[],
  scoring: ScoringSystem
): LeaderboardEntry[] {
  const finishedMatches = matches.filter((m) => m.status === "finished")

  const entries: LeaderboardEntry[] = participants.map((participant) => {
    const userPredictions = predictions.filter((p) => p.participantId === participant.id)
    let totalPoints = 0
    let exactScores = 0
    let correctResults = 0

    for (const match of finishedMatches) {
      const prediction = userPredictions.find((p) => p.matchId === match.id)
      if (!prediction) continue

      const breakdown = calculateMatchPoints(prediction, match, scoring)
      totalPoints += breakdown.points
      if (breakdown.exactScore) exactScores++
      if (breakdown.correctResult) correctResults++
    }

    return {
      participant,
      totalPoints,
      exactScores,
      correctResults,
      matchesPredicted: userPredictions.length,
      rank: 0,
    }
  })

  // Sort by points (desc), then exact scores (desc), then correct results (desc)
  entries.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints
    if (b.exactScores !== a.exactScores) return b.exactScores - a.exactScores
    return b.correctResults - a.correctResults
  })

  // Assign ranks
  entries.forEach((entry, i) => {
    if (i === 0) {
      entry.rank = 1
    } else {
      const prev = entries[i - 1]
      entry.rank =
        prev.totalPoints === entry.totalPoints &&
        prev.exactScores === entry.exactScores &&
        prev.correctResults === entry.correctResults
          ? prev.rank
          : i + 1
    }
  })

  return entries
}
