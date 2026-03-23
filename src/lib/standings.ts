import { GroupStanding, Match, Team } from "./types"

export function calculateGroupStandings(
  matches: Match[],
  teams: Team[],
  group: string
): GroupStanding[] {
  const groupTeams = teams.filter((t) => t.group === group)
  const groupMatches = matches.filter((m) => m.group === group && m.status === "finished")

  const standings: GroupStanding[] = groupTeams.map((team) => ({
    team,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
  }))

  for (const match of groupMatches) {
    if (match.homeScore === undefined || match.awayScore === undefined) continue

    const home = standings.find((s) => s.team.id === match.homeTeamId)
    const away = standings.find((s) => s.team.id === match.awayTeamId)
    if (!home || !away) continue

    home.played++
    away.played++
    home.goalsFor += match.homeScore
    home.goalsAgainst += match.awayScore
    away.goalsFor += match.awayScore
    away.goalsAgainst += match.homeScore

    if (match.homeScore > match.awayScore) {
      home.won++
      home.points += 3
      away.lost++
    } else if (match.homeScore < match.awayScore) {
      away.won++
      away.points += 3
      home.lost++
    } else {
      home.drawn++
      away.drawn++
      home.points += 1
      away.points += 1
    }
  }

  // Update goal difference
  standings.forEach((s) => {
    s.goalDifference = s.goalsFor - s.goalsAgainst
  })

  // Sort: points desc, goal diff desc, goals for desc
  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
    return b.goalsFor - a.goalsFor
  })

  return standings
}
