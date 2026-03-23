"use client"

import { useBolao } from "@/hooks/use-bolao"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BarChart3 } from "lucide-react"

export default function ClassificacaoPage() {
  const { leaderboard, activeParticipantId } = useBolao()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            <BarChart3 className="h-5 w-5" />
          </div>
          Classificacao
        </h1>
        <p className="text-muted-foreground mt-1">Ranking do bolao</p>
      </div>

      <Card className="border-0 shadow-md overflow-hidden">
        <CardContent className="p-0">
          {leaderboard.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum participante cadastrado ainda.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="w-16 text-center">#</TableHead>
                  <TableHead>Participante</TableHead>
                  <TableHead className="text-center">Pontos</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Placares Exatos</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Resultados Certos</TableHead>
                  <TableHead className="text-center hidden md:table-cell">Palpites</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((entry) => {
                  const isMe = entry.participant.id === activeParticipantId

                  return (
                    <TableRow
                      key={entry.participant.id}
                      className={isMe ? "bg-blue-50/50" : ""}
                    >
                      <TableCell className="text-center">
                        <span
                          className={
                            "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold " +
                            (entry.rank === 1
                              ? "bg-amber-500 text-white"
                              : entry.rank === 2
                              ? "bg-slate-400 text-white"
                              : entry.rank === 3
                              ? "bg-orange-400 text-white"
                              : "text-muted-foreground")
                          }
                        >
                          {entry.rank}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={isMe ? "font-bold" : "font-medium"}>{entry.participant.name}</span>
                          {isMe && (
                            <Badge variant="outline" className="text-xs">
                              Voce
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-lg font-bold tabular-nums">{entry.totalPoints}</span>
                      </TableCell>
                      <TableCell className="text-center hidden sm:table-cell tabular-nums">
                        {entry.exactScores}
                      </TableCell>
                      <TableCell className="text-center hidden sm:table-cell tabular-nums">
                        {entry.correctResults}
                      </TableCell>
                      <TableCell className="text-center hidden md:table-cell tabular-nums">
                        {entry.matchesPredicted}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
