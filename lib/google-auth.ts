// Google Identity Services 配置和工具函数

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: GoogleIdConfig) => void
          renderButton: (element: HTMLElement, config: GoogleButtonConfig) => void
          prompt: () => void
          disableAutoSelect: () => void
        }
      }
    }
  }
}

interface GoogleIdConfig {
  client_id: string
  callback: (response: GoogleCredentialResponse) => void
  auto_select?: boolean
  cancel_on_tap_outside?: boolean
}

interface GoogleButtonConfig {
  theme?: 'outline' | 'filled_blue' | 'filled_black'
  size?: 'small' | 'medium' | 'large'
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
  shape?: 'rectangular' | 'pill' | 'circle' | 'square'
  logo_alignment?: 'left' | 'center'
  width?: number
  locale?: string
}

interface GoogleCredentialResponse {
  credential: string
  select_by?: string
}

interface GoogleUser {
  id: string
  email: string
  name: string
  picture: string
  given_name?: string
  family_name?: string
  locale?: string
  email_verified?: boolean
}

// 解析JWT token获取用户信息
export function parseJwt(token: string): GoogleUser {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    
    const payload = JSON.parse(jsonPayload)
    
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      given_name: payload.given_name,
      family_name: payload.family_name,
      locale: payload.locale,
      email_verified: payload.email_verified
    }
  } catch (error) {
    console.error('Error parsing JWT:', error)
    throw new Error('Invalid token')
  }
}

// 配置常量
export const GOOGLE_AUTH_CONFIG = {
  // 从环境变量或直接配置
  CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your_google_client_id_here',
  
  // 按钮配置
  BUTTON_CONFIG: {
    theme: 'outline' as const,
    size: 'large' as const,
    text: 'signin_with' as const,
    shape: 'rectangular' as const,
    logo_alignment: 'left' as const,
    width: 320
  },
  
  // 初始化配置
  INIT_CONFIG: {
    auto_select: false,
    cancel_on_tap_outside: true
  }
}

// 用户会话管理
export class GoogleAuthSession {
  private static instance: GoogleAuthSession
  private user: GoogleUser | null = null
  private listeners: Array<(user: GoogleUser | null) => void> = []

  static getInstance(): GoogleAuthSession {
    if (!GoogleAuthSession.instance) {
      GoogleAuthSession.instance = new GoogleAuthSession()
    }
    return GoogleAuthSession.instance
  }

  // 设置用户信息
  setUser(user: GoogleUser | null) {
    this.user = user
    
    // 保存到localStorage
    if (user) {
      localStorage.setItem('google_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('google_user')
    }
    
    // 通知监听器
    this.listeners.forEach(listener => listener(user))
  }

  // 获取当前用户
  getUser(): GoogleUser | null {
    if (!this.user && typeof window !== 'undefined') {
      const stored = localStorage.getItem('google_user')
      if (stored) {
        try {
          this.user = JSON.parse(stored)
        } catch (error) {
          console.error('Error parsing stored user:', error)
          localStorage.removeItem('google_user')
        }
      }
    }
    return this.user
  }

  // 添加监听器
  addListener(listener: (user: GoogleUser | null) => void) {
    this.listeners.push(listener)
    
    // 返回取消监听的函数
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  // 登出
  signOut() {
    this.setUser(null)
    // 禁用Google的自动选择
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.disableAutoSelect()
    }
  }

  // 检查是否已登录
  isSignedIn(): boolean {
    return this.getUser() !== null
  }
} 