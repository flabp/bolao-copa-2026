import nodemailer from "nodemailer"
import { NextRequest, NextResponse } from "next/server"

const APP_URL = "https://bolao-copa-2026-eta.vercel.app"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function POST(request: NextRequest) {
  try {
    const { name, email, code } = await request.json()

    if (!name || !email || !code) {
      return NextResponse.json(
        { error: "Nome, email e codigo sao obrigatorios" },
        { status: 400 }
      )
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return NextResponse.json(
        { error: "Gmail nao configurado no servidor" },
        { status: 500 }
      )
    }

    await transporter.sendMail({
      from: `"⚽ Bolao Copa 2026" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "⚽ Suas credenciais do Bolão Copa do Mundo 2026",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #ffffff; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%); padding: 32px; text-align: center;">
            <div style="background: #f59e0b; width: 56px; height: 56px; border-radius: 12px; display: inline-block; line-height: 56px; font-size: 28px; margin-bottom: 16px;">&#127942;</div>
            <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #ffffff;">Bolao Copa do Mundo 2026</h1>
            <p style="margin: 8px 0 0; color: #94a3b8; font-size: 14px;">EUA / Mexico / Canada</p>
          </div>

          <div style="padding: 32px;">
            <p style="font-size: 16px; color: #e2e8f0;">Ola <strong>${name}</strong>!</p>
            <p style="font-size: 14px; color: #94a3b8; line-height: 1.6;">
              Voce foi cadastrado(a) no Bolao da Copa do Mundo 2026!
              Use as credenciais abaixo para acessar o sistema e fazer seus palpites.
            </p>

            <div style="background: #1e293b; border-radius: 8px; padding: 24px; margin: 24px 0;">
              <p style="margin: 0 0 12px; font-size: 12px; text-transform: uppercase; color: #64748b; letter-spacing: 1px;">Suas Credenciais</p>
              <p style="margin: 0 0 8px; font-size: 14px; color: #e2e8f0;">
                <strong>Nome:</strong> ${name}
              </p>
              <p style="margin: 0; font-size: 14px; color: #e2e8f0;">
                <strong>Codigo:</strong> <span style="background: #334155; padding: 2px 8px; border-radius: 4px; color: #f59e0b; font-family: monospace;">${code}</span>
              </p>
            </div>

            <a href="${APP_URL}" style="display: block; background: #10b981; color: #ffffff; text-decoration: none; text-align: center; padding: 14px 24px; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 24px 0;">
              Acessar o Bolao
            </a>

            <div style="border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 24px;">
              <p style="font-size: 12px; color: #64748b; margin: 0;">
                A Copa comeca em 11 de junho de 2026.<br>
                Faca seus palpites antes do inicio de cada jogo.<br>
                Boa sorte!
              </p>
            </div>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Send email error:", err)
    return NextResponse.json(
      { error: err.message || "Erro ao enviar email" },
      { status: 500 }
    )
  }
}
