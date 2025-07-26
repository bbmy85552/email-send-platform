import { NextRequest, NextResponse } from "next/server"
import { getEmailRecordsByUser, getUserByEmail } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // 从查询参数获取用户邮箱
    const searchParams = request.nextUrl.searchParams
    const userEmail = searchParams.get('email')
    
    if (!userEmail) {
      return NextResponse.json(
        { error: "用户未登录" },
        { status: 401 }
      )
    }

    // 获取用户信息
    const user = await getUserByEmail(userEmail)
    if (!user) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      )
    }

    // 获取用户的邮件记录
    const emails = await getEmailRecordsByUser(user.id)

    // 返回格式化的邮件数据
    const formattedEmails = emails.map(email => ({
      id: email.id,
      subject: email.subject,
      recipient: email.recipient,
      fromName: email.from_name,
      senderEmail: email.sender_email,
      content: email.content,
      status: email.status,
      sentAt: email.sent_at,
      createdAt: email.created_at,
      emailId: email.email_id
    }))

    return NextResponse.json({
      success: true,
      emails: formattedEmails,
      totalCount: emails.length
    })

  } catch (error) {
    console.error("获取邮件历史错误:", error)
    return NextResponse.json(
      { error: "獲取郵件歷史失敗" },
      { status: 500 }
    )
  }
}