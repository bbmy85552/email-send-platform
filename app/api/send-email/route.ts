import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fromName, senderEmail, recipient, subject, content, userEmail } = body

    // 验证必填字段
    if (!fromName || !senderEmail || !recipient || !subject || !content) {
      return NextResponse.json(
        { error: "所有字段都是必填項" },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipient)) {
      return NextResponse.json(
        { error: "收件人郵箱格式不正確" },
        { status: 400 }
      )
    }

    // 发送邮件
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${senderEmail}@novatime.top>`,
      to: [recipient],
      subject: subject,
      html: content,
      replyTo: userEmail // 使用用户的实际邮箱作为回复地址
    })

    if (error) {
      console.error("郵件發送錯誤:", error)
      return NextResponse.json(
        { error: "郵件發送失敗，請稍後再試" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "郵件發送成功",
      emailId: data?.id
    })

  } catch (error) {
    console.error("API錯誤:", error)
    return NextResponse.json(
      { error: "服務器錯誤" },
      { status: 500 }
    )
  }
}