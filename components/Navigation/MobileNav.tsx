'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BarChart3, Settings, Search } from "lucide-react"

export function MobileNav() {
  const pathname = usePathname()

  const links = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="flex items-center justify-around h-16">
        {links.map(link => {
          const Icon = link.icon
          const isActive = pathname === link.href
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                isActive 
                  ? 'text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
