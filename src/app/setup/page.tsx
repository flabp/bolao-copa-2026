"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { isSupabaseConfigured } from "@/lib/supabase"
import { CheckCircle2, XCircle, Database, Wifi, Globe } from "lucide-react"

export default function SetupPage() {
  const supabaseOk = isSupabaseConfigured()
  // Football API key is now server-side only; check if sync route works instead
  const apiKey = false // Server-side key not accessible from client

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">⚙️ Status do Sistema</h1>
        <p className="text-muted-foreground mt-1">Verifique as configurações do Bolão</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Database className="h-5 w-5" />
              <h3 className="font-semibold">Modo de Dados</h3>
            </div>
            {supabaseOk ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <Badge className="bg-emerald-100 text-emerald-700">Online (Supabase)</Badge>
                  <p className="text-xs text-muted-foreground mt-1">Multi-usuário ativado. Cada pessoa acessa do seu dispositivo.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-amber-500" />
                <div>
                  <Badge className="bg-amber-100 text-amber-700">Local (localStorage)</Badge>
                  <p className="text-xs text-muted-foreground mt-1">Dados salvos apenas neste navegador. Configure o Supabase para modo online.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Wifi className="h-5 w-5" />
              <h3 className="font-semibold">API de Resultados</h3>
            </div>
            {apiKey ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <Badge className="bg-emerald-100 text-emerald-700">Configurada</Badge>
                  <p className="text-xs text-muted-foreground mt-1">Resultados podem ser atualizados automaticamente.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-amber-500" />
                <div>
                  <Badge className="bg-amber-100 text-amber-700">Não configurada</Badge>
                  <p className="text-xs text-muted-foreground mt-1">Configure a API-Football para atualização automática de resultados.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {!supabaseOk && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">📋 Como ativar o modo Online (Supabase)</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Acesse <a href="https://supabase.com" target="_blank" className="text-blue-600 underline">supabase.com</a> e crie uma conta gratuita</li>
              <li>Crie um novo projeto (anote a URL e a chave anon)</li>
              <li>No SQL Editor do Supabase, execute o conteúdo do arquivo <code className="bg-muted px-1 rounded">supabase/schema.sql</code></li>
              <li>Crie o arquivo <code className="bg-muted px-1 rounded">.env.local</code> na raiz do projeto com:
                <pre className="bg-muted p-3 rounded mt-2 text-xs overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui`}
                </pre>
              </li>
              <li>Reinicie o servidor (feche e abra novamente o .bat)</li>
            </ol>
          </CardContent>
        </Card>
      )}

      {!apiKey && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-3">📋 Como ativar resultados automáticos</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Acesse <a href="https://www.api-football.com/" target="_blank" className="text-blue-600 underline">api-football.com</a> e crie uma conta (plano gratuito: 100 req/dia)</li>
              <li>Copie sua chave de API</li>
              <li>Adicione ao arquivo <code className="bg-muted px-1 rounded">.env.local</code>:
                <pre className="bg-muted p-3 rounded mt-2 text-xs overflow-x-auto">
{`NEXT_PUBLIC_FOOTBALL_API_KEY=sua-chave-aqui`}
                </pre>
              </li>
              <li>Reinicie o servidor</li>
              <li>Vá em Admin &rarr; clique &quot;Sincronizar Resultados&quot;</li>
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
