"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Menu, Users, UserPlus, BarChart3, Settings } from "lucide-react"

/**
 * EDUCATIONAL NOTE: Responsive Navigation Component
 *
 * This component demonstrates:
 * 1. Mobile-first responsive design
 * 2. Progressive enhancement for larger screens
 * 3. Accessible navigation patterns
 * 4. State management for mobile menu
 */

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  studentCount: number
}

export function ResponsiveNavigation({ activeTab, onTabChange, studentCount }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    {
      id: "list",
      label: "Student List",
      icon: Users,
      badge: studentCount > 0 ? studentCount.toString() : undefined,
    },
    {
      id: "form",
      label: "Add Student",
      icon: UserPlus,
    },
    {
      id: "analytics",
      label: "Analytics & Demos",
      icon: BarChart3,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
    },
  ]

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId)
    setIsMobileMenuOpen(false) // Close mobile menu when item is selected
  }

  return (
    <>
      <nav className="hidden md:flex items-center space-x-2 bg-card/50 backdrop-blur-sm rounded-xl p-2 border border-primary/10 shadow-sm">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => handleTabChange(item.id)}
              className={`flex items-center space-x-2 transition-all duration-200 ${
                isActive ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-primary/10 hover:text-primary"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <Badge variant={isActive ? "secondary" : "outline"} className="ml-1 text-xs">
                  {item.badge}
                </Badge>
              )}
            </Button>
          )
        })}
      </nav>

      <div className="md:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-primary/20 hover:bg-primary/5 hover:border-primary/30 bg-transparent"
            >
              <Menu className="h-4 w-4 mr-2" />
              Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 bg-card/95 backdrop-blur-sm">
            <SheetHeader>
              <SheetTitle className="text-primary">Navigation</SheetTitle>
              <SheetDescription>Navigate through the student management system</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = activeTab === item.id

                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full justify-start transition-all duration-200 ${
                      isActive ? "bg-primary text-primary-foreground" : "hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    <span className="flex-1 text-left font-medium">{item.label}</span>
                    {item.badge && (
                      <Badge variant={isActive ? "secondary" : "outline"} className="ml-2 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                )
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
