"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LogOut, Mail, Calendar, Shield, Activity, User, Clock, Globe } from "lucide-react"
import { formatUserName, getAvatarFallback } from "@/lib/utils"
import { useState, useEffect } from "react"
import { useGoogleAuth } from "@/hooks/use-google-auth"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-muted-foreground">載入中...</p>
        </motion.div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const cardHoverVariants = {
    initial: { y: 0 },
    hover: { 
      y: -5,
      transition: { duration: 0.2 }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-card/80 backdrop-blur-md shadow-lg border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-4"
            >
              <h1 className="text-xl font-bold text-foreground">儀表板</h1>
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700">
                <Shield className="w-3 h-3 mr-1" />
                已驗證
              </Badge>
            </motion.div>
            
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-2"
            >
              <ThemeToggle />
              <Button 
                onClick={handleSignOut} 
                variant="outline" 
                size="sm"
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                登出
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main content with animations */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User profile card with animation */}
          <motion.div
            variants={itemVariants}
            whileHover={cardHoverVariants}
            className="lg:col-span-1"
          >
            <Card className="bg-card/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden">
              <CardHeader className="text-center relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                >
                  <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-blue-100">
                    <AvatarImage src={user.picture || ""} alt="用戶頭像" />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {getAvatarFallback(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <CardTitle className="text-xl font-bold text-foreground">{formatUserName(user.name)}</CardTitle>
                  <CardDescription className="flex items-center justify-center mt-2">
                    <Mail className="w-4 h-4 mr-2" />
                    {user.email}
                  </CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6, staggerChildren: 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium text-muted-foreground flex items-center">
                      <Activity className="w-4 h-4 mr-2" />
                      登入狀態
                    </span>
                    <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700">
                      在線
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium text-muted-foreground flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      驗證方式
                    </span>
                    <span className="text-sm font-semibold text-foreground">Google Identity</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium text-muted-foreground flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      當前時間
                    </span>
                    <motion.span 
                      className="text-sm font-mono text-foreground"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {currentTime}
                    </motion.span>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={() => router.push('/email-compose')}
                    className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                    size="lg"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    開始發送郵件
                    <motion.span
                      className="ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main dashboard content with staggered animations */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div variants={itemVariants}>
              <Card className="bg-card/90 backdrop-blur-sm shadow-xl border-0 overflow-hidden">
                <CardHeader>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <CardTitle className="flex items-center text-2xl text-foreground">
                      <Calendar className="w-6 h-6 mr-3" />
                      歡迎回來！
                    </CardTitle>
                    <CardDescription className="mt-2 text-lg">您已成功通過 Google Identity Services 登入系統</CardDescription>
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, staggerChildren: 0.1 }}
                  >
                    <motion.div 
                      className="p-6 bg-muted/50 rounded-xl border"
                      whileHover={{ scale: 1.02, rotateZ: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        <Shield className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-3" />
                      </motion.div>
                      <h3 className="font-semibold text-foreground mb-2 text-lg">安全連接</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        您的連接已通過 SSL 加密保護，確保數據傳輸安全。
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      className="p-6 bg-muted/50 rounded-xl border"
                      whileHover={{ scale: 1.02, rotateZ: -1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                      >
                        <Activity className="w-10 h-10 text-green-600 dark:text-green-400 mb-3" />
                      </motion.div>
                      <h3 className="font-semibold text-foreground mb-2 text-lg">身份已驗證</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        通過 Google Identity Services 驗證，享受現代化的登入體驗。
                      </p>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-card/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <CardTitle className="text-xl text-foreground">用戶資訊</CardTitle>
                    <CardDescription className="text-muted-foreground">您的 Google 帳戶詳細資訊</CardDescription>
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    className="space-y-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, staggerChildren: 0.1 }}
                  >
                    {[
                      { icon: User, label: "用戶 ID", value: user.id },
                      { icon: Mail, label: "電子郵件", value: user.email },
                      { icon: Clock, label: "認證類型", value: "Google Identity Services" }
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        variants={itemVariants}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border hover:bg-muted/70 transition-colors"
                      >
                        <span className="text-sm font-medium text-muted-foreground flex items-center">
                          <item.icon className="w-4 h-4 mr-2" />
                          {item.label}
                        </span>
                        <span className="text-sm text-foreground font-mono"
                          style={{ overflowWrap: 'break-word', maxWidth: '200px' }}
                        >
                          {item.value}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-card/90 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.1 }}
                  >
                    <CardTitle className="text-xl text-foreground">系統資訊</CardTitle>
                    <CardDescription className="text-muted-foreground">當前系統和會話狀態</CardDescription>
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, staggerChildren: 0.1 }}
                  >
                    {[
                      { icon: Shield, title: "安全等級", value: "高", color: "blue" },
                      { icon: Activity, title: "會話狀態", value: "活躍中", color: "green" },
                      { icon: Globe, title: "連接類型", value: "HTTPS", color: "purple" }
                    ].map((item, index) => (
                      <motion.div
                        key={item.title}
                        variants={itemVariants}
                        className="text-center p-6 bg-muted/50 rounded-xl border-2 border-border hover:bg-muted/70 transition-colors"
                        whileHover={{ 
                          scale: 1.05, 
                          rotateY: 5,
                          boxShadow: `0 10px 25px -5px rgba(var(--primary), 0.3)`
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          animate={{ 
                            y: [0, -5, 0],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                        >
                          <item.icon className="w-10 h-10 text-foreground mx-auto mb-3" />
                        </motion.div>
                        <h4 className="font-bold text-foreground text-lg">{item.title}</h4>
                        <p className="text-sm text-muted-foreground font-semibold">{item.value}</p>
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.main>
    </div>
  )
}