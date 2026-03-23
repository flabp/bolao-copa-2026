"use client"

import { useBolao } from "@/hooks/use-bolao"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trophy } from "lucide-react"
import { GROUPS } from "@/lib/teams-data"
import { TeamFlag } from "@/components/team-flag"
import { calculateGroupStandings } from "@/lib/standings"

export default function GruposPage() {
  const { matches, teams } = useBolao()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
            <Trophy className="h-5 w-5" />
          </div>
          Grupos
        </h1>
        <p className="text-muted-foreground mt-1">Classificacao dos 12 grupos da Copa 2026</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {GROUPS.map((group) => {
          const standings = calculateGroupStandings(matches, teams, group)

          return (
            <Card key={group} className="border-0 shadow-md overflow-hidden">
              <CardHeader className="pb-2 bg-gradient-to-r from-[#1e3a5f] to-[#0f172a] text-white">
                <CardTitle className="text-lg font-bold">Grupo {group}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="pl-4">Selecao</TableHead>
                      <TableHead className="text-center w-8">J</TableHead>
                      <TableHead className="text-center w-8">V</TableHead>
                      <TableHead className="text-center w-8">E</TableHead>
                      <TableHead className="text-center w-8">D</TableHead>
                      <TableHead className="text-center w-10">GP</TableHead>
                      <TableHead className="text-center w-10">GC</TableHead>
                      <TableHead className="text-center w-10">SG</TableHead>
                      <TableHead className="text-center w-10 font-bold">Pts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {standings.map((s, i) => (
                      <TableRow key={s.team.id} className={i < 2 ? "bg-emerald-50/50" : ""}>
                        <TableCell className="pl-4">
                          <div className="flex items-center gap-2">
                            <TeamFlag teamId={s.team.id} size="sm" />
                            <span className="text-sm font-medium truncate">
                              {s.team.isPlaceholder ? s.team.placeholderLabel : s.team.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center tabular-nums">{s.played}</TableCell>
                        <TableCell className="text-center tabular-nums">{s.won}</TableCell>
                        <TableCell className="text-center tabular-nums">{s.drawn}</TableCell>
                        <TableCell className="text-center tabular-nums">{s.lost}</TableCell>
                        <TableCell className="text-center tabular-nums">{s.goalsFor}</TableCell>
                        <TableCell className="text-center tabular-nums">{s.goalsAgainst}</TableCell>
                        <TableCell className="text-center tabular-nums">
                          {s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}
                        </TableCell>
                        <TableCell className="text-center font-bold tabular-nums">{s.points}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
