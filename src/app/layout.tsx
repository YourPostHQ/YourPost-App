import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'YourPost Webmail',
    template: '%s · YourPost Webmail',
  },
  description: 'Webmail interface for YourPost mail server - Access your email anywhere with a modern, responsive interface.',
  keywords: [
    'YourPost', 'webmail', 'email', 'mail server', 'Zig',
    'SMTP', 'POP3', 'IMAP', 'self-hosted email',
  ],
  authors: [{ name: 'Devstroop', url: 'https://devstroop.com' }],
  creator: 'Devstroop',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'YourPost Webmail',
    title: 'YourPost Webmail',
    description: 'Webmail interface for YourPost mail server - Access your email anywhere.',
  },
  twitter: {
    card: 'summary',
    title: 'YourPost Webmail',
    description: 'Webmail interface for YourPost mail server - Access your email anywhere.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/yourpost-outlined.svg" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/yourpost-filled.svg" media="(prefers-color-scheme: dark)" />
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}` }} />
      </head>
      <body className={`${inter.className} bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
