"use client"

import { useState } from "react"
import { useParticipants } from "@/hooks/use-participants"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Trash2, Shield, Mail, Loader2 } from "lucide-react"
import { format } from "date-fns"

export default function ParticipantesPage() {
  const { participants, addParticipant, removeParticipant } = useParticipants()
  const { isAdmin } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [passwordCode, setPasswordCode] = useState("")
  const [isNewAdmin, setIsNewAdmin] = useState(false)
  const [sending, setSending] = useState(false)
  const [emailStatus, setEmailStatus] = useState<"" | "sent" | "error">("")

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Users className="h-5 w-5" />
          </div>
          Participantes
        </h1>
        <Card className="border-0 shadow-md">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">Acesso restrito ao administrador</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !passwordCode.trim()) return

    setSending(true)
    setEmailStatus("")

    try {
      await addParticipant(name.trim(), email.trim() || undefined, phone.trim() || undefined, passwordCode.trim(), isNewAdmin)

      // Send email with credentials if email was provided
      if (email.trim()) {
        try {
          const res = await fetch("/api/send-credentials", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: name.trim(),
              email: email.trim(),
              code: passwordCode.trim(),
            }),
          })
          if (res.ok) {
            setEmailStatus("sent")
          } else {
            setEmailStatus("error")
          }
        } catch {
          setEmailStatus("error")
        }
      }

      setName("")
      setEmail("")
      setPhone("")
      setPasswordCode("")
      setIsNewAdmin(false)
    } finally {
      setSending(false)
      setTimeout(() => setEmailStatus(""), 5000)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 tracking-tight">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Users className="h-5 w-5" />
          </div>
          Participantes
        </h1>
        <p className="text-muted-foreground mt-1">Cadastre os participantes do bolao</p>
      </div>

      {/* Registration Form */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-emerald-500" />
            Novo Participante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome do participante"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordCode">Codigo de Acesso *</Label>
                <Input
                  id="passwordCode"
                  type="password"
                  value={passwordCode}
                  onChange={(e) => setPasswordCode(e.target.value)}
                  placeholder="Codigo para login"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isAdmin"
                checked={isNewAdmin}
                onChange={(e) => setIsNewAdmin(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isAdmin" className="cursor-pointer">Administrador</Label>
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" className="cursor-pointer" disabled={sending}>
                {sending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cadastrando...</>
                ) : (
                  <><Plus className="mr-2 h-4 w-4" /> Cadastrar</>
                )}
              </Button>
              {emailStatus === "sent" && (
                <Badge className="bg-emerald-500 text-white"><Mail className="mr-1 h-3 w-3" /> Email enviado!</Badge>
              )}
              {emailStatus === "error" && (
                <Badge variant="destructive">Erro ao enviar email</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Se o email for preenchido, as credenciais serao enviadas automaticamente.
            </p>
          </form>
        </CardContent>
      </Card>

      {/* Participants List */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>
            Participantes Cadastrados ({participants.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {participants.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum participante cadastrado. Adicione o primeiro acima!
            </p>
          ) : (
            <div className="space-y-2">
              {participants.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border bg-card p-3 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] text-sm font-bold text-white">
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{p.name}</p>
                        {p.isAdmin && <Badge variant="secondary">Admin</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {p.email && `${p.email} | `}
                        Desde {format(new Date(p.createdAt), "dd/MM/yyyy")}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeParticipant(p.id)}
                    className="text-destructive hover:text-destructive cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
