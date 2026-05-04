const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'

export interface AuthResponse {
  token: string
  email: string
}

export interface Folder {
  id: number
  name: string
}

export interface Message {
  id: number
  from: string
  subject: string
  date: string
  folder_id: number
}

export interface MessageDetail extends Message {
  body: string
  to: string
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Login failed')
  }
  
  return res.json()
}

// Note: User creation requires admin privileges
// This should be called by domain admin, not public registration
export async function createUser(email: string, password: string, adminToken: string, role: string = 'user'): Promise<void> {
  const res = await fetch(`${API_BASE}/api/v1/users`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({ email, password, role }),
  })
  
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'User creation failed')
  }
}

// For public registration (if enabled), use a different endpoint
// Note: This is for domain owners to register their domain (first user becomes admin)
export async function register(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/v1/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role: 'admin' }),
  })
  
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Registration failed')
  }
  
  // After registration, login to get the token
  return login(email, password)
}

export async function getFolders(email: string): Promise<Folder[]> {
  const res = await fetch(`${API_BASE}/api/v1/mailboxes/${email}/folders`)
  
  if (!res.ok) throw new Error('Failed to fetch folders')
  const data = await res.json()
  return data.folders || []
}

export async function getMessages(email: string, folderName: string): Promise<Message[]> {
  const res = await fetch(`${API_BASE}/api/v1/mailboxes/${email}/messages?folder=${encodeURIComponent(folderName)}`)
  
  if (!res.ok) throw new Error('Failed to fetch messages')
  const data = await res.json()
  return data.messages || []
}

export async function getMessage(email: string, messageId: number): Promise<MessageDetail> {
  const res = await fetch(`${API_BASE}/api/v1/mailboxes/${email}/messages/${messageId}`)
  
  if (!res.ok) throw new Error('Failed to fetch message')
  return res.json()
}
