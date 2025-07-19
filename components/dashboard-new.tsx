"use client"

import { Button } from "@/components/ui/simplified"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/simplified"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/simplified"
import { Badge } from "@/components/ui/simplified"
import { LogOut, Mail, Calendar, Shield, Activity, User, Clock, Globe } from "lucide-react"
import { formatUserName, getAvatarFallback } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useGoogleAuth } from "@/hooks/use-google-auth"
import { useRouter } from "next/navigation"

export default function DashboardNew() {
  const { user, signOut, isSignedIn } = useGoogleAuth()
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState<string>("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString("zh-TW"))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!isSignedIn && mounted) {
      router.push('/')
    }
  }, [isSignedIn, mounted, router])

  const handleSignOut = () => {
    signOut()
    router.push('/')
  }

  if (!mounted || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">儀表板</h1>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Shield className="w-3 h-3 mr-1" />
                已驗證
              </Badge>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              登出
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User profile card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={user.picture || ""} alt="用戶頭像" />
                  <AvatarFallback className="text-2xl">
                    {getAvatarFallback(user.name)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{formatUserName(user.name)}</CardTitle>
                <CardDescription className="flex items-center justify-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {user.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">登入狀態</span>
                  <Badge className="bg-green-100 text-green-800">
                    <Activity className="w-3 h-3 mr-1" />
                    在線
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">驗證方式</span>
                  <span className="text-sm text-gray-900">Google Identity</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">當前時間</span>
                  <span className="text-sm text-gray-900">{currentTime}</span>
                </div>
                {user.email_verified && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">電子郵件</span>
                    <Badge className="bg-green-100 text-green-800">
                      ✓ 已驗證
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main dashboard content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  歡迎回來！
                </CardTitle>
                <CardDescription>您已成功通過 Google Identity Services 登入系統</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">安全連接</h3>
                    <p className="text-sm text-blue-700">
                      您的連接已通過 SSL 加密保護，確保數據傳輸安全。
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">身份已驗證</h3>
                    <p className="text-sm text-green-700">
                      通過 Google Identity Services 驗證，享受現代化的登入體驗。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>用戶資訊</CardTitle>
                <CardDescription>您的 Google 帳戶詳細資訊</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium text-gray-600 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      用戶 ID
                    </span>
                    <span className="text-sm text-gray-900 font-mono">{user.id}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-medium text-gray-600 flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      電子郵件
                    </span>
                    <span className="text-sm text-gray-900">{user.email}</span>
                  </div>
                  {user.given_name && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium text-gray-600">名字</span>
                      <span className="text-sm text-gray-900">{user.given_name}</span>
                    </div>
                  )}
                  {user.family_name && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium text-gray-600">姓氏</span>
                      <span className="text-sm text-gray-900">{user.family_name}</span>
                    </div>
                  )}
                  {user.locale && (
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm font-medium text-gray-600 flex items-center">
                        <Globe className="w-4 h-4 mr-2" />
                        語言偏好
                      </span>
                      <span className="text-sm text-gray-900">{user.locale}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-600 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      認證類型
                    </span>
                    <span className="text-sm text-gray-900">Google Identity Services</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 额外功能卡片 */}
            <Card>
              <CardHeader>
                <CardTitle>系統資訊</CardTitle>
                <CardDescription>當前系統和會話狀態</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-blue-900">安全等級</h4>
                    <p className="text-sm text-blue-700">高</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-green-900">會話狀態</h4>
                    <p className="text-sm text-green-700">活躍中</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Globe className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-purple-900">連接類型</h4>
                    <p className="text-sm text-purple-700">HTTPS</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
} 