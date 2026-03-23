import { Match } from "./types"

// Helper to create group stage matches for one group
function createGroupMatches(
  group: string,
  teams: [string, string, string, string],
  dates: [string, string, string, string, string, string],
  venues: [string, string, string, string, string, string],
  cities: [string, string, string, string, string, string],
  countries: [string, string, string, string, string, string]
): Match[] {
  // Each group: 6 matches (round-robin)
  // MD1: T1vT2, T3vT4 | MD2: T1vT3, T2vT4 | MD3: T1vT4, T2vT3
  const pairings: [number, number][] = [
    [0, 1], [2, 3], // Matchday 1
    [0, 2], [1, 3], // Matchday 2
    [0, 3], [1, 2], // Matchday 3
  ]
  return pairings.map(([h, a], i) => ({
    id: `GS-${group}-${i + 1}`,
    homeTeamId: teams[h],
    awayTeamId: teams[a],
    group,
    phase: "group" as const,
    matchday: Math.floor(i / 2) + 1,
    dateTime: dates[i],
    venue: venues[i],
    city: cities[i],
    country: countries[i],
    status: "scheduled" as const,
  }))
}

// Group stage matches (72 matches)
const groupStageMatches: Match[] = [
  // Grupo A - Mexico, Africa do Sul, Coreia do Sul, Playoff UEFA D
  ...createGroupMatches(
    "A",
    ["MEX", "ZAF", "KOR", "PLD"],
    [
      "2026-06-11T19:00:00-06:00", "2026-06-12T12:00:00-06:00",
      "2026-06-16T19:00:00-06:00", "2026-06-16T16:00:00-05:00",
      "2026-06-20T19:00:00-06:00", "2026-06-20T19:00:00-05:00",
    ],
    ["Estadio Azteca", "Estadio Akron", "Estadio Azteca", "AT&T Stadium", "Estadio Akron", "AT&T Stadium"],
    ["Cidade do Mexico", "Guadalajara", "Cidade do Mexico", "Dallas", "Guadalajara", "Dallas"],
    ["Mexico", "Mexico", "Mexico", "EUA", "Mexico", "EUA"]
  ),

  // Grupo B - Canada, Suica, Catar, Playoff UEFA A
  ...createGroupMatches(
    "B",
    ["CAN", "SUI", "QAT", "PLA"],
    [
      "2026-06-12T18:00:00-04:00", "2026-06-12T15:00:00-04:00",
      "2026-06-17T18:00:00-04:00", "2026-06-17T15:00:00-07:00",
      "2026-06-21T18:00:00-04:00", "2026-06-21T18:00:00-07:00",
    ],
    ["BMO Field", "BC Place", "BMO Field", "Lumen Field", "BC Place", "Lumen Field"],
    ["Toronto", "Vancouver", "Toronto", "Seattle", "Vancouver", "Seattle"],
    ["Canada", "Canada", "Canada", "EUA", "Canada", "EUA"]
  ),

  // Grupo C - Brasil, Marrocos, Haiti, Escocia
  ...createGroupMatches(
    "C",
    ["BRA", "MAR", "HTI", "SCO"],
    [
      "2026-06-13T21:00:00-04:00", "2026-06-13T18:00:00-04:00",
      "2026-06-17T21:00:00-04:00", "2026-06-17T18:00:00-04:00",
      "2026-06-21T21:00:00-04:00", "2026-06-21T21:00:00-04:00",
    ],
    ["Hard Rock Stadium", "Inter&Co Stadium", "Hard Rock Stadium", "Mercedes-Benz Stadium", "Inter&Co Stadium", "Mercedes-Benz Stadium"],
    ["Miami", "Orlando", "Miami", "Atlanta", "Orlando", "Atlanta"],
    ["EUA", "EUA", "EUA", "EUA", "EUA", "EUA"]
  ),

  // Grupo D - EUA, Paraguai, Australia, Playoff UEFA C
  ...createGroupMatches(
    "D",
    ["USA", "PAR", "AUS", "PLC"],
    [
      "2026-06-12T21:00:00-07:00", "2026-06-13T15:00:00-04:00",
      "2026-06-16T21:00:00-07:00", "2026-06-17T12:00:00-04:00",
      "2026-06-21T15:00:00-07:00", "2026-06-21T15:00:00-04:00",
    ],
    ["SoFi Stadium", "Lincoln Financial Field", "SoFi Stadium", "Gillette Stadium", "Rose Bowl", "Gillette Stadium"],
    ["Los Angeles", "Filadelfia", "Los Angeles", "Boston", "Los Angeles", "Boston"],
    ["EUA", "EUA", "EUA", "EUA", "EUA", "EUA"]
  ),

  // Grupo E - Alemanha, Curacao, Costa do Marfim, Equador
  ...createGroupMatches(
    "E",
    ["GER", "CUR", "CIV", "ECU"],
    [
      "2026-06-13T12:00:00-07:00", "2026-06-14T18:00:00-04:00",
      "2026-06-18T12:00:00-07:00", "2026-06-18T18:00:00-04:00",
      "2026-06-22T18:00:00-04:00", "2026-06-22T18:00:00-07:00",
    ],
    ["Lumen Field", "MetLife Stadium", "SoFi Stadium", "MetLife Stadium", "Hard Rock Stadium", "Lumen Field"],
    ["Seattle", "Nova York", "Los Angeles", "Nova York", "Miami", "Seattle"],
    ["EUA", "EUA", "EUA", "EUA", "EUA", "EUA"]
  ),

  // Grupo F - Holanda, Japao, Tunisia, Playoff UEFA B
  ...createGroupMatches(
    "F",
    ["NED", "JPN", "TUN", "PLB"],
    [
      "2026-06-14T21:00:00-04:00", "2026-06-14T15:00:00-05:00",
      "2026-06-18T21:00:00-04:00", "2026-06-18T15:00:00-05:00",
      "2026-06-22T15:00:00-05:00", "2026-06-22T15:00:00-04:00",
    ],
    ["Mercedes-Benz Stadium", "NRG Stadium", "Lincoln Financial Field", "NRG Stadium", "AT&T Stadium", "Mercedes-Benz Stadium"],
    ["Atlanta", "Houston", "Filadelfia", "Houston", "Dallas", "Atlanta"],
    ["EUA", "EUA", "EUA", "EUA", "EUA", "EUA"]
  ),

  // Grupo G - Belgica, Egito, Ira, Nova Zelandia
  ...createGroupMatches(
    "G",
    ["BEL", "EGY", "IRN", "NZL"],
    [
      "2026-06-14T12:00:00-04:00", "2026-06-15T18:00:00-05:00",
      "2026-06-19T12:00:00-04:00", "2026-06-19T18:00:00-05:00",
      "2026-06-23T18:00:00-05:00", "2026-06-23T18:00:00-04:00",
    ],
    ["Gillette Stadium", "AT&T Stadium", "Inter&Co Stadium", "NRG Stadium", "AT&T Stadium", "Gillette Stadium"],
    ["Boston", "Dallas", "Orlando", "Houston", "Dallas", "Boston"],
    ["EUA", "EUA", "EUA", "EUA", "EUA", "EUA"]
  ),

  // Grupo H - Espanha, Cabo Verde, Arabia Saudita, Uruguai
  ...createGroupMatches(
    "H",
    ["ESP", "CPV", "KSA", "URU"],
    [
      "2026-06-15T21:00:00-04:00", "2026-06-15T15:00:00-04:00",
      "2026-06-19T21:00:00-04:00", "2026-06-19T15:00:00-04:00",
      "2026-06-23T21:00:00-04:00", "2026-06-23T21:00:00-04:00",
    ],
    ["Hard Rock Stadium", "Mercedes-Benz Stadium", "MetLife Stadium", "Lincoln Financial Field", "Hard Rock Stadium", "MetLife Stadium"],
    ["Miami", "Atlanta", "Nova York", "Filadelfia", "Miami", "Nova York"],
    ["EUA", "EUA", "EUA", "EUA", "EUA", "EUA"]
  ),

  // Grupo I - Franca, Senegal, Noruega, Playoff Interconf. 2
  ...createGroupMatches(
    "I",
    ["FRA", "SEN", "NOR", "IC2"],
    [
      "2026-06-15T12:00:00-04:00", "2026-06-16T18:00:00-07:00",
      "2026-06-20T12:00:00-04:00", "2026-06-20T18:00:00-07:00",
      "2026-06-24T18:00:00-07:00", "2026-06-24T18:00:00-04:00",
    ],
    ["Lincoln Financial Field", "SoFi Stadium", "MetLife Stadium", "Lumen Field", "SoFi Stadium", "Lincoln Financial Field"],
    ["Filadelfia", "Los Angeles", "Nova York", "Seattle", "Los Angeles", "Filadelfia"],
    ["EUA", "EUA", "EUA", "EUA", "EUA", "EUA"]
  ),

  // Grupo J - Argentina, Argelia, Austria, Jordania
  ...createGroupMatches(
    "J",
    ["ARG", "ALG", "AUT", "JOR"],
    [
      "2026-06-16T12:00:00-04:00", "2026-06-16T15:00:00-04:00",
      "2026-06-20T12:00:00-04:00", "2026-06-20T15:00:00-04:00",
      "2026-06-24T15:00:00-04:00", "2026-06-24T15:00:00-04:00",
    ],
    ["Hard Rock Stadium", "Inter&Co Stadium", "Mercedes-Benz Stadium", "Hard Rock Stadium", "Inter&Co Stadium", "Mercedes-Benz Stadium"],
    ["Miami", "Orlando", "Atlanta", "Miami", "Orlando", "Atlanta"],
    ["EUA", "EUA", "EUA", "EUA", "EUA", "EUA"]
  ),

  // Grupo K - Portugal, Uzbequistao, Colombia, Playoff Interconf. 1
  ...createGroupMatches(
    "K",
    ["POR", "UZB", "COL", "IC1"],
    [
      "2026-06-14T18:00:00-07:00", "2026-06-15T15:00:00-07:00",
      "2026-06-19T18:00:00-07:00", "2026-06-19T15:00:00-07:00",
      "2026-06-23T15:00:00-07:00", "2026-06-23T15:00:00-07:00",
    ],
    ["Rose Bowl", "Lumen Field", "SoFi Stadium", "Rose Bowl", "Lumen Field", "SoFi Stadium"],
    ["Los Angeles", "Seattle", "Los Angeles", "Los Angeles", "Seattle", "Los Angeles"],
    ["EUA", "EUA", "EUA", "EUA", "EUA", "EUA"]
  ),

  // Grupo L - Inglaterra, Croacia, Gana, Panama
  ...createGroupMatches(
    "L",
    ["ENG", "CRO", "GHA", "PAN"],
    [
      "2026-06-11T15:00:00-06:00", "2026-06-12T18:00:00-05:00",
      "2026-06-17T15:00:00-06:00", "2026-06-17T18:00:00-05:00",
      "2026-06-22T12:00:00-05:00", "2026-06-22T12:00:00-06:00",
    ],
    ["Estadio Azteca", "NRG Stadium", "Estadio Akron", "AT&T Stadium", "NRG Stadium", "Estadio Akron"],
    ["Cidade do Mexico", "Houston", "Guadalajara", "Dallas", "Houston", "Guadalajara"],
    ["Mexico", "EUA", "Mexico", "EUA", "EUA", "Mexico"]
  ),
]

// Knockout stage matches (32 matches)
// Round of 32: 16 matches (June 28 - July 3)
const roundOf32Matches: Match[] = Array.from({ length: 16 }, (_, i) => ({
  id: `R32-${String(i + 1).padStart(2, "0")}`,
  homeTeamId: `1${String.fromCharCode(65 + Math.floor(i / 2))}`, // placeholder: 1A, 2B, etc.
  awayTeamId: `3RD`,
  group: undefined,
  phase: "round-of-32" as const,
  dateTime: new Date(2026, 5, 28 + Math.floor(i / 4), 12 + (i % 4) * 3, 0).toISOString(),
  venue: "A definir",
  city: "A definir",
  country: "EUA",
  status: "scheduled" as const,
}))

// Round of 16: 8 matches (July 4-7)
const roundOf16Matches: Match[] = Array.from({ length: 8 }, (_, i) => ({
  id: `R16-${String(i + 1).padStart(2, "0")}`,
  homeTeamId: `W-R32-${String(i * 2 + 1).padStart(2, "0")}`,
  awayTeamId: `W-R32-${String(i * 2 + 2).padStart(2, "0")}`,
  group: undefined,
  phase: "round-of-16" as const,
  dateTime: new Date(2026, 6, 4 + Math.floor(i / 2), 13 + (i % 2) * 4, 0).toISOString(),
  venue: "A definir",
  city: "A definir",
  country: "EUA",
  status: "scheduled" as const,
}))

// Quarter-finals: 4 matches (July 9-11)
const quarterFinalMatches: Match[] = Array.from({ length: 4 }, (_, i) => ({
  id: `QF-${String(i + 1).padStart(2, "0")}`,
  homeTeamId: `W-R16-${String(i * 2 + 1).padStart(2, "0")}`,
  awayTeamId: `W-R16-${String(i * 2 + 2).padStart(2, "0")}`,
  group: undefined,
  phase: "quarter-finals" as const,
  dateTime: new Date(2026, 6, 9 + Math.floor(i / 2), 13 + (i % 2) * 4, 0).toISOString(),
  venue: "A definir",
  city: "A definir",
  country: "EUA",
  status: "scheduled" as const,
}))

// Semi-finals: 2 matches (July 14-15)
const semiFinalMatches: Match[] = [
  {
    id: "SF-01",
    homeTeamId: "W-QF-01",
    awayTeamId: "W-QF-02",
    phase: "semi-finals",
    dateTime: "2026-07-14T18:00:00-04:00",
    venue: "MetLife Stadium",
    city: "Nova York",
    country: "EUA",
    status: "scheduled",
  },
  {
    id: "SF-02",
    homeTeamId: "W-QF-03",
    awayTeamId: "W-QF-04",
    phase: "semi-finals",
    dateTime: "2026-07-15T18:00:00-04:00",
    venue: "AT&T Stadium",
    city: "Dallas",
    country: "EUA",
    status: "scheduled",
  },
]

// Third place match
const thirdPlaceMatch: Match = {
  id: "3RD-01",
  homeTeamId: "L-SF-01",
  awayTeamId: "L-SF-02",
  phase: "third-place",
  dateTime: "2026-07-18T15:00:00-04:00",
  venue: "Hard Rock Stadium",
  city: "Miami",
  country: "EUA",
  status: "scheduled",
}

// Final
const finalMatch: Match = {
  id: "FIN-01",
  homeTeamId: "W-SF-01",
  awayTeamId: "W-SF-02",
  phase: "final",
  dateTime: "2026-07-19T15:00:00-04:00",
  venue: "MetLife Stadium",
  city: "Nova York",
  country: "EUA",
  status: "scheduled",
}

export const ALL_MATCHES: Match[] = [
  ...groupStageMatches,
  ...roundOf32Matches,
  ...roundOf16Matches,
  ...quarterFinalMatches,
  ...semiFinalMatches,
  thirdPlaceMatch,
  finalMatch,
]

export function getMatchesByPhase(phase: Match["phase"]): Match[] {
  return ALL_MATCHES.filter((m) => m.phase === phase)
}

export function getMatchesByGroup(group: string): Match[] {
  return ALL_MATCHES.filter((m) => m.group === group)
}
