"use client"

import { useBolao } from "@/hooks/use-bolao"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Calendar, Target, Timer, MapPin } from "lucide-react"
import { getTeamById } from "@/lib/teams-data"
import { TeamFlag } from "@/components/team-flag"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useState, useEffect } from "react"

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return timeLeft
}

export default function HomePage() {
  const {
    participants,
    leaderboard,
    matches,
    finishedMatchesCount,
    totalMatches,
    userPredictionsCount,
  } = useBolao()
  const { currentParticipantId, currentParticipantName } = useAuth()

  const countdown = useCountdown("2026-06-11T18:00:00-04:00")

  const upcomingMatches = matches
    .filter((m) => m.status === "scheduled" && new Date(m.dateTime) > new Date())
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .slice(0, 5)

  const myRank = leaderboard.find((e) => e.participant.id === currentParticipantId)
  const myPoints = myRank?.totalPoints ?? 0

  return (
    <div className="space-y-6 -mt-4">
      {/* HERO - Stadium Background */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl min-h-[320px] flex flex-col justify-end">
        {/* Stadium Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/stadium.jpg')",
          }}
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/60 to-transparent" />

        {/* Content */}
        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            {/* Title */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  FIFA 2026
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Bolao Copa<br />do Mundo
              </h1>
              <p className="mt-2 text-slate-300 text-sm sm:text-base flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                EUA / Mexico / Canada
              </p>
            </div>

            {/* Countdown */}
            <div className="flex gap-3">
              {[
                { value: countdown.days, label: "Dias" },
                { value: countdown.hours, label: "Horas" },
                { value: countdown.minutes, label: "Min" },
                { value: countdown.seconds, label: "Seg" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                    <span className="text-xl sm:text-2xl font-bold text-white tabular-nums">
                      {item.value.toString().padStart(2, "0")}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-400 mt-1 block">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      {currentParticipantName && (
        <div className="flex items-center gap-3 px-1">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {currentParticipantName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Bem-vindo de volta,</p>
            <p className="font-bold text-lg -mt-0.5">{currentParticipantName}</p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Participantes</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{participants.length}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Jogos Finalizados</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {finishedMatchesCount} <span className="text-sm font-normal text-muted-foreground">/ {totalMatches}</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
                style={{ width: `${totalMatches > 0 ? (finishedMatchesCount / totalMatches) * 100 : 0}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Meus Palpites</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Target className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {userPredictionsCount} <span className="text-sm font-normal text-muted-foreground">/ {totalMatches}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Minha Posicao</CardTitle>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
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
                      "flex items-center justify-between rounded-xl p-3 transition-all duration-200 " +
                      (entry.participant.id === currentParticipantId
                        ? "ring-2 ring-amber-400 bg-amber-50 shadow-sm"
                        : idx === 0
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
                        <p className="font-semibold">
                          {entry.participant.name}
                          {entry.participant.id === currentParticipantId && (
                            <span className="ml-2 text-xs text-amber-600 font-medium">Voce</span>
                          )}
                        </p>
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
                    <div key={match.id} className="rounded-xl border bg-card p-3 hover:border-blue-200 hover:shadow-sm transition-all duration-200">
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
                        <span className="flex items-center gap-1">
                          <Timer className="h-3 w-3" />
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
