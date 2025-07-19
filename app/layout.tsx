import "./globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "Authentication Demo",
  description: "Simplified authentication demo using Google Identity",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://accounts.google.com/gsi/client" async></script>
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light">
        {children}
        </ThemeProvider>
      </body>
    </html>
  )
} 