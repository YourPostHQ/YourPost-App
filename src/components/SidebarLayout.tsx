'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useTheme } from './ThemeProvider'
import { isAuthenticated, roleBasedRedirect } from '@/lib/auth'

export interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  disabled?: boolean
}

export interface SidebarLayoutProps {
  children: React.ReactNode
  navItems: NavItem[]
  brandLabel: string
  brandBadge: string
  brandColor: string // e.g., 'zinc-900' or 'red-950'
  badgeColor: string // e.g., 'purple-600' or 'red-700'
  textColor: string // e.g., 'text-white' or 'text-red-300'
  hoverColor: string // e.g., 'hover:text-zinc-200' or 'hover:text-red-100'
  activeBg: string // e.g., 'bg-zinc-800' or 'bg-red-900'
  inactiveHoverBg: string // e.g., 'hover:bg-zinc-800/60' or 'hover:bg-red-900/60'
  borderColor: string // e.g., 'border-zinc-800' or 'border-red-900'
  backLink: string
  backLabel: string
  authCheck: () => boolean
  redirectTo?: string
}

export function SidebarLayout({
  children,
  navItems,
  brandLabel,
  brandBadge,
  brandColor,
  badgeColor,
  textColor,
  hoverColor,
  activeBg,
  inactiveHoverBg,
  borderColor,
  backLink,
  backLabel,
  authCheck,
  redirectTo = '/login',
}: SidebarLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace(redirectTo)
      return
    }
    if (!authCheck()) {
      router.replace(roleBasedRedirect())
    }
  }, [router])

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-900">
      {/* Sidebar */}
      <aside className={`w-56 flex-shrink-0 flex flex-col h-screen bg-${brandColor} border-r ${borderColor}`}>

        {/* Brand */}
        <div className={`px-4 pt-5 pb-4 border-b ${borderColor} flex-shrink-0`}>
          <Link href={navItems[0]?.href || '/'} className={`flex items-center gap-2 ${textColor} mb-3`}>
            <span dangerouslySetInnerHTML={{ __html: logoSvg }} />
            <span className="font-bold text-[15px]">{brandLabel}</span>
          </Link>
          <span className={`px-2 py-0.5 text-[11px] font-semibold ${badgeColor} text-white rounded`}>
            {brandBadge}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {navItems.map(item => {
            const active = !item.disabled && pathname === item.href
            return item.disabled ? (
              <div
                key={item.label}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm cursor-default select-none ${
                  brandColor.includes('red') ? 'text-red-900' : 'text-zinc-600'
                }`}
              >
                <span className="opacity-40">{item.icon}</span>
                <span className="opacity-40">{item.label}</span>
                <span className={`ml-auto text-[10px] ${brandColor.includes('red') ? 'text-red-800' : 'text-zinc-600'} opacity-60`}>
                  soon
                </span>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? `${activeBg} ${textColor} font-medium`
                    : `${brandColor.includes('red') ? 'text-red-300' : 'text-zinc-400'} ${inactiveHoverBg} ${brandColor.includes('red') ? 'hover:text-red-100' : 'hover:text-zinc-200'}`
                }`}
              >
                <span className={active ? 'opacity-80' : 'opacity-50'}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className={`flex-shrink-0 border-t ${borderColor} p-3 flex items-center justify-between`}>
          <Link
            href={backLink}
            className={`flex items-center gap-1.5 text-xs ${brandColor.includes('red') ? 'text-red-400 hover:text-red-100' : 'text-zinc-500 hover:text-zinc-200'} transition-colors`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {backLabel}
          </Link>
          <button
            onClick={toggleTheme}
            className={`p-1.5 rounded ${brandColor.includes('red') ? 'text-red-400 hover:text-red-100' : 'text-zinc-500 hover:text-zinc-200'} transition-colors`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </div>
    </div>
  )
}

const logoSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.5" d="M2 11.25C2 8.35051 4.01472 6 6.5 6C8.98528 6 11 8.35051 11 11.25V20H4.23256C2.99955 20 2 18.8339 2 17.3953V11.25Z" fill="currentColor"/><path opacity="0.8" d="M11 11.25V20H14H19.7931C21.0119 20 22 18.8473 22 17.4253V11.25C22 8.35051 19.9853 6 17.5 6H6.5C8.98528 6 11 8.35051 11 11.25Z" fill="currentColor"/><path d="M9.5 20V22C9.5 22.4142 9.83579 22.75 10.25 22.75C10.6642 22.75 11 22.4142 11 22V20H9.5Z" fill="currentColor"/><path d="M15 20H13.5V22C13.5 22.4142 13.8358 22.75 14.25 22.75C14.6642 22.75 15 22.4142 15 22V20Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M4.25 16C4.25 15.5858 4.58579 15.25 5 15.25H8C8.41421 15.25 8.75 15.5858 8.75 16C8.75 16.4142 8.41421 16.75 8 16.75H5C4.58579 16.75 4.25 16.4142 4.25 16Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M17.3846 6.58471L17.6407 6.53344C18.0564 6.45022 18.4863 6.48995 18.8814 6.64813C19.5717 6.92453 20.3266 6.97616 21.0458 6.79618L21.1073 6.7808C21.6309 6.64975 22 6.16299 22 5.60336V3.47284C22 2.73503 21.3358 2.19145 20.6454 2.36421C20.249 2.46342 19.8329 2.43496 19.4523 2.28261L19.3793 2.25335C18.7422 1.99828 18.0491 1.93421 17.3787 2.06841L16.93 2.15824C16.3901 2.26632 16 2.75722 16 3.32846V10.2807C16 10.678 16.31 11 16.6923 11C17.0747 11 17.3846 10.678 17.3846 10.2807V6.58471Z" fill="currentColor"/></svg>'
