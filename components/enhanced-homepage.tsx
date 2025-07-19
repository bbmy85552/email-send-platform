"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, Shield, Zap, BarChart3, RefreshCw, CheckCircle, Clock } from "lucide-react"
import { useGoogleAuth } from "@/hooks/use-google-auth"

export default function EnhancedHomepage() {
  const router = useRouter()
  const { user, isLoading, error, renderSignInButton, clearError } = useGoogleAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const features = [
    {
      icon: Mail,
      title: "智能郵件發送",
      description: "自定義發件人名稱和郵箱，支持HTML格式內容，讓您的郵件更具專業性",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: BarChart3,
      title: "發送統計追蹤",
      description: "實時追蹤每日發送數量，查看歷史郵件記錄，掌握郵件發送狀態",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Shield,
      title: "安全認證登入",
      description: "使用Google OAuth安全登入，保護您的賬戶和郵件數據安全",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Clock,
      title: "每日限額管理",
      description: "智能控制每日發送數量，避免濫用，確保服務穩定可靠",
      color: "from-orange-500 to-orange-600"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  const fadeInUp = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* 背景装饰动画 */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10">
        {/* 导航栏 */}
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 py-6"
        >
          <div className="flex justify-between items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <Mail className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">NovaMail</span>
            </motion.div>
            <div id="google-signin-nav" className="hidden" />
          </div>
        </motion.nav>

        {/* 主要内容区域 */}
        <div className="container mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
            {/* 左侧标题和描述 */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={itemVariants} className="space-y-4">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight"
                >
                  專業郵件
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    發送平台
                  </span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl text-gray-600 max-w-lg leading-relaxed"
                >
                  使用 Google 賬戶安全登入，享受智能郵件發送、實時統計追蹤、
                  每日限額管理等專業功能，讓您的郵件溝通更高效、更安全。
                </motion.p>
              </motion.div>

              {/* 主要功能展示 */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 gap-4"
              >
                {features.slice(0, 2).map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20"
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-3`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* 登录按钮区域 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-4">
                  <div 
                    ref={(el) => {
                      if (el && !isLoading && !user) {
                        el.innerHTML = ''
                        renderSignInButton(el)
                      }
                    }}
                    className="w-full flex justify-center"
                  />
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-sm text-gray-500 text-center"
                >
                  🔒 使用 Google 安全認證，無需註冊新賬戶
                </motion.div>
              </motion.div>
            </motion.div>

            {/* 右侧功能卡片 */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                  }}
                  className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/30"
                >
                  <div className="flex items-start space-x-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <feature.icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* 统计数据卡片 */}
              <motion.div
                variants={fadeInUp}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold mb-1">即刻開始使用</h4>
                    <p className="text-blue-100">體驗專業郵件發送服務</p>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* 底部信息 */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="container mx-auto px-6 py-8 text-center"
        >
          <p className="text-gray-500 text-sm">
            © 2025 NovaMail. 專業郵件發送服務，讓溝通更簡單。
          </p>
        </motion.footer>
      </div>

      {/* 错误提示 */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50"
          >
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between space-x-4">
                  <span className="text-red-800 text-sm">{error}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearError}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}