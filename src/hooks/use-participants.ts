"use client"

import { useCallback, useEffect, useState } from "react"
import { Participant } from "@/lib/types"
import {
  getParticipants as supabaseGetParticipants,
} from "@/lib/supabase-store"
import { BOLAO_UPDATED_EVENT } from "@/lib/constants"
import { useAuth } from "@/hooks/use-auth"

export function useParticipants() {
  const { currentParticipantId } = useAuth()
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    try {
      const data = await supabaseGetParticipants()
      setParticipants(data)
    } catch (err) {
      console.error("Error loading participants:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
    const handler = () => reload()
    window.addEventListener(BOLAO_UPDATED_EVENT, handler)
    return () => window.removeEventListener(BOLAO_UPDATED_EVENT, handler)
  }, [reload])

  const addParticipant = async (name: string, email?: string, phone?: string, passwordCode?: string, isAdmin?: boolean) => {
    try {
      const res = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: currentParticipantId,
          name,
          email,
          phone,
          passwordCode,
          isAdmin,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erro ao cadastrar participante")
      }
      await reload()
    } catch (err) {
      console.error("Error adding participant:", err)
    }
  }

  const removeParticipant = async (id: string) => {
    try {
      const res = await fetch("/api/participants", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: currentParticipantId,
          participantId: id,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erro ao remover participante")
      }
      await reload()
    } catch (err) {
      console.error("Error removing participant:", err)
    }
  }

  return {
    participants,
    loading,
    addParticipant,
    removeParticipant,
  }
}
