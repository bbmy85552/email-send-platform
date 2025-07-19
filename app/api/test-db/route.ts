import { NextResponse } from "next/server"
import { initDb } from "@/lib/db"

export async function GET() {
  try {
    console.log('正在测试数据库连接...')
    await initDb()
    
    return NextResponse.json({
      success: true,
      message: "数据库连接成功"
    })
  } catch (error) {
    console.error("数据库连接失败:", error)
    return NextResponse.json({
      success: false,
      message: "数据库连接失败",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}