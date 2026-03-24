import { NextRequest, NextResponse } from "next/server"
import { supabaseServer, isServerConfigured } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  if (!isServerConfigured()) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 })
  }

  const { name, code } = await request.json()
  if (!name || !code) {
    return NextResponse.json({ error: "Nome e codigo sao obrigatorios" }, { status: 400 })
  }

  const { data, error } = await supabaseServer!
    .from("participants")
    .select("id, name, email, phone, avatar_color, is_admin, password_code")
    .ilike("name", name)
    .eq("password_code", code)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Nome ou codigo incorreto" }, { status: 401 })
  }

  // Return participant data (without password_code)
  return NextResponse.json({
    id: data.id,
    name: data.name,
    email: data.email || "",
    phone: data.phone || "",
    avatarColor: data.avatar_color || "#3B82F6",
    isAdmin: data.is_admin || false,
  })
}
