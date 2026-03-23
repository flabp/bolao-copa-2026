"use client"

import { useState } from "react"
import { useBolao } from "@/hooks/use-bolao"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Save, Download, Upload, Check, RefreshCw, Wifi, WifiOff } from "lucide-react"
import { checkAdminPassword, exportData, importData, updateScoringSystem } from "@/lib/store"
import { getTeamById } from "@/lib/teams-data"
import { TeamFlag } from "@/components/team-flag"
import { isFootballApiConfigured, fetchTodayResults, findMatchingTeamId, type MatchResultFromApi } from "@/lib/football-api"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function AdminPage() {
  const [password, setPassword] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (checkAdminPassword(password)) {
      setAuthenticated(true)
      setError("")
    } else {
      setError("Senha incorreta")
    }
  }

  if (!authenticated) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <Shield className="h-5 w-5" />
          </div>
          Admin
        </h1>
        <Card className="max-w-md border-0 shadow-md">
          <CardHeader>
            <CardTitle>Acesso Administrador</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminPass">Senha</Label>
                <Input
                  id="adminPass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha de admin"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="cursor-pointer">Entrar</Button>
              <p className="text-xs text-muted-foreground">Senha padrao: admin123</p>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <AdminPanel />
}

function AdminPanel() {
  const { matches, settings, reload } = useBolao()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2 tracking-tight">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600">
          <Shield className="h-5 w-5" />
        </div>
        Painel Admin
      </h1>

      <Tabs defaultValue="results">
        <TabsList>
          <TabsTrigger value="results">Resultados</TabsTrigger>
          <TabsTrigger value="scoring">Pontuacao</TabsTrigger>
          <TabsTrigger value="data">Dados</TabsTrigger>
        </TabsList>

        <TabsContent value="results">
          <ResultsTab />
        </TabsContent>

        <TabsContent value="scoring">
          <ScoringTab />
        </TabsContent>

        <TabsContent value="data">
          <DataTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SyncResultsButton({ onSync }: { onSync: (results: MatchResultFromApi[]) => void }) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string>("")
  const apiConfigured = isFootballApiConfigured()

  const handleSync = async () => {
    setLoading(true)
    setStatus("Buscando resultados...")
    try {
      const results = await fetchTodayResults()
      if (results.length === 0) {
        setStatus("Nenhum jogo com resultado encontrado hoje.")
      } else {
        onSync(results)
        setStatus(`${results.length} resultado(s) encontrado(s)!`)
      }
    } catch (err: any) {
      setStatus(`Erro: ${err.message}`)
    } finally {
      setLoading(false)
      setTimeout(() => setStatus(""), 5000)
    }
  }

  if (!apiConfigured) {
    return (
      <Card className="border-0 shadow-sm mb-4">
        <CardContent className="p-4 flex items-center gap-3">
          <WifiOff className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">API de resultados nao configurada</p>
            <p className="text-xs text-muted-foreground">
              Adicione NEXT_PUBLIC_FOOTBALL_API_KEY ao .env.local para ativar.
              Veja a pagina de Setup para instrucoes.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-sm mb-4">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wifi className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="text-sm font-medium">Atualizacao Automatica</p>
            {status && <p className="text-xs text-muted-foreground">{status}</p>}
          </div>
        </div>
        <button
          onClick={handleSync}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Sincronizando..." : "Sincronizar Resultados"}
        </button>
      </CardContent>
    </Card>
  )
}

function ResultsTab() {
  const { matches, saveResult } = useBolao()
  const [filter, setFilter] = useState<"pending" | "finished">("pending")

  const handleApiSync = (results: MatchResultFromApi[]) => {
    let synced = 0
    for (const result of results) {
      if (result.status !== "finished") continue
      const homeId = findMatchingTeamId(result.homeTeamName)
      const awayId = findMatchingTeamId(result.awayTeamName)
      if (!homeId || !awayId) continue

      const match = matches.find(
        (m) => m.homeTeamId === homeId && m.awayTeamId === awayId
      )
      if (match) {
        saveResult(
          match.id,
          result.homeScore,
          result.awayScore,
          result.homePenalties,
          result.awayPenalties
        )
        synced++
      }
    }
  }

  const filteredMatches = matches
    .filter((m) => filter === "pending" ? m.status !== "finished" : m.status === "finished")
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())

  return (
    <>
    <SyncResultsButton onSync={handleApiSync} />
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Inserir Resultados</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("pending")}
              className="cursor-pointer"
            >
              Pendentes
            </Button>
            <Button
              variant={filter === "finished" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("finished")}
              className="cursor-pointer"
            >
              Finalizados
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredMatches.slice(0, 20).map((match) => {
            const home = getTeamById(match.homeTeamId)
            const away = getTeamById(match.awayTeamId)
            return (
              <ResultEntry
                key={match.id}
                matchId={match.id}
                homeName={home?.name ?? match.homeTeamId}
                homeTeamId={match.homeTeamId}
                awayName={away?.name ?? match.awayTeamId}
                awayTeamId={match.awayTeamId}
                dateTime={match.dateTime}
                group={match.group}
                currentHome={match.homeScore}
                currentAway={match.awayScore}
                onSave={saveResult}
              />
            )
          })}
          {filteredMatches.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Nenhum jogo encontrado.
            </p>
          )}
          {filteredMatches.length > 20 && (
            <p className="text-center text-sm text-muted-foreground">
              Mostrando 20 de {filteredMatches.length} jogos.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
    </>
  )
}

function ResultEntry({
  matchId,
  homeName,
  homeTeamId,
  awayName,
  awayTeamId,
  dateTime,
  group,
  currentHome,
  currentAway,
  onSave,
}: {
  matchId: string
  homeName: string
  homeTeamId: string
  awayName: string
  awayTeamId: string
  dateTime: string
  group?: string
  currentHome?: number
  currentAway?: number
  onSave: (id: string, h: number, a: number, hp?: number, ap?: number) => void
}) {
  const [homeVal, setHomeVal] = useState(currentHome?.toString() ?? "")
  const [awayVal, setAwayVal] = useState(currentAway?.toString() ?? "")
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    const h = parseInt(homeVal)
    const a = parseInt(awayVal)
    if (!isNaN(h) && !isNaN(a) && h >= 0 && a >= 0) {
      onSave(matchId, h, a)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border bg-card p-3 flex-wrap hover:border-blue-200 transition-colors">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <TeamFlag teamId={homeTeamId} size="sm" />
        <span className="text-sm font-semibold truncate">{homeName}</span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Input
          type="number"
          min={0}
          value={homeVal}
          onChange={(e) => setHomeVal(e.target.value)}
          className="w-12 text-center font-bold h-9 tabular-nums"
        />
        <span className="text-muted-foreground font-bold">x</span>
        <Input
          type="number"
          min={0}
          value={awayVal}
          onChange={(e) => setAwayVal(e.target.value)}
          className="w-12 text-center font-bold h-9 tabular-nums"
        />
      </div>
      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
        <span className="text-sm font-semibold truncate text-right">{awayName}</span>
        <TeamFlag teamId={awayTeamId} size="sm" />
      </div>
      <Button size="sm" onClick={handleSave} className="shrink-0 cursor-pointer">
        {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
      </Button>
      <div className="w-full text-xs text-muted-foreground">
        {group && `Grupo ${group} | `}
        {format(new Date(dateTime), "dd/MM/yyyy HH:mm", { locale: ptBR })}
      </div>
    </div>
  )
}

function ScoringTab() {
  const { settings } = useBolao()
  const scoring = settings?.scoringSystem
  const [values, setValues] = useState({
    exactScore: scoring?.exactScore ?? 10,
    correctResult: scoring?.correctResult ?? 5,
    correctGoalDiff: scoring?.correctGoalDiff ?? 3,
    correctOneTeamScore: scoring?.correctOneTeamScore ?? 1,
    knockoutMultiplier: scoring?.knockoutMultiplier ?? 1.5,
    lateKnockoutMultiplier: scoring?.lateKnockoutMultiplier ?? 2,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateScoringSystem(values)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle>Sistema de Pontuacao</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label>Placar Exato</Label>
            <Input
              type="number"
              value={values.exactScore}
              onChange={(e) => setValues({ ...values, exactScore: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Resultado Correto</Label>
            <Input
              type="number"
              value={values.correctResult}
              onChange={(e) => setValues({ ...values, correctResult: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Diferenca de Gols Correta</Label>
            <Input
              type="number"
              value={values.correctGoalDiff}
              onChange={(e) => setValues({ ...values, correctGoalDiff: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Gols de 1 Time Correto</Label>
            <Input
              type="number"
              value={values.correctOneTeamScore}
              onChange={(e) => setValues({ ...values, correctOneTeamScore: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Multiplicador Eliminatorias</Label>
            <Input
              type="number"
              step="0.1"
              value={values.knockoutMultiplier}
              onChange={(e) => setValues({ ...values, knockoutMultiplier: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Multiplicador Quartas+</Label>
            <Input
              type="number"
              step="0.1"
              value={values.lateKnockoutMultiplier}
              onChange={(e) => setValues({ ...values, lateKnockoutMultiplier: Number(e.target.value) })}
            />
          </div>
        </div>
        <Button onClick={handleSave} className="mt-4 cursor-pointer">
          {saved ? <><Check className="mr-2 h-4 w-4" /> Salvo!</> : <><Save className="mr-2 h-4 w-4" /> Salvar Pontuacao</>}
        </Button>
      </CardContent>
    </Card>
  )
}

function DataTab() {
  const [importText, setImportText] = useState("")
  const [importStatus, setImportStatus] = useState<"" | "success" | "error">("")

  const handleExport = () => {
    const json = exportData()
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `bolao-copa-2026-${format(new Date(), "yyyy-MM-dd")}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    if (importData(importText)) {
      setImportStatus("success")
      setImportText("")
    } else {
      setImportStatus("error")
    }
    setTimeout(() => setImportStatus(""), 3000)
  }

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Exportar Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Exporte todos os dados do bolao como arquivo JSON para backup.
          </p>
          <Button onClick={handleExport} className="cursor-pointer">
            <Download className="mr-2 h-4 w-4" />
            Exportar JSON
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Importar Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Cole o JSON exportado anteriormente para restaurar os dados.
          </p>
          <textarea
            className="w-full h-32 rounded-xl border bg-transparent p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder='{"teams":..., "matches":..., ...}'
          />
          <div className="mt-2 flex items-center gap-2">
            <Button onClick={handleImport} disabled={!importText.trim()} className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              Importar
            </Button>
            {importStatus === "success" && (
              <Badge className="bg-emerald-500 text-white">Importado com sucesso!</Badge>
            )}
            {importStatus === "error" && (
              <Badge variant="destructive">Erro ao importar. Verifique o JSON.</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
