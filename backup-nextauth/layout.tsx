import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SessionProvider } from "@/components/session-provider"
import { AuthErrorBoundary } from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Next.js Google 身份驗證",
  description: "使用 Google OAuth2 的安全身份驗證系統",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        <AuthErrorBoundary>
          <SessionProvider>{children}</SessionProvider>
        </AuthErrorBoundary>
      </body>
    </html>
  )
}
