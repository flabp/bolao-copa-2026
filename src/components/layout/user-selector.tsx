"use client"

import { useParticipants } from "@/hooks/use-participants"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User } from "lucide-react"

export function UserSelector() {
  const { participants, activeParticipantId, setActiveParticipant } = useParticipants()

  if (participants.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <User size={16} />
        <span>Nenhum participante</span>
      </div>
    )
  }

  const activeName = participants.find((p) => p.id === activeParticipantId)?.name

  return (
    <Select value={activeParticipantId ?? ""} onValueChange={(v) => v && setActiveParticipant(v)}>
      <SelectTrigger className="w-full bg-sidebar-accent border-sidebar-border text-sidebar-foreground">
        <div className="flex items-center gap-2">
          <User size={14} />
          {activeName ? (
            <span className="truncate">{activeName}</span>
          ) : (
            <SelectValue placeholder="Selecionar participante" />
          )}
        </div>
      </SelectTrigger>
      <SelectContent>
        {participants.map((p) => (
          <SelectItem key={p.id} value={p.id}>
            {p.name} {p.isAdmin ? "(Admin)" : ""}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
