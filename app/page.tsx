"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGoogleAuth } from "@/hooks/use-google-auth"
import EnhancedHomepage from "@/components/enhanced-homepage"

export default function HomePage() {
  const router = useRouter()
  const { user, isLoading } = useGoogleAuth()

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  // 如果用户已登录，显示加载状态直到重定向
  if (user && !isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">正在重定向到儀表板...</p>
        </div>
      </div>
    )
  }

  return <EnhancedHomepage />
} 