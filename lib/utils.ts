import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 格式化用戶名顯示
 */
export function formatUserName(name?: string | null): string {
  if (!name) return "未知用戶"
  return name.length > 20 ? `${name.substring(0, 20)}...` : name
}

/**
 * 格式化日期時間
 */
export function formatDateTime(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit", 
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date)
}

/**
 * 檢查是否為有效的電子郵件
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 產生用戶頭像的 fallback 文字
 */
export function getAvatarFallback(name?: string | null): string {
  if (!name) return "U"
  return name
    .split(" ")
    .map(word => word.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2)
}
