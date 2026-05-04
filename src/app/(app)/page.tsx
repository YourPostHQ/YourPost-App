import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function Home() {
  const cookieStore = await cookies()
  const token = cookieStore.get('yourpost-token')?.value

  if (!token) {
    redirect('/login')
  }

  // Redirect to inbox after login (like Gmail)
  redirect('/inbox')
}
