"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Alert, AlertDescription } from "@/components/ui/simplified"
import { Shield, Users, Zap, AlertCircle, Loader2 } from "lucide-react"
import { useGoogleAuth } from "@/hooks/use-google-auth"

export default function LoginPageNew() {
  const router = useRouter()
  const { user, isLoading, error, renderSignInButton, clearError } = useGoogleAuth()
  const buttonRef = useRef<HTMLDivElement>(null)

  // 如果用户已登录，重定向到dashboard
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  // 渲染Google登录按钮
  useEffect(() => {
    if (buttonRef.current && !isLoading && !user) {
      // 清空之前的按钮
      buttonRef.current.innerHTML = ''
      renderSignInButton(buttonRef.current)
    }
  }, [renderSignInButton, isLoading, user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">初始化登入系統...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Hero content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900">
              歡迎使用
              <span className="text-blue-600 block">安全驗證平台</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-lg">
              使用 Google 帳戶快速安全地登入，享受無縫的身份驗證體驗。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <Shield className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">安全可靠</h3>
                <p className="text-sm text-gray-600">企業級安全保護</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <Zap className="w-8 h-8 text-yellow-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">快速登入</h3>
                <p className="text-sm text-gray-600">一鍵完成驗證</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <Users className="w-8 h-8 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">用戶友好</h3>
                <p className="text-sm text-gray-600">直覺的使用體驗</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login card */}
        <div className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">登入您的帳戶</CardTitle>
              <CardDescription>使用您的 Google 帳戶安全登入</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error display */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>{error}</span>
                    <button
                      onClick={clearError}
                      className="text-xs underline hover:no-underline"
                    >
                      清除
                    </button>
                  </AlertDescription>
                </Alert>
              )}

              {/* Google Sign-in Button Container */}
              <div className="flex justify-center">
                <div ref={buttonRef} className="w-full" />
              </div>

              <div className="text-center text-sm text-gray-500 space-y-2">
                <p>點擊登入即表示您同意我們的</p>
                <div className="space-x-4">
                  <a href="#" className="text-blue-600 hover:underline">
                    服務條款
                  </a>
                  <span>和</span>
                  <a href="#" className="text-blue-600 hover:underline">
                    隱私政策
                  </a>
                </div>
              </div>

              {/* 配置提示 */}
              <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>開發者提示:</strong> 請確保已設置環境變數 
                      <code className="bg-yellow-100 px-1 rounded text-xs mx-1">
                        NEXT_PUBLIC_GOOGLE_CLIENT_ID
                      </code>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 