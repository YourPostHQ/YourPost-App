'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, roleBasedRedirect, getUserRole } from '@/lib/auth'
import PublicHome from '@/components/PublicHome'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated()) {
      // Index page redirect - uses stored role (from cookie or JWT)
      router.replace(roleBasedRedirect())
    }
  }, [router])

  return <PublicHome />
}
