"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) return
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])
  return timeLeft
}

export function LoginPage() {
  const { login } = useAuth()
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const countdown = useCountdown("2026-06-11T18:00:00-04:00")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setError("")
    setLoading(true)
    try {
      const result = await login(name.trim(), code)
      if (!result.success) {
        setError(result.error || "Erro ao fazer login")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Stadium Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: "url('/stadium-night.jpg')" }}
      />
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      <div className="absolute inset-0 bg-[#0f172a]/40" />

      {/* Animated glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: "1s" }} />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Trophy Icon */}
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 text-[#0f172a] shadow-2xl shadow-amber-500/30 mb-6 ring-4 ring-amber-400/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            BOLAO
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-400 tracking-tight -mt-1">
            Copa do Mundo 2026
          </h2>
          <p className="mt-3 text-slate-400 text-sm font-medium tracking-widest uppercase">
            EUA &bull; Mexico &bull; Canada
          </p>
        </div>

        {/* Countdown */}
        <div className="flex justify-center gap-3 mb-8">
          {[
            { value: countdown.days, label: "Dias" },
            { value: countdown.hours, label: "Horas" },
            { value: countdown.minutes, label: "Min" },
            { value: countdown.seconds, label: "Seg" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white tabular-nums">
                  {item.value.toString().padStart(2, "0")}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1.5 block font-medium">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Login Card */}
        <div className="rounded-3xl bg-white/[0.07] backdrop-blur-xl border border-white/[0.12] p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="login-name" className="block text-sm font-medium text-slate-300">
                Nome
              </label>
              <input
                id="login-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                required
                autoComplete="username"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-slate-500 outline-none transition-all focus:border-amber-500/50 focus:bg-white/10 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="login-code" className="block text-sm font-medium text-slate-300">
                Codigo de Acesso
              </label>
              <input
                id="login-code"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Seu codigo"
                autoComplete="current-password"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-slate-500 outline-none transition-all focus:border-amber-500/50 focus:bg-white/10 focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:shadow-emerald-500/40 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] uppercase tracking-wider"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-600">
          11 de Junho a 19 de Julho de 2026
        </p>
      </div>
    </div>
  )
}
