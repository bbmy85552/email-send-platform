"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Palette, Moon, Sun, Laptop, Zap } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"

const themes = [
  { name: "light", label: "浅色", icon: Sun },
  { name: "dark", label: "深色", icon: Moon },
  { name: "zinc", label: "锌色", icon: Laptop },
  { name: "neutral", label: "中性", icon: Palette },
  { name: "stone", label: "石色", icon: Zap },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark', 'zinc', 'neutral', 'stone')
    
    if (theme === 'dark') {
      root.classList.add('dark')
    } else if (theme === 'light') {
      root.classList.add('light')
    } else if (['zinc', 'neutral', 'stone'].includes(theme || '')) {
      root.classList.add(theme || '')
    }
    
    if (theme && ['zinc', 'neutral', 'stone'].includes(theme)) {
      root.setAttribute('data-theme', theme)
    } else {
      root.removeAttribute('data-theme')
    }
  }, [theme])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Palette className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.name}
            onClick={() => setTheme(t.name)}
            className={`flex items-center gap-2 ${
              theme === t.name ? "bg-accent" : ""
            }`}
          >
            <t.icon className="h-4 w-4" />
            <span>{t.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}