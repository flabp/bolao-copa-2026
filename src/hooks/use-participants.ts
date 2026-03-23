"use client"

import { useCallback, useEffect, useState } from "react"
import { Participant } from "@/lib/types"
import {
  getParticipants as supabaseGetParticipants,
  addParticipantAsync,
  removeParticipantAsync,
} from "@/lib/supabase-store"
import { BOLAO_UPDATED_EVENT } from "@/lib/constants"

export function useParticipants() {
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
      await addParticipantAsync(name, email, phone, passwordCode, isAdmin)
      await reload()
    } catch (err) {
      console.error("Error adding participant:", err)
    }
  }

  const removeParticipant = async (id: string) => {
    try {
      await removeParticipantAsync(id)
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
