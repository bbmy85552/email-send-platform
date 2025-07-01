import { useState, useEffect, useCallback } from 'react'
import { GoogleAuthSession, GOOGLE_AUTH_CONFIG, parseJwt, type GoogleUser } from '@/lib/google-auth'

export function useGoogleAuth() {
  const [user, setUser] = useState<GoogleUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const authSession = GoogleAuthSession.getInstance()

  // 初始化Google Identity Services
  const initializeGoogleAuth = useCallback(() => {
    if (typeof window === 'undefined' || !window.google || isInitialized) {
      return
    }

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_AUTH_CONFIG.CLIENT_ID,
        callback: handleCredentialResponse,
        ...GOOGLE_AUTH_CONFIG.INIT_CONFIG
      })
      setIsInitialized(true)
      setError(null)
    } catch (err) {
      console.error('Failed to initialize Google Auth:', err)
      setError('初始化 Google 認證失敗')
    }
  }, [isInitialized])

  // 处理Google登录回调
  const handleCredentialResponse = useCallback((response: { credential: string }) => {
    try {
      const userData = parseJwt(response.credential)
      authSession.setUser(userData)
      setError(null)
      console.log('Google 登入成功:', userData.email)
    } catch (err) {
      console.error('Failed to parse credential:', err)
      setError('登入失敗，請重試')
    }
  }, [authSession])

  // 登出
  const signOut = useCallback(() => {
    authSession.signOut()
    setError(null)
  }, [authSession])

  // 渲染Google登录按钮
  const renderSignInButton = useCallback((element: HTMLElement) => {
    if (!isInitialized || !window.google) {
      console.warn('Google Auth not initialized')
      return
    }

    try {
      window.google.accounts.id.renderButton(element, {
        ...GOOGLE_AUTH_CONFIG.BUTTON_CONFIG,
        locale: 'zh-TW'
      })
    } catch (err) {
      console.error('Failed to render sign-in button:', err)
      setError('無法載入登入按鈕')
    }
  }, [isInitialized])

  // 监听用户状态变化
  useEffect(() => {
    const unsubscribe = authSession.addListener((newUser) => {
      setUser(newUser)
      setIsLoading(false)
    })

    // 初始化时获取用户状态
    const currentUser = authSession.getUser()
    setUser(currentUser)
    setIsLoading(false)

    return unsubscribe
  }, [authSession])

  // 监听Google脚本加载
  useEffect(() => {
    const checkGoogleScript = () => {
      if (window.google) {
        initializeGoogleAuth()
      } else {
        // 如果Google脚本还没加载，等待一下再检查
        setTimeout(checkGoogleScript, 100)
      }
    }

    if (typeof window !== 'undefined') {
      checkGoogleScript()
    }
  }, [initializeGoogleAuth])

  return {
    user,
    isLoading,
    isSignedIn: !!user,
    error,
    signOut,
    renderSignInButton,
    clearError: () => setError(null)
  }
} 