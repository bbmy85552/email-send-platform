import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 使用 Google Identity Services 的简化中间件
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 保护 dashboard 路由
  if (pathname.startsWith('/dashboard')) {
    // 对于客户端认证，我们不能在middleware中检查localStorage
    // 所以让页面自己处理重定向逻辑
    // 这里只是记录访问日志
    console.log('Accessing protected route:', pathname)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // 不匹配静态文件和API路由
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 