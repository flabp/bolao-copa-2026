"use client"

import { useState, useCallback, useEffect } from "react"
import { useBolao } from "@/hooks/use-bolao"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PenLine, Lock, Check } from "lucide-react"
import { getTeamById, GROUPS } from "@/lib/teams-data"
import { TeamFlag } from "@/components/team-flag"
import { MatchPhase, PHASE_LABELS } from "@/lib/types"
import { useAuth } from "@/hooks/use-auth"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const PHASES: MatchPhase[] = ["group", "round-of-32", "round-of-16", "quarter-finals", "semi-finals", "third-place", "final"]

export default function PalpitesPage() {
  const {
    matches,
    activeParticipant,
    activeParticipantId,
    getPrediction,
    savePrediction,
    isMatchLocked,
    userPredictionsCount,
    totalMatches,
  } = useBolao()
  const { currentParticipantName } = useAuth()

  const [activePhase, setActivePhase] = useState<string>("group")
  const [groupFilter, setGroupFilter] = useState<string>("all")

  const filteredMatches = matches.filter((m) => {
    if (m.phase !== activePhase) return false
    if (activePhase === "group" && groupFilter !== "all" && m.group !== groupFilter) return false
    return true
  }).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 tracking-tight">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <PenLine className="h-5 w-5" />
            </div>
            Meus Palpites
          </h1>
          <p className="text-muted-foreground mt-1">
            Palpites de <span className="font-semibold text-foreground">{currentParticipantName}</span>
          </p>
        </div>
        <Badge variant="secondary" className="text-base px-4 py-1">
          {userPredictionsCount} / {totalMatches} palpites
        </Badge>
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
            <div className="space-y-3">
              {filteredMatches.map((match) => {
                const home = getTeamById(match.homeTeamId)
                const away = getTeamById(match.awayTeamId)
                const locked = isMatchLocked(match)
                const prediction = getPrediction(match.id)

                return (
                  <PredictionCard
                    key={match.id}
                    matchId={match.id}
                    homeName={home?.name ?? match.homeTeamId}
                    homeTeamId={match.homeTeamId}
                    awayName={away?.name ?? match.awayTeamId}
                    awayTeamId={match.awayTeamId}
                    dateTime={match.dateTime}
                    group={match.group}
                    phase={match.phase}
                    locked={locked}
                    predHome={prediction?.homeScore}
                    predAway={prediction?.awayScore}
                    realHome={match.homeScore}
                    realAway={match.awayScore}
                    isFinished={match.status === "finished"}
                    onSave={savePrediction}
                  />
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

function PredictionCard({
  matchId,
  homeName,
  homeTeamId,
  awayName,
  awayTeamId,
  dateTime,
  group,
  phase,
  locked,
  predHome,
  predAway,
  realHome,
  realAway,
  isFinished,
  onSave,
}: {
  matchId: string
  homeName: string
  homeTeamId: string
  awayName: string
  awayTeamId: string
  dateTime: string
  group?: string
  phase: MatchPhase
  locked: boolean
  predHome?: number
  predAway?: number
  realHome?: number
  realAway?: number
  isFinished: boolean
  onSave: (matchId: string, home: number, away: number) => void
}) {
  const [homeVal, setHomeVal] = useState(predHome?.toString() ?? "")
  const [awayVal, setAwayVal] = useState(predAway?.toString() ?? "")
  const [saved, setSaved] = useState(false)

  // Sync with async data from Supabase
  useEffect(() => {
    if (predHome !== undefined) setHomeVal(predHome.toString())
  }, [predHome])
  useEffect(() => {
    if (predAway !== undefined) setAwayVal(predAway.toString())
  }, [predAway])

  const handleSave = useCallback(
    (h: string, a: string) => {
      const hNum = Math.min(99, parseInt(h))
      const aNum = Math.min(99, parseInt(a))
      if (!isNaN(hNum) && !isNaN(aNum) && hNum >= 0 && aNum >= 0) {
        onSave(matchId, hNum, aNum)
        setSaved(true)
        setTimeout(() => setSaved(false), 1500)
      }
    },
    [matchId, onSave]
  )

  const hasPrediction = predHome !== undefined && predAway !== undefined

  let cardStyle = "border-0 shadow-sm"
  if (isFinished && hasPrediction && realHome !== undefined && realAway !== undefined) {
    if (predHome === realHome && predAway === realAway) {
      cardStyle = "ring-2 ring-emerald-400 bg-emerald-50 shadow-sm"
    } else {
      const predResult = predHome > predAway ? "h" : predHome < predAway ? "a" : "d"
      const realResult = realHome > realAway ? "h" : realHome < realAway ? "a" : "d"
      if (predResult === realResult) {
        cardStyle = "ring-2 ring-amber-400 bg-amber-50 shadow-sm"
      } else {
        cardStyle = "ring-2 ring-red-300 bg-red-50 shadow-sm"
      }
    }
  }

  return (
    <Card className={cardStyle}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {group ? `Grupo ${group}` : PHASE_LABELS[phase]}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {format(new Date(dateTime), "dd/MM HH:mm", { locale: ptBR })}
            </span>
          </div>
          {locked && <Lock className="h-4 w-4 text-muted-foreground" />}
          {saved && <Check className="h-4 w-4 text-emerald-600" />}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <TeamFlag teamId={homeTeamId} size="md" className="shrink-0" />
            <span className="font-semibold text-sm truncate">{homeName}</span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Input
              type="number"
              min={0}
              max={99}
              value={homeVal}
              onChange={(e) => {
                setHomeVal(e.target.value)
                handleSave(e.target.value, awayVal)
              }}
              disabled={locked}
              className="w-12 text-center text-lg font-bold p-1 h-10 tabular-nums"
            />
            <span className="text-muted-foreground font-bold">x</span>
            <Input
              type="number"
              min={0}
              max={99}
              value={awayVal}
              onChange={(e) => {
                setAwayVal(e.target.value)
                handleSave(homeVal, e.target.value)
              }}
              disabled={locked}
              className="w-12 text-center text-lg font-bold p-1 h-10 tabular-nums"
            />
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
            <span className="font-semibold text-sm truncate text-right">{awayName}</span>
            <TeamFlag teamId={awayTeamId} size="md" className="shrink-0" />
          </div>
        </div>

        {isFinished && realHome !== undefined && realAway !== undefined && (
          <div className="mt-2 text-center text-xs text-muted-foreground">
            Resultado: <span className="font-bold tabular-nums">{realHome} x {realAway}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
