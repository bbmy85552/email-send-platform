import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to format user name
export function formatUserName(name?: string): string {
  if (!name) return "用户"
  
  // If name contains spaces, format as first initial + last name
  if (name.includes(" ")) {
    const nameParts = name.split(" ")
    return `${nameParts[0][0]}. ${nameParts.slice(1).join(" ")}`
  }
  
  return name
}

// Helper function to get avatar fallback text
export function getAvatarFallback(name?: string): string {
  if (!name) return "U"
  
  // If name contains spaces, use first initials
  if (name.includes(" ")) {
    const initials = name.split(" ")
      .filter(part => part.length > 0)
      .map(part => part[0].toUpperCase())
      .slice(0, 2)
      .join("")
      
    return initials
  }
  
  // Otherwise use first two characters
  return name.slice(0, 2).toUpperCase()
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
