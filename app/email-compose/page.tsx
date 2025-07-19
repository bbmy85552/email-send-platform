"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useGoogleAuth } from "@/hooks/use-google-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Send, Loader2 } from "lucide-react"

export default function EmailCompose() {
  const { user } = useGoogleAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  
  // 5个自定义参数
  const [formData, setFormData] = useState({
    fromName: "",
    senderEmail: "",
    recipient: "",
    subject: "",
    content: ""
  })

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
        setFormData({
          fromName: "",
          senderEmail: "",
          recipient: "",
          subject: "",
          content: ""
        })
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          onClick={() => router.push("/dashboard")}
          variant="ghost"
          className="mb-6"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回儀表板
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>自定義郵件發送</CardTitle>
            <CardDescription>
              使用自定義參數發送郵件，所有字段都是必填項
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  郵件發送成功！正在返回儀表板...
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
                disabled={loading}
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
                    發送郵件
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}