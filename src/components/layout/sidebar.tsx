"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Trophy,
  Users,
  Calendar,
  PenLine,
  BarChart3,
  Shield,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

const allNavItems = [
  { href: "/", label: "Inicio", icon: Home, adminOnly: false },
  { href: "/jogos", label: "Jogos", icon: Calendar, adminOnly: false },
  { href: "/palpites", label: "Meus Palpites", icon: PenLine, adminOnly: false },
  { href: "/classificacao", label: "Classificacao", icon: BarChart3, adminOnly: false },
  { href: "/grupos", label: "Grupos", icon: Trophy, adminOnly: false },
  { href: "/participantes", label: "Participantes", icon: Users, adminOnly: true },
  { href: "/admin", label: "Admin", icon: Shield, adminOnly: true },
  { href: "/setup", label: "Configuracoes", icon: Settings, adminOnly: true },
]

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { currentParticipantName, isAdmin, logout } = useAuth()

  const navItems = allNavItems.filter((item) => !item.adminOnly || isAdmin)

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 rounded-xl bg-[#1e3a5f] p-2.5 text-white shadow-lg lg:hidden transition-transform active:scale-95"
        aria-label="Menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header with gradient */}
        <div className="relative overflow-hidden px-5 py-5">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] to-[#0f172a]" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-lg font-bold text-[#0f172a] shadow-lg">
              <Trophy size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight text-white tracking-tight">Bolao Copa</h1>
              <p className="text-xs font-medium text-amber-400">FIFA 2026</p>
            </div>
          </div>
        </div>

        {/* Logged-in user display */}
        <div className="border-b border-sidebar-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] text-xs font-bold text-white">
                {currentParticipantName?.charAt(0).toUpperCase() ?? "?"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">
                  {currentParticipantName}
                </p>
                {isAdmin && (
                  <p className="text-xs text-amber-400">Admin</p>
                )}
              </div>
            </div>
            <button
              onClick={logout}
              className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              title="Sair"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-amber-500 text-[#0f172a] shadow-md shadow-amber-500/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border px-4 py-4 text-center">
          <p className="text-xs font-medium text-slate-500">Copa do Mundo 2026</p>
          <p className="mt-1 text-sm tracking-wider text-slate-400">
            <span className="inline-block">US</span>
            {" / "}
            <span className="inline-block">MX</span>
            {" / "}
            <span className="inline-block">CA</span>
          </p>
        </div>
      </aside>
    </>
  )
}
