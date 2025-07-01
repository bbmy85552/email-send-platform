"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGoogleAuth } from "@/hooks/use-google-auth"
import LoginPageNew from "@/components/login-page-new"

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在重定向到儀表板...</p>
        </div>
      </div>
    )
  }

  return <LoginPageNew />
} 