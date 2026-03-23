import { Team } from "./types"

export const TEAMS: Team[] = [
  // Grupo A
  { id: "MEX", name: "Mexico", shortName: "MEX", flag: "\ud83c\uddf2\ud83c\uddfd", group: "A", isPlaceholder: false },
  { id: "ZAF", name: "Africa do Sul", shortName: "RSA", flag: "\ud83c\uddff\ud83c\udde6", group: "A", isPlaceholder: false },
  { id: "KOR", name: "Coreia do Sul", shortName: "KOR", flag: "\ud83c\uddf0\ud83c\uddf7", group: "A", isPlaceholder: false },
  { id: "PLD", name: "Playoff UEFA D", shortName: "PLD", flag: "\ud83c\uddea\ud83c\uddfa", group: "A", isPlaceholder: true, placeholderLabel: "Vencedor Playoff UEFA D" },

  // Grupo B
  { id: "CAN", name: "Canada", shortName: "CAN", flag: "\ud83c\udde8\ud83c\udde6", group: "B", isPlaceholder: false },
  { id: "SUI", name: "Suica", shortName: "SUI", flag: "\ud83c\udde8\ud83c\udded", group: "B", isPlaceholder: false },
  { id: "QAT", name: "Catar", shortName: "QAT", flag: "\ud83c\uddf6\ud83c\udde6", group: "B", isPlaceholder: false },
  { id: "PLA", name: "Playoff UEFA A", shortName: "PLA", flag: "\ud83c\uddea\ud83c\uddfa", group: "B", isPlaceholder: true, placeholderLabel: "Vencedor Playoff UEFA A" },

  // Grupo C
  { id: "BRA", name: "Brasil", shortName: "BRA", flag: "\ud83c\udde7\ud83c\uddf7", group: "C", isPlaceholder: false },
  { id: "MAR", name: "Marrocos", shortName: "MAR", flag: "\ud83c\uddf2\ud83c\udde6", group: "C", isPlaceholder: false },
  { id: "HTI", name: "Haiti", shortName: "HAI", flag: "\ud83c\udded\ud83c\uddf9", group: "C", isPlaceholder: false },
  { id: "SCO", name: "Escocia", shortName: "SCO", flag: "\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f", group: "C", isPlaceholder: false },

  // Grupo D
  { id: "USA", name: "Estados Unidos", shortName: "USA", flag: "\ud83c\uddfa\ud83c\uddf8", group: "D", isPlaceholder: false },
  { id: "PAR", name: "Paraguai", shortName: "PAR", flag: "\ud83c\uddf5\ud83c\uddfe", group: "D", isPlaceholder: false },
  { id: "AUS", name: "Australia", shortName: "AUS", flag: "\ud83c\udde6\ud83c\uddfa", group: "D", isPlaceholder: false },
  { id: "PLC", name: "Playoff UEFA C", shortName: "PLC", flag: "\ud83c\uddea\ud83c\uddfa", group: "D", isPlaceholder: true, placeholderLabel: "Vencedor Playoff UEFA C" },

  // Grupo E
  { id: "GER", name: "Alemanha", shortName: "ALE", flag: "\ud83c\udde9\ud83c\uddea", group: "E", isPlaceholder: false },
  { id: "CUR", name: "Curacao", shortName: "CUR", flag: "\ud83c\udde8\ud83c\uddfc", group: "E", isPlaceholder: false },
  { id: "CIV", name: "Costa do Marfim", shortName: "CIV", flag: "\ud83c\udde8\ud83c\uddee", group: "E", isPlaceholder: false },
  { id: "ECU", name: "Equador", shortName: "EQU", flag: "\ud83c\uddea\ud83c\udde8", group: "E", isPlaceholder: false },

  // Grupo F
  { id: "NED", name: "Holanda", shortName: "HOL", flag: "\ud83c\uddf3\ud83c\uddf1", group: "F", isPlaceholder: false },
  { id: "JPN", name: "Japao", shortName: "JAP", flag: "\ud83c\uddef\ud83c\uddf5", group: "F", isPlaceholder: false },
  { id: "TUN", name: "Tunisia", shortName: "TUN", flag: "\ud83c\uddf9\ud83c\uddf3", group: "F", isPlaceholder: false },
  { id: "PLB", name: "Playoff UEFA B", shortName: "PLB", flag: "\ud83c\uddea\ud83c\uddfa", group: "F", isPlaceholder: true, placeholderLabel: "Vencedor Playoff UEFA B" },

  // Grupo G
  { id: "BEL", name: "Belgica", shortName: "BEL", flag: "\ud83c\udde7\ud83c\uddea", group: "G", isPlaceholder: false },
  { id: "EGY", name: "Egito", shortName: "EGI", flag: "\ud83c\uddea\ud83c\uddec", group: "G", isPlaceholder: false },
  { id: "IRN", name: "Ira", shortName: "IRA", flag: "\ud83c\uddee\ud83c\uddf7", group: "G", isPlaceholder: false },
  { id: "NZL", name: "Nova Zelandia", shortName: "NZL", flag: "\ud83c\uddf3\ud83c\uddff", group: "G", isPlaceholder: false },

  // Grupo H
  { id: "ESP", name: "Espanha", shortName: "ESP", flag: "\ud83c\uddea\ud83c\uddf8", group: "H", isPlaceholder: false },
  { id: "CPV", name: "Cabo Verde", shortName: "CPV", flag: "\ud83c\udde8\ud83c\uddfb", group: "H", isPlaceholder: false },
  { id: "KSA", name: "Arabia Saudita", shortName: "KSA", flag: "\ud83c\uddf8\ud83c\udde6", group: "H", isPlaceholder: false },
  { id: "URU", name: "Uruguai", shortName: "URU", flag: "\ud83c\uddfa\ud83c\uddfe", group: "H", isPlaceholder: false },

  // Grupo I
  { id: "FRA", name: "Franca", shortName: "FRA", flag: "\ud83c\uddeb\ud83c\uddf7", group: "I", isPlaceholder: false },
  { id: "SEN", name: "Senegal", shortName: "SEN", flag: "\ud83c\uddf8\ud83c\uddf3", group: "I", isPlaceholder: false },
  { id: "NOR", name: "Noruega", shortName: "NOR", flag: "\ud83c\uddf3\ud83c\uddf4", group: "I", isPlaceholder: false },
  { id: "IC2", name: "Playoff Interconf. 2", shortName: "IC2", flag: "\ud83c\uddf0\ud83c\uddec", group: "I", isPlaceholder: true, placeholderLabel: "Vencedor Playoff Intercontinental 2" },

  // Grupo J
  { id: "ARG", name: "Argentina", shortName: "ARG", flag: "\ud83c\udde6\ud83c\uddf7", group: "J", isPlaceholder: false },
  { id: "ALG", name: "Argelia", shortName: "ARG", flag: "\ud83c\udde9\ud83c\uddff", group: "J", isPlaceholder: false },
  { id: "AUT", name: "Austria", shortName: "AUT", flag: "\ud83c\udde6\ud83c\uddf9", group: "J", isPlaceholder: false },
  { id: "JOR", name: "Jordania", shortName: "JOR", flag: "\ud83c\uddef\ud83c\uddf4", group: "J", isPlaceholder: false },

  // Grupo K
  { id: "POR", name: "Portugal", shortName: "POR", flag: "\ud83c\uddf5\ud83c\uddf9", group: "K", isPlaceholder: false },
  { id: "UZB", name: "Uzbequistao", shortName: "UZB", flag: "\ud83c\uddfa\ud83c\uddff", group: "K", isPlaceholder: false },
  { id: "COL", name: "Colombia", shortName: "COL", flag: "\ud83c\udde8\ud83c\uddf4", group: "K", isPlaceholder: false },
  { id: "IC1", name: "Playoff Interconf. 1", shortName: "IC1", flag: "\ud83c\uddf0\ud83c\uddec", group: "K", isPlaceholder: true, placeholderLabel: "Vencedor Playoff Intercontinental 1" },

  // Grupo L
  { id: "ENG", name: "Inglaterra", shortName: "ING", flag: "\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f", group: "L", isPlaceholder: false },
  { id: "CRO", name: "Croacia", shortName: "CRO", flag: "\ud83c\udded\ud83c\uddf7", group: "L", isPlaceholder: false },
  { id: "GHA", name: "Gana", shortName: "GAN", flag: "\ud83c\uddec\ud83c\udded", group: "L", isPlaceholder: false },
  { id: "PAN", name: "Panama", shortName: "PAN", flag: "\ud83c\uddf5\ud83c\udde6", group: "L", isPlaceholder: false },
]

export function getTeamById(id: string): Team | undefined {
  return TEAMS.find((t) => t.id === id)
}

export function getTeamsByGroup(group: string): Team[] {
  return TEAMS.filter((t) => t.group === group)
}

export const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]
