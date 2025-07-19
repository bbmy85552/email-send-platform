"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGoogleAuth } from "@/hooks/use-google-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Send, Loader2, User, LogOut, RefreshCw, Mail, Clock, CheckCircle, XCircle } from "lucide-react"

interface EmailData {
  id: string
  subject: string
  recipient: string
  fromName: string
  senderEmail: string
  status: 'sent' | 'failed' | 'pending'
  sentAt: string
  createdAt: string
  emailId?: string
}

export default function EmailCompose() {
  const { user, signOut } = useGoogleAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [emails, setEmails] = useState<EmailData[]>([])
  const [loadingEmails, setLoadingEmails] = useState(false)
  const [dailyCount, setDailyCount] = useState(0)
  const [dailyLimit, setDailyLimit] = useState(10)
  
  // 5个自定义参数
  const [formData, setFormData] = useState({
    fromName: "",
    senderEmail: "",
    recipient: "",
    subject: "",
    content: ""
  })

  // 获取用户邮件历史
  const fetchUserEmails = async () => {
    if (!user?.email) return
    
    setLoadingEmails(true)
    try {
      const response = await fetch(`/api/user-emails?email=${encodeURIComponent(user.email)}`)
      const result = await response.json()
      
      if (result.success) {
        setEmails(result.emails)
        // 计算今日发送的邮件数量
        const today = new Date().toISOString().slice(0, 10)
        const todayEmails = result.emails.filter((email: EmailData) => 
          email.createdAt.slice(0, 10) === today && email.status === 'sent'
        )
        setDailyCount(todayEmails.length)
      } else {
        console.error("获取邮件历史失败:", result.error)
      }
    } catch (err) {
      console.error("获取邮件历史错误:", err)
    } finally {
      setLoadingEmails(false)
    }
  }

  // 页面加载时获取邮件历史
  useEffect(() => {
    if (user) {
      fetchUserEmails()
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userEmail: user?.email
        })
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(true)
        setDailyCount(result.dailyCount)
        setFormData({
          fromName: "",
          senderEmail: "",
          recipient: "",
          subject: "",
          content: ""
        })
        
        // 重新获取邮件列表
        await fetchUserEmails()
        
        // 3秒后隐藏成功提示
        setTimeout(() => {
          setSuccess(false)
        }, 3000)
      } else {
        setError(result.error || "郵件發送失敗")
      }
    } catch (err) {
      setError("網絡錯誤，請稍後再試")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-TW')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'pending':
        return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />
      default:
        return <Mail className="w-4 h-4 text-gray-500" />
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">請先登錄後再發送郵件</p>
          <Button onClick={() => router.push('/')} className="mt-4">
            返回登錄
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 顶部导航栏 */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回儀表板
          </Button>

          {/* 用户信息 */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.picture} alt={user.name} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-gray-500">{user.email}</div>
              </div>
            </div>
            <Button
              onClick={() => {
                signOut()
                router.push('/')
              }}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4 mr-1" />
              登出
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：邮件发送表单 */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>自定義郵件發送</CardTitle>
                <CardDescription>
                  使用自定義參數發送郵件，今日已發送: {dailyCount}/{dailyLimit}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {success && (
                  <Alert className="mb-6 bg-green-50 border-green-200">
                    <AlertDescription className="text-green-800">
                      郵件發送成功！今日已發送 {dailyCount}/{dailyLimit}
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert className="mb-6 bg-red-50 border-red-200">
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="fromName">發件人名稱</Label>
                    <Input
                      id="fromName"
                      value={formData.fromName}
                      onChange={(e) => handleInputChange("fromName", e.target.value)}
                      placeholder="例如：公司名稱或個人姓名"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="senderEmail">發送郵箱前綴</Label>
                    <div className="flex items-center">
                      <Input
                        id="senderEmail"
                        value={formData.senderEmail}
                        onChange={(e) => handleInputChange("senderEmail", e.target.value)}
                        placeholder="例如：noreply"
                        required
                        className="flex-1"
                      />
                      <span className="ml-2 text-gray-500">@novatime.top</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="recipient">收件人郵箱</Label>
                    <Input
                      id="recipient"
                      type="email"
                      value={formData.recipient}
                      onChange={(e) => handleInputChange("recipient", e.target.value)}
                      placeholder="例如：user@example.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">郵件主題</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="郵件主題"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">郵件內容</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange("content", e.target.value)}
                      placeholder="郵件正文內容（支持 HTML）"
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || dailyCount >= dailyLimit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        發送中...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        發送郵件 ({dailyCount}/{dailyLimit})
                      </>
                    )}
                  </Button>
                  
                  {dailyCount >= dailyLimit && (
                    <div className="text-center text-sm text-red-600">
                      今日发邮件次数已达上限 ({dailyLimit}次)
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：已发送邮件列表 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">已發送郵件</CardTitle>
                  <CardDescription>
                    {emails.length} 封郵件
                  </CardDescription>
                </div>
                <Button
                  onClick={fetchUserEmails}
                  variant="ghost"
                  size="sm"
                  disabled={loadingEmails}
                  className="h-8 w-8 p-0"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingEmails ? 'animate-spin' : ''}`} />
                </Button>
              </CardHeader>
              <CardContent>
                {loadingEmails ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-500">載入中...</p>
                  </div>
                ) : emails.length === 0 ? (
                  <div className="text-center py-8">
                    <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">暫無郵件記錄</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {emails.map((email) => (
                      <div key={email.id} className="border rounded-lg p-3 hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="text-sm font-medium truncate flex-1">{email.subject}</h4>
                          <div className="ml-2">{getStatusIcon(email.status)}</div>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          收件人: {email.recipient}
                        </p>
                        <p className="text-xs text-gray-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {formatDate(email.createdAt)}
                        </p>
                        <p className="text-xs text-gray-500">
                          發件人: {email.fromName} &lt;{email.senderEmail}&gt;
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}