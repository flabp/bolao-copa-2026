"use client"

import { useState } from "react"
import { useBolao } from "@/hooks/use-bolao"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"
import { getTeamById } from "@/lib/teams-data"
import { GROUPS } from "@/lib/teams-data"
import { TeamFlag } from "@/components/team-flag"
import { MatchPhase, PHASE_LABELS } from "@/lib/types"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const PHASES: MatchPhase[] = ["group", "round-of-32", "round-of-16", "quarter-finals", "semi-finals", "third-place", "final"]

export default function JogosPage() {
  const { matches } = useBolao()
  const [activePhase, setActivePhase] = useState<string>("group")
  const [groupFilter, setGroupFilter] = useState<string>("all")

  const filteredMatches = matches.filter((m) => {
    if (m.phase !== activePhase) return false
    if (activePhase === "group" && groupFilter !== "all" && m.group !== groupFilter) return false
    return true
  }).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Calendar className="h-5 w-5" />
          </div>
          Jogos
        </h1>
        <p className="text-muted-foreground mt-1">Todos os 104 jogos da Copa do Mundo 2026</p>
      </div>

      <Tabs value={activePhase} onValueChange={setActivePhase}>
        <div className="flex flex-wrap items-center gap-3">
          <TabsList className="flex-wrap">
            {PHASES.map((phase) => (
              <TabsTrigger key={phase} value={phase} className="text-xs sm:text-sm">
                {phase === "group" ? "Grupos" : PHASE_LABELS[phase]}
              </TabsTrigger>
            ))}
          </TabsList>

          {activePhase === "group" && (
            <Select value={groupFilter} onValueChange={(v) => v && setGroupFilter(v)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {GROUPS.map((g) => (
                  <SelectItem key={g} value={g}>Grupo {g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {PHASES.map((phase) => (
          <TabsContent key={phase} value={phase}>
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredMatches.map((match) => {
                const home = getTeamById(match.homeTeamId)
                const away = getTeamById(match.awayTeamId)
                const isFinished = match.status === "finished"

                return (
                  <Card key={match.id} className={
                    "border-0 shadow-sm hover:shadow-md transition-shadow " +
                    (isFinished ? "ring-1 ring-green-200" : "")
                  }>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className="text-xs">
                          {match.group ? `Grupo ${match.group}` : PHASE_LABELS[match.phase]}
                        </Badge>
                        {isFinished && <Badge className="bg-emerald-500 text-white">Encerrado</Badge>}
                        {match.status === "in_progress" && <Badge className="bg-amber-500 text-white">Ao Vivo</Badge>}
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <TeamFlag teamId={match.homeTeamId} />
                          <span className="font-semibold text-sm truncate">
                            {home?.name ?? match.homeTeamId}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 px-3 shrink-0">
                          {isFinished ? (
                            <span className="text-lg font-bold tabular-nums">
                              {match.homeScore} - {match.awayScore}
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-muted-foreground uppercase">vs</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                          <span className="font-semibold text-sm truncate text-right">
                            {away?.name ?? match.awayTeamId}
                          </span>
                          <TeamFlag teamId={match.awayTeamId} />
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {format(new Date(match.dateTime), "dd/MM/yyyy 'as' HH:mm", { locale: ptBR })}
                        </span>
                        <span className="truncate ml-2 text-right">{match.city}</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            {filteredMatches.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Nenhum jogo encontrado para este filtro.
              </p>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
