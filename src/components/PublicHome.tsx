'use client'

import Link from 'next/link'
import { useTheme } from '@/components/ThemeProvider'

const logoFilledSvg = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.5" d="M2 11.25C2 8.35051 4.01472 6 6.5 6C8.98528 6 11 8.35051 11 11.25V20H4.23256C2.99955 20 2 18.8339 2 17.3953V11.25Z" fill="currentColor"/><path opacity="0.8" d="M11 11.25V20H14H19.7931C21.0119 20 22 18.8473 22 17.4253V11.25C22 8.35051 19.9853 6 17.5 6H6.5C8.98528 6 11 8.35051 11 11.25Z" fill="currentColor"/><path d="M9.5 20V22C9.5 22.4142 9.83579 22.75 10.25 22.75C10.6642 22.75 11 22.4142 11 22V20H9.5Z" fill="currentColor"/><path d="M15 20H13.5V22C13.5 22.4142 13.8358 22.75 14.25 22.75C14.6642 22.75 15 22.4142 15 22V20Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M4.25 16C4.25 15.5858 4.58579 15.25 5 15.25H8C8.41421 15.25 8.75 15.5858 8.75 16C8.75 16.4142 8.41421 16.75 8 16.75H5C4.58579 16.75 4.25 16.4142 4.25 16Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M17.3846 6.58471L17.6407 6.53344C18.0564 6.45022 18.4863 6.48995 18.8814 6.64813C19.5717 6.92453 20.3266 6.97616 21.0458 6.79618L21.1073 6.7808C21.6309 6.64975 22 6.16299 22 5.60336V3.47284C22 2.73503 21.3358 2.19145 20.6454 2.36421C20.249 2.46342 19.8329 2.43496 19.4523 2.28261L19.3793 2.25335C18.7422 1.99828 18.0491 1.93421 17.3787 2.06841L16.93 2.15824C16.3901 2.26632 16 2.75722 16 3.32846V10.2807C16 10.678 16.31 11 16.6923 11C17.0747 11 17.3846 10.678 17.3846 10.2807V6.58471Z" fill="currentColor"/></svg>'
const logoOutlinedSvg = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.5" d="M10.5 22V20M14.5 22V20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M11 20V20.75H11.75V20H11ZM14 19.25C13.5858 19.25 13.25 19.5858 13.25 20C13.25 20.4142 13.5858 20.75 14 20.75V19.25ZM17.5 5.25C17.0858 5.25 16.75 5.58579 16.75 6C16.75 6.41421 17.0858 6.75 17.5 6.75V5.25ZM7 5.25C6.58579 5.25 6.25 5.58579 6.25 6C6.25 6.41421 6.58579 6.75 7 6.75V5.25ZM9 19.25C8.58579 19.25 8.25 19.5858 8.25 20C8.25 20.4142 8.58579 20.75 9 20.75V19.25ZM15 20.75C15.4142 20.75 15.75 20.4142 15.75 20C15.75 19.5858 15.4142 19.25 15 19.25V20.75ZM10.25 11.25V20H11.75V11.25H10.25ZM11 19.25H4.23256V20.75H11V19.25ZM2.75 17.3953V11.25H1.25V17.3953H2.75ZM4.23256 19.25C3.51806 19.25 2.75 18.5323 2.75 17.3953H1.25C1.25 19.1354 2.48104 20.75 4.23256 20.75V19.25ZM6.5 6.75C8.46677 6.75 10.25 8.65209 10.25 11.25H11.75C11.75 8.04892 9.50379 5.25 6.5 5.25V6.75ZM6.5 5.25C3.49621 5.25 1.25 8.04892 1.25 11.25H2.75C2.75 8.65209 4.53323 6.75 6.5 6.75V5.25ZM21.25 11.25V17.4253H22.75V11.25H21.25ZM19.7931 19.25H14V20.75H19.7931V19.25ZM21.25 17.4253C21.25 18.5457 20.4934 19.25 19.7931 19.25V20.75C21.5305 20.75 22.75 19.1488 22.75 17.4253H21.25ZM22.75 11.25C22.75 8.04892 20.5038 5.25 17.5 5.25V6.75C19.4668 6.75 21.25 8.65209 21.25 11.25H22.75ZM7 6.75H18V5.25H7V6.75ZM9 20.75H15V19.25H9V20.75Z" fill="currentColor"/><path d="M5 16H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path opacity="0.5" d="M16 9.88432V5.41121M16 5.41121V2.63519C16 2.39905 16.1676 2.19612 16.3994 2.15144L16.8855 2.05779C17.4738 1.94443 18.0821 1.99855 18.6412 2.214L18.7203 2.24451C19.2746 2.4581 19.8807 2.498 20.4582 2.35891C20.7343 2.2924 21 2.50168 21 2.78573V5.00723C21 5.2442 20.8376 5.45031 20.6073 5.5058L20.5407 5.52184C19.9095 5.67387 19.247 5.63026 18.6412 5.39679C18.0821 5.18135 17.4738 5.12722 16.8855 5.24058L16 5.41121Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'

const features = [
  {
    title: 'Lightweight & Fast',
    body: 'Written in Zig with zero runtime overhead. Starts in milliseconds, uses a fraction of the RAM of traditional mail servers.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    title: 'Full Protocol Support',
    body: 'SMTP, POP3, IMAP, and a modern HTTP API out of the box. Drop-in compatible with every email client.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    title: 'Multi-domain & Multi-tenant',
    body: 'Register any domain, manage users per domain, and keep tenants fully isolated — all from one server.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    title: 'Cloudflare Ready',
    body: 'Built to run behind Cloudflare. Route inbound email through Workers and serve the webmail as static assets on the edge.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    title: 'Open Source',
    body: 'AGPLv3 licensed. Audit the code, self-host for free, or contribute on GitHub.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
      </svg>
    ),
  },
  {
    title: 'Managed SaaS',
    body: 'Don\'t want to self-host? Use YourPost as a managed service — same codebase, no ops burden.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
]

export default function PublicHome() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-900">

      {/* Nav */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="text-zinc-900 dark:text-white"
              dangerouslySetInnerHTML={{ __html: theme === 'light' ? logoOutlinedSvg : logoFilledSvg }}
            />
            <span className="font-bold text-lg text-zinc-900 dark:text-white">YourPost</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-medium rounded-lg transition-colors"
            >
              Get Started
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 sm:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Open source · AGPLv3
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6">
            Mail server,<br className="hidden sm:block" /> yours to own
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-10 max-w-xl mx-auto leading-relaxed">
            Lightweight, high-performance mail server written in Zig.
            Self-host for free or use the managed SaaS — same code, your choice.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="px-6 py-3 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-medium rounded-lg transition-colors text-sm"
            >
              Start free
            </Link>
            <a
              href="https://github.com/YourPostHQ/YourPost"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-zinc-900 dark:hover:border-zinc-400 hover:text-zinc-900 dark:hover:text-white font-medium rounded-lg transition-colors text-sm flex items-center gap-2"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
              View on GitHub
            </a>
            <Link
              href="/login"
              className="px-6 py-3 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-medium transition-colors text-sm"
            >
              Sign in →
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-widest text-zinc-400 dark:text-zinc-600 uppercase text-center mb-12">
            Everything a mail server should be
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-200 dark:bg-zinc-800 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
            {features.map(f => (
              <div key={f.title} className="bg-zinc-50 dark:bg-zinc-950 p-6">
                <div className="w-9 h-9 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-4 text-zinc-700 dark:text-zinc-300">
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1.5">{f.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-500">
            <span
              className="text-zinc-400 dark:text-zinc-600"
              dangerouslySetInnerHTML={{ __html: theme === 'light' ? logoOutlinedSvg : logoFilledSvg }}
            />
            <span>&copy; {new Date().getFullYear()} Devstroop</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a
              href="https://github.com/YourPostHQ/YourPost"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
              GitHub
            </a>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <span className="text-zinc-400 dark:text-zinc-600">MIT license</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
