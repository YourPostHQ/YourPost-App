'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from '@/components/ThemeProvider'

export default function ForgotPassword() {
  const { theme } = useTheme()
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-800 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image
              src={theme === 'light' ? '/yourpost-outlined.svg' : '/yourpost-filled.svg'}
              alt="YourPost Logo"
              width={32}
              height={32}
            />
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">YourPost</h1>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">Reset your password</p>
        </div>
        
        <div className="text-center space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Forgot password functionality is not yet implemented.
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Please contact your administrator or try logging in again.
          </p>
          <Link
            href="/login"
            className="inline-block mt-4 px-6 py-2 bg-zinc-900 dark:bg-zinc-700 hover:bg-zinc-800 dark:hover:bg-zinc-600 text-white font-medium rounded-md transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
