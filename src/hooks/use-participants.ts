"use client"

import { useCallback, useEffect, useState } from "react"
import { Participant } from "@/lib/types"
import {
  getBolaoData,
  addParticipant as storeAddParticipant,
  removeParticipant as storeRemoveParticipant,
  setActiveParticipant as storeSetActiveParticipant,
} from "@/lib/store"
import { BOLAO_UPDATED_EVENT } from "@/lib/constants"

export function useParticipants() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [activeParticipantId, setActiveId] = useState<string | null>(null)

  const reload = useCallback(() => {
    const data = getBolaoData()
    setParticipants(data.participants)
    setActiveId(data.activeParticipantId)
  }, [])

  useEffect(() => {
    reload()
    const handler = () => reload()
    window.addEventListener(BOLAO_UPDATED_EVENT, handler)
    return () => window.removeEventListener(BOLAO_UPDATED_EVENT, handler)
  }, [reload])

  const addParticipant = (name: string, email?: string, phone?: string, passwordCode?: string) => {
    storeAddParticipant(name, email, phone)
  }

  const removeParticipant = (id: string) => {
    storeRemoveParticipant(id)
  }

  const setActiveParticipant = (id: string) => {
    storeSetActiveParticipant(id)
  }

  const activeParticipant = participants.find((p) => p.id === activeParticipantId) ?? null

  return {
    participants,
    activeParticipant,
    activeParticipantId,
    addParticipant,
    removeParticipant,
    setActiveParticipant,
  }
}
