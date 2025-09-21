"use client"

import type React from "react"

import Link from "next/link"
import { cn } from "@/shared/utils/utils"
import { useSidebar } from "./sidebar-provider"
import { Button } from "@/presentation/components/ui/button"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/presentation/components/ui/tooltip"

// Hero Icons imports
import {
  MicrophoneIcon as MicIcon,
  Cog6ToothIcon as SettingsIcon,
  QuestionMarkCircleIcon as HelpCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline"

// Lista de rotas públicas onde o sidebar não deve aparecer
const publicRoutes = ["/login", "/signup", "/forgot-password"]

const Sidebar = () => {
  const { isCollapsed, toggleSidebar } = useSidebar()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  // We're keeping this list for reference but not using it to hide the sidebar
  const publicRoutes = ["/login", "/signup", "/forgot-password"]

  // Remove the conditional rendering that hides the sidebar on public routes
  return (
    <div
      className={cn(
        "bg-card border-r border-border h-screen flex flex-col transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-64",
      )}
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary rounded-full p-1 flex-shrink-0">
            <MicIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && <h1 className="text-xl font-bold tracking-tight">speech.ease</h1>}
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
          {isCollapsed ? <ChevronRightIcon className="h-4 w-4" /> : <ChevronLeftIcon className="h-4 w-4" />}
        </Button>
      </div>

      <div className="p-2 text-center text-muted-foreground text-sm">
        <p>Navigation moved to top bar</p>
      </div>

      <div className="p-2 border-t border-border space-y-1">
        <TooltipProvider>
          <NavItem
            href="/settings"
            icon={<SettingsIcon className="h-5 w-5" />}
            label="Settings"
            isCollapsed={isCollapsed}
            active={pathname === "/settings"}
          />
          <NavItem
            href="/help"
            icon={<HelpCircleIcon className="h-5 w-5" />}
            label="Help"
            isCollapsed={isCollapsed}
            active={pathname === "/help"}
          />
        </TooltipProvider>

        <div
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md transition-colors mt-2",
            isCollapsed ? "justify-center" : "justify-between",
          )}
        >
          {!isCollapsed && <span className="text-sm">Tema</span>}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="h-8 w-8"
                >
                  <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Alternar tema</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{theme === "light" ? "Modo escuro" : "Modo claro"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active?: boolean
  isCollapsed: boolean
}

const NavItem = ({ href, icon, label, active, isCollapsed }: NavItemProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              active ? "bg-primary/10 text-primary" : "hover:bg-secondary text-muted-foreground hover:text-foreground",
              isCollapsed && "justify-center px-2",
            )}
          >
            {icon}
            {!isCollapsed && <span>{label}</span>}
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right">
            <p>{label}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

export default Sidebar

