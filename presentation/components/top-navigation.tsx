"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/shared/utils/utils"
import { Button } from "@/presentation/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/presentation/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/presentation/components/ui/sheet"

// Hero Icons imports
import {
  HomeIcon,
  BookOpenIcon,
  UserIcon,
  Cog6ToothIcon as SettingsIcon,
  QuestionMarkCircleIcon as HelpCircleIcon,
  ChevronDownIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  TrophyIcon as AwardIcon,
  LightBulbIcon as LightbulbIcon,
  ChartBarIcon as BarChartIcon,
  ArrowRightOnRectangleIcon as LogOutIcon,
  Bars3Icon as MenuIcon,
  MicrophoneIcon as MicIcon,
} from "@heroicons/react/24/outline"
import { Tag } from "./ui/tag"
import { Home, LayoutDashboard } from "lucide-react"

// Custom Chat Icon Component
const ChatIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" strokeDasharray="60" strokeDashoffset="15" />
    <path d="M8 12h8" />
    <path d="M8 8h4" />
    <path d="M8 16h2" />
  </svg>
)

const TopNavigation = () => {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  // Hide the menu if the path contains "/login"
  const shouldHideMenu = ["/signup", "/login"].includes(pathname);
  if (shouldHideMenu) {
    return null;
  }
  // // Check if we're on a mobile device
  // useEffect(() => {
  //   const checkIfMobile = () => {
  //     setIsMobile(window.innerWidth < 768)
  //   }

  //   // Initial check
  //   checkIfMobile()

  //   // Add event listener
  //   window.addEventListener("resize", checkIfMobile)

  //   // Cleanup
  //   return () => window.removeEventListener("resize", checkIfMobile)
  // }, [setIsMobile, isMobile])

  // Navigation categories
  const navCategories = [
    {
      name: "Home",
      icon: <Home className="h-5 w-5" />,
      items: [
        { href: "/", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
      ],
    },
    {
      name: "Practice",
      icon: <MicIcon className="h-5 w-5" />,
      items: [
        // { href: "/chat/select", label: "Chat with GUGA", icon: <ChatIcon className="h-4 w-4" /> },
        { href: "/read-aloud/cards", label: "Read Aloud", icon: <MicIcon className="h-4 w-4" /> },
        // { href: "/lessons", label: "Lessons", icon: <BookOpenIcon className="h-4 w-4" /> },
      ],
    },
    // {
    //   name: "Progress",
    //   icon: <TrendingUpIcon className="h-5 w-5" />,
    //   items: [
    //     { href: "/progress-map", label: "Progress Map", icon: <BarChartIcon className="h-4 w-4" /> },
    //     { href: "/achievements", label: "Achievements", icon: <AwardIcon className="h-4 w-4" /> },
    //     { href: "/insights", label: "Learning Insights", icon: <LightbulbIcon className="h-4 w-4" /> },
    //   ],
    // },
    // {
    //   name: "Resources",
    //   icon: <BookOpenIcon className="h-5 w-5" />,
    //   items: [
    //     { href: "/resources/grammar", label: "Grammar Guide", icon: <BookOpenIcon className="h-4 w-4" /> },
    //     { href: "/resources/vocabulary", label: "Vocabulary Lists", icon: <BookOpenIcon className="h-4 w-4" /> },
    //     { href: "/resources/pronunciation", label: "Pronunciation Tips", icon: <MicIcon className="h-4 w-4" /> },
    //   ],
    // },
  ]

  // Mobile navigation items for bottom bar
  const mobileNavItems = [
    { href: "/", label: "Home", icon: <HomeIcon className="h-5 w-5" /> },
    { href: "/chat/select", label: "Chat", icon: <ChatIcon className="h-5 w-5" /> },
    { href: "/read-aloud/cards", label: "Practice", icon: <MicIcon className="h-5 w-5" /> },
    { href: "/progress-map", label: "Progress", icon: <TrendingUpIcon className="h-5 w-5" /> },
  ]

  return (
    <>
      <div className="sticky top-0 z-10 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 md:h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center justify-center gap-4 md:gap-8">
            <Link href="/" className="flex items-center">
              <h1 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              <span className="font-light">speech</span>
              <span className="text-2xl">.</span>
              <span>ease</span>
              </h1>
            </Link>
            <Tag>DEMO</Tag>
            </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="flex items-center space-x-1">
              {navCategories.map((category) => (
                <DropdownMenu key={category.name}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        category.items.some((item) => pathname === item.href)
                          ? "bg-blue-100 text-blue-600"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      )}
                    >
                      {category.icon}
                      <span className="mx-1">{category.name}</span>
                      <ChevronDownIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-56">
                    <DropdownMenuLabel>{category.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {category.items.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex w-full cursor-pointer items-center rounded-md px-2 py-2",
                            pathname === item.href && "bg-blue-100 text-blue-600",
                          )}
                        >
                          {item.icon}
                          <span className="ml-2">{item.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </nav>
          )}

          {/* User Menu and Mobile Menu Button */}
          <div className="flex items-center gap-2">
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-blue-100 text-blue-600">ME</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                {/* <DropdownMenuSeparator /> */}
                {/* <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex w-full cursor-pointer items-center">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex w-full cursor-pointer items-center">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/help" className="flex w-full cursor-pointer items-center">
                    <HelpCircleIcon className="mr-2 h-4 w-4" />
                    <span>Help</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator /> */}
                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <MenuIcon className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[80%] sm:w-[350px] pt-10">
                  <div className="flex flex-col gap-6">
                    {navCategories.map((category) => (
                      <div key={category.name} className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2 text-blue-600">
                          {category.icon}
                          {category.name}
                        </h3>
                        <div className="space-y-1 pl-6">
                          {category.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={cn(
                                "flex items-center gap-2 py-2 px-3 rounded-md text-sm transition-colors",
                                pathname === item.href
                                  ? "bg-blue-100 text-blue-600"
                                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                              )}
                            >
                              {item.icon}
                              <span>{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-10 bg-background border-t border-border">
          <div className="flex justify-around items-center h-16">
            {mobileNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full py-1",
                  pathname === item.href ? "text-blue-600" : "text-muted-foreground",
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full",
                    pathname === item.href ? "bg-blue-100" : "",
                  )}
                >
                  {item.icon}
                </div>
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Add padding to the bottom of the page when mobile bottom nav is present */}
      {isMobile && <div className="h-16" />}
    </>
  )
}

export default TopNavigation

