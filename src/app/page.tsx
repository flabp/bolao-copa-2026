"use client"

import { useBolao } from "@/hooks/use-bolao"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Calendar, Target } from "lucide-react"
import { getTeamById } from "@/lib/teams-data"
import { TeamFlag } from "@/components/team-flag"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function HomePage() {
  const {
    participants,
    leaderboard,
    matches,
    finishedMatchesCount,
    totalMatches,
    userPredictionsCount,
    activeParticipantId,
  } = useBolao()

  const upcomingMatches = matches
    .filter((m) => m.status === "scheduled" && new Date(m.dateTime) > new Date())
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .slice(0, 5)

  const myRank = leaderboard.find((e) => e.participant.id === activeParticipantId)
  const myPoints = myRank?.totalPoints ?? 0

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1e3a5f] to-[#0f172a] px-6 py-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent" />
        <div className="relative">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Bolao Copa 2026
          </h1>
          <p className="mt-2 text-base text-slate-300">
            Copa do Mundo FIFA 2026 — EUA, Mexico e Canada
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Participantes</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{participants.length}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Jogos Finalizados</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {finishedMatchesCount} <span className="text-sm font-normal text-muted-foreground">/ {totalMatches}</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${(finishedMatchesCount / totalMatches) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Meus Palpites</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Target className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {userPredictionsCount} <span className="text-sm font-normal text-muted-foreground">/ {totalMatches}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Minha Posicao</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Trophy className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {myRank ? `${myRank.rank}o` : "-"}
            </div>
            <p className="text-sm text-muted-foreground">{myPoints} pontos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top 5 Ranking */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-amber-500" />
              Ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboard.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum participante cadastrado ainda.
              </p>
            ) : (
              <div className="space-y-2">
                {leaderboard.slice(0, 5).map((entry, idx) => (
                  <div
                    key={entry.participant.id}
                    className={
                      "flex items-center justify-between rounded-xl p-3 transition-colors " +
                      (idx === 0
                        ? "bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200"
                        : idx === 1
                        ? "bg-gradient-to-r from-slate-50 to-slate-100/50 border border-slate-200"
                        : idx === 2
                        ? "bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200"
                        : "border bg-card")
                    }
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={
                          "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold " +
                          (idx === 0
                            ? "bg-amber-500 text-white"
                            : idx === 1
                            ? "bg-slate-400 text-white"
                            : idx === 2
                            ? "bg-orange-400 text-white"
                            : "bg-slate-100 text-slate-600")
                        }
                      >
                        {entry.rank}
                      </span>
                      <div>
                        <p className="font-semibold">{entry.participant.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.exactScores} placares exatos
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-base font-bold px-3">
                      {entry.totalPoints} pts
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Proximos Jogos */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-blue-500" />
              Proximos Jogos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingMatches.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum jogo programado.
              </p>
            ) : (
              <div className="space-y-2">
                {upcomingMatches.map((match) => {
                  const home = getTeamById(match.homeTeamId)
                  const away = getTeamById(match.awayTeamId)
                  return (
                    <div key={match.id} className="rounded-xl border bg-card p-3 hover:border-blue-200 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <TeamFlag teamId={match.homeTeamId} size="sm" />
                          <span className="font-semibold">{home?.name ?? match.homeTeamId}</span>
                        </div>
                        <span className="text-xs font-bold text-muted-foreground uppercase">vs</span>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold">{away?.name ?? match.awayTeamId}</span>
                          <TeamFlag teamId={match.awayTeamId} size="sm" />
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {format(new Date(match.dateTime), "dd/MM 'as' HH:mm", { locale: ptBR })}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {match.group ? `Grupo ${match.group}` : match.phase}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
