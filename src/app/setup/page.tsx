"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { isSupabaseConfigured } from "@/lib/supabase"
import { CheckCircle2, XCircle, Database, Wifi, Mail, Shield } from "lucide-react"

interface ServerStatus {
  footballApi: boolean
  serviceRole: boolean
  gmail: boolean
}

export default function SetupPage() {
  const supabaseOk = isSupabaseConfigured()
  const [status, setStatus] = useState<ServerStatus | null>(null)

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus(null))
  }, [])

  const apiOk = status?.footballApi ?? false
  const serviceRoleOk = status?.serviceRole ?? false
  const gmailOk = status?.gmail ?? false

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Status do Sistema</h1>
        <p className="text-muted-foreground mt-1">Verifique as configuracoes do Bolao</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatusCard
          icon={<Database className="h-5 w-5" />}
          title="Modo de Dados"
          ok={supabaseOk}
          okLabel="Online (Supabase)"
          okDesc="Multi-usuario ativado. Cada pessoa acessa do seu dispositivo."
          failLabel="Local (localStorage)"
          failDesc="Dados salvos apenas neste navegador."
        />
        <StatusCard
          icon={<Wifi className="h-5 w-5" />}
          title="API de Resultados"
          ok={apiOk}
          okLabel="Configurada"
          okDesc="Resultados podem ser atualizados automaticamente."
          failLabel="Nao configurada"
          failDesc="Configure a FOOTBALL_API_KEY no servidor."
        />
        <StatusCard
          icon={<Shield className="h-5 w-5" />}
          title="Service Role Key"
          ok={serviceRoleOk}
          okLabel="Configurada"
          okDesc="Operacoes admin protegidas via service_role."
          failLabel="Nao configurada"
          failDesc="Adicione SUPABASE_SERVICE_ROLE_KEY nas env vars."
        />
        <StatusCard
          icon={<Mail className="h-5 w-5" />}
          title="Email (Gmail)"
          ok={gmailOk}
          okLabel="Configurado"
          okDesc="Emails de credenciais serao enviados automaticamente."
          failLabel="Nao configurado"
          failDesc="Adicione GMAIL_USER e GMAIL_APP_PASSWORD."
        />
      </div>
    </div>
  )
}

function StatusCard({
  icon,
  title,
  ok,
  okLabel,
  okDesc,
  failLabel,
  failDesc,
}: {
  icon: React.ReactNode
  title: string
  ok: boolean
  okLabel: string
  okDesc: string
  failLabel: string
  failDesc: string
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-3">
          {icon}
          <h3 className="font-semibold">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {ok ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <Badge className="bg-emerald-100 text-emerald-700">{okLabel}</Badge>
                <p className="text-xs text-muted-foreground mt-1">{okDesc}</p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <Badge className="bg-amber-100 text-amber-700">{failLabel}</Badge>
                <p className="text-xs text-muted-foreground mt-1">{failDesc}</p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
