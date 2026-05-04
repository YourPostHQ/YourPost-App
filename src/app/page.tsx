import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import LoginPage from '@/components/LoginPage'
import WebmailApp from '@/components/WebmailApp'

export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get('yourpost-token')?.value

  if (!token) {
    // Show login page
    return <LoginPage />
  }

  // Show webmail app when authenticated
  return <WebmailApp />
}
