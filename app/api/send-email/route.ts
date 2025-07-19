import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import crypto from 'crypto';
import { createOrUpdateUser, createEmailRecord, updateEmailStatus, getUserByEmail, getDailyEmailCount } from "@/lib/db"

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

    // 验证用户邮箱
    if (!userEmail) {
      return NextResponse.json(
        { error: "用戶未登錄" },
        { status: 401 }
      )
    }

    // 获取或创建用户信息
    let user = await getUserByEmail(userEmail);
    if (!user) {
      // 创建新用户
      user = await createOrUpdateUser({
        id: crypto.randomUUID(),
        email: userEmail,
        name: userEmail.split('@')[0], // 默认使用邮箱前缀作为用户名
        picture: null
      });
    }

    // 检查每日发邮件次数限制
    const dailyLimit = parseInt(process.env.DAILY_EMAIL_LIMIT || '10');
    const todayCount = await getDailyEmailCount(user.id);
    
    console.log(`用户 ${user.email} 今日已发送邮件: ${todayCount}/${dailyLimit}`);
    
    if (todayCount >= dailyLimit) {
      console.log(`用户 ${user.email} 已达到每日发邮件上限: ${dailyLimit}次`);
      return NextResponse.json(
        { error: `今日发邮件次数已达上限 (${dailyLimit}次)，请明天再试` },
        { status: 429 }
      );
    }

    // 创建邮件记录
    const emailRecord = await createEmailRecord({
      user_id: user.id,
      from_name: fromName,
      sender_email: `${senderEmail}@novatime.top`,
      recipient: recipient,
      subject: subject,
      content: content,
      email_id: null,
      status: 'pending',
      sent_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    });

    // 发送邮件
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${senderEmail}@novatime.top>`,
      to: [recipient],
      subject: subject,
      html: content,
      replyTo: userEmail
    })

    if (error) {
      console.error("郵件發送錯誤:", error)
      // 更新邮件状态为失败
      await updateEmailStatus(emailRecord.id, 'failed');
      return NextResponse.json(
        { error: "郵件發送失敗，請稍後再試" },
        { status: 500 }
      )
    }

    // 更新邮件状态为成功
    await updateEmailStatus(emailRecord.id, 'sent', data?.id);

    console.log(`用户 ${user.email} 成功发送第 ${todayCount + 1} 封邮件`);

    return NextResponse.json({
      success: true,
      message: "郵件發送成功",
      emailId: data?.id,
      recordId: emailRecord.id,
      dailyCount: todayCount + 1,
      dailyLimit: dailyLimit
    })

  } catch (error) {
    console.error("API錯誤:", error)
    return NextResponse.json(
      { error: "服務器錯誤" },
      { status: 500 }
    )
  }
}