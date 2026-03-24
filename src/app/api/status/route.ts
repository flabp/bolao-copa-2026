import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    footballApi: !!process.env.FOOTBALL_API_KEY,
    serviceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    gmail: !!process.env.GMAIL_USER && !!process.env.GMAIL_APP_PASSWORD,
  })
}
