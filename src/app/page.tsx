'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, roleBasedRedirect } from '@/lib/auth'
import PublicHome from '@/components/PublicHome'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace(roleBasedRedirect())
    }
  }, [router])

  return <PublicHome />
}
