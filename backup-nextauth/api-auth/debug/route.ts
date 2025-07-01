import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // 只在开发环境中提供诊断信息
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  const diagnostics = {
    environment: process.env.NODE_ENV,
    variables: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '✅ 已设置' : '❌ 未设置',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? '✅ 已设置' : '❌ 未设置',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ 已设置' : '❌ 未设置',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || '❌ 未设置（将使用默认值）',
    },
    urls: {
      current: req.url,
      expected_callback: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/callback/google`,
    },
    instructions: [
      '1. 创建 .env.local 文件在项目根目录',
      '2. 添加所需的环境变量',
      '3. 确保 Google Console 中的重定向 URI 正确',
      '4. 重启开发服务器'
    ]
  }

  return NextResponse.json(diagnostics, { status: 200 })
} 