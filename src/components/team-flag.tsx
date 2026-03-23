"use client"

import Image from "next/image"

// Map team IDs to ISO 2-letter country codes for flagcdn.com
const TEAM_TO_ISO: Record<string, string> = {
  MEX: "mx", ZAF: "za", KOR: "kr",
  CAN: "ca", SUI: "ch", QAT: "qa",
  BRA: "br", MAR: "ma", HTI: "ht", SCO: "gb-sct",
  USA: "us", PAR: "py", AUS: "au",
  GER: "de", CUR: "cw", CIV: "ci", ECU: "ec",
  NED: "nl", JPN: "jp", TUN: "tn",
  BEL: "be", EGY: "eg", IRN: "ir", NZL: "nz",
  ESP: "es", CPV: "cv", KSA: "sa", URU: "uy",
  FRA: "fr", SEN: "sn", NOR: "no",
  ARG: "ar", ALG: "dz", AUT: "at", JOR: "jo",
  POR: "pt", UZB: "uz", COL: "co",
  ENG: "gb-eng", CRO: "hr", GHA: "gh", PAN: "pa",
  // Placeholders
  PLA: "eu", PLB: "eu", PLC: "eu", PLD: "eu",
  IC1: "un", IC2: "un",
}

interface TeamFlagProps {
  teamId: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const SIZES = {
  sm: { width: 24, height: 18 },
  md: { width: 32, height: 24 },
  lg: { width: 48, height: 36 },
}

export function TeamFlag({ teamId, size = "md", className = "" }: TeamFlagProps) {
  const iso = TEAM_TO_ISO[teamId]
  const { width, height } = SIZES[size]

  if (!iso) {
    return <span className={`inline-block rounded-sm bg-muted ${className}`} style={{ width, height }} />
  }

  return (
    <Image
      src={`https://flagcdn.com/w80/${iso}.png`}
      alt={teamId}
      width={width}
      height={height}
      className={`inline-block rounded-sm object-cover shadow-sm ${className}`}
      unoptimized
    />
  )
}
