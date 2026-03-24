import { NextRequest, NextResponse } from "next/server"
import { supabaseServer, isServerConfigured } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  if (!isServerConfigured()) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 })
  }

  const { adminId, name, email, phone, passwordCode, isAdmin: makeAdmin } = await request.json()

  // Validate admin
  if (!adminId) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
  }

  const { data: admin } = await supabaseServer!
    .from("participants")
    .select("id, is_admin")
    .eq("id", adminId)
    .single()

  if (!admin || !admin.is_admin) {
    return NextResponse.json({ error: "Acesso restrito a administradores" }, { status: 403 })
  }

  if (!name || !passwordCode) {
    return NextResponse.json({ error: "Nome e codigo sao obrigatorios" }, { status: 400 })
  }

  const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316"]
  const color = colors[Math.floor(Math.random() * colors.length)]

  const { data, error } = await supabaseServer!.from("participants").insert({
    name,
    email: email || null,
    phone: phone || null,
    password_code: passwordCode,
    is_admin: makeAdmin || false,
    avatar_color: color,
  }).select().single()

  if (error) {
    return NextResponse.json({ error: "Erro ao cadastrar participante" }, { status: 500 })
  }

  return NextResponse.json({
    id: data.id,
    name: data.name,
    email: data.email || "",
    phone: data.phone || "",
    avatarColor: data.avatar_color,
    isAdmin: data.is_admin,
    createdAt: data.created_at,
  })
}

export async function DELETE(request: NextRequest) {
  if (!isServerConfigured()) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 })
  }

  const { adminId, participantId } = await request.json()

  // Validate admin
  const { data: admin } = await supabaseServer!
    .from("participants")
    .select("id, is_admin")
    .eq("id", adminId)
    .single()

  if (!admin || !admin.is_admin) {
    return NextResponse.json({ error: "Acesso restrito" }, { status: 403 })
  }

  const { error } = await supabaseServer!.from("participants").delete().eq("id", participantId)
  if (error) {
    return NextResponse.json({ error: "Erro ao remover" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
