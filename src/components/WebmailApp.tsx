'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getFolders, getMessages, getMessage, sendMessage, deleteMessage, Folder, Message, MessageDetail } from '@/lib/api'
import { getEmail, clearAuthCookies } from '@/lib/auth'

const DEFAULT_FOLDERS: Folder[] = [
  { id: -1, name: 'Inbox' },
  { id: -2, name: 'Sent' },
  { id: -3, name: 'Drafts' },
  { id: -4, name: 'Trash' },
]

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return d.toLocaleDateString([], { weekday: 'short' })
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function senderName(from: string): string {
  const name = from.split('<')[0].trim()
  return name || from
}

function senderInitial(from: string): string {
  return (senderName(from)[0] || '?').toUpperCase()
}

function FolderIcon({ name }: { name: string }) {
  const n = name.toLowerCase()
  if (n === 'inbox') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
    </svg>
  )
  if (n === 'sent') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  )
  if (n === 'drafts' || n === 'draft') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  )
  if (n === 'trash' || n === 'deleted') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  )
  if (n === 'spam' || n === 'junk') return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
    </svg>
  )
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
  )
}

export default function WebmailApp() {
  const [folders, setFolders] = useState<Folder[]>([])
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<MessageDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [composing, setComposing] = useState(false)
  const [composeTo, setComposeTo] = useState('')
  const [composeSubject, setComposeSubject] = useState('')
  const [composeBody, setComposeBody] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const userEmail = getEmail()
    if (!userEmail) { router.push('/login'); return }
    setEmail(userEmail)
    loadFolders(userEmail)
  }, [])

  async function loadFolders(userEmail: string) {
    try {
      const data = await getFolders(userEmail)
      const resolved = data.length > 0 ? data : DEFAULT_FOLDERS
      setFolders(resolved)
      setSelectedFolder(resolved[0])
    } catch {
      setFolders(DEFAULT_FOLDERS)
      setSelectedFolder(DEFAULT_FOLDERS[0])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedFolder && email) loadMessages(selectedFolder.name)
  }, [selectedFolder, email])

  async function loadMessages(folderName: string) {
    if (!email) return
    try {
      const data = await getMessages(email, folderName)
      setMessages(data)
      setSelectedMessage(null)
    } catch { /* noop */ }
  }

  async function handleSelectMessage(messageId: number) {
    try {
      const data = await getMessage(email, messageId)
      setSelectedMessage(data)
    } catch { /* noop */ }
  }

  async function handleDelete(messageId: number) {
    try {
      await deleteMessage(email, messageId)
      setSelectedMessage(null)
      if (selectedFolder) loadMessages(selectedFolder.name)
    } catch { /* noop */ }
  }

  async function handleSend() {
    if (!composeTo || !email) return
    setSending(true)
    setSendError('')
    try {
      await sendMessage(email, composeTo, composeSubject, composeBody)
      setComposing(false)
      setComposeTo('')
      setComposeSubject('')
      setComposeBody('')
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Send failed')
    } finally {
      setSending(false)
    }
  }

  function handleLogout() {
    clearAuthCookies()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="w-5 h-5 border-2 border-zinc-200 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 flex overflow-hidden">

      {/* Sidebar */}
      <aside className="w-52 flex-shrink-0 flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
        <div className="p-3 flex-shrink-0">
          <button
            onClick={() => setComposing(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Compose
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          {folders.length === 0 ? (
            <p className="text-xs text-zinc-400 dark:text-zinc-600 px-3 py-2">No folders</p>
          ) : (
            folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => setSelectedFolder(folder)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors mb-0.5 ${
                  selectedFolder?.id === folder.id
                    ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <span className="opacity-60"><FolderIcon name={folder.name} /></span>
                {folder.name}
              </button>
            ))
          )}
        </nav>
      </aside>

      {/* Message list */}
      <div className="w-80 flex-shrink-0 flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between flex-shrink-0">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
            {selectedFolder?.name || 'Messages'}
          </h2>
          <button
            onClick={() => selectedFolder && loadMessages(selectedFolder.name)}
            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded transition-colors"
            title="Refresh"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-zinc-300 dark:text-zinc-700">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
                <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
              </svg>
              <p className="text-sm mt-3 text-zinc-400 dark:text-zinc-600">No messages</p>
            </div>
          ) : (
            messages.map(message => (
              <button
                key={message.id}
                onClick={() => handleSelectMessage(message.id)}
                className={`w-full text-left px-4 py-3.5 border-b border-zinc-100 dark:border-zinc-800/80 transition-colors ${
                  selectedMessage?.id === message.id
                    ? 'bg-zinc-100 dark:bg-zinc-800'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-zinc-600 dark:text-zinc-300 mt-0.5">
                    {senderInitial(message.from)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className={`text-sm truncate ${!message.seen ? 'font-semibold text-zinc-900 dark:text-white' : 'text-zinc-700 dark:text-zinc-300'}`}>
                        {senderName(message.from)}
                      </span>
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-600 flex-shrink-0 tabular-nums">
                        {formatDate(message.date)}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${!message.seen ? 'font-medium text-zinc-800 dark:text-zinc-200' : 'text-zinc-500 dark:text-zinc-500'}`}>
                      {message.subject || '(no subject)'}
                    </p>
                  </div>
                  {!message.seen && (
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 flex-shrink-0 mt-2" />
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Message detail */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-zinc-950">
        {selectedMessage ? (
          <div className="max-w-2xl mx-auto px-8 py-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <h1 className="text-xl font-semibold text-zinc-900 dark:text-white leading-snug">
                {selectedMessage.subject || '(no subject)'}
              </h1>
              <button
                onClick={() => handleDelete(selectedMessage.id)}
                className="flex-shrink-0 p-2 rounded-md text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Delete message"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-zinc-100 dark:border-zinc-800">
              <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-sm font-semibold text-zinc-600 dark:text-zinc-300 flex-shrink-0">
                {senderInitial(selectedMessage.from)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{selectedMessage.from}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  To {selectedMessage.to} · {new Date(selectedMessage.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
            </div>
            <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap font-[inherit]">
              {selectedMessage.body}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-300 dark:text-zinc-700">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <p className="text-sm mt-4 text-zinc-400 dark:text-zinc-600">Select a message to read</p>
          </div>
        )}
      </div>

      {/* Compose modal */}
      {composing && (
        <div
          className="fixed inset-0 z-50 bg-black/20 dark:bg-black/50 flex items-end sm:items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) setComposing(false) }}
        >
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">New Message</h3>
              <button
                onClick={() => setComposing(false)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="p-4 space-y-2.5">
              {sendError && (
                <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-md">{sendError}</p>
              )}
              <input
                type="email"
                placeholder="To"
                value={composeTo}
                onChange={e => setComposeTo(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 transition-shadow"
              />
              <input
                type="text"
                placeholder="Subject"
                value={composeSubject}
                onChange={e => setComposeSubject(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 transition-shadow"
              />
              <textarea
                placeholder="Write your message…"
                value={composeBody}
                onChange={e => setComposeBody(e.target.value)}
                rows={9}
                className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 transition-shadow resize-none"
              />
            </div>
            <div className="px-4 pb-4 flex items-center justify-between">
              <button
                onClick={() => { setComposing(false); setComposeTo(''); setComposeSubject(''); setComposeBody('') }}
                className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleSend}
                disabled={sending || !composeTo.trim()}
                className="flex items-center gap-2 px-5 py-2 text-sm bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-40"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                {sending ? 'Sending…' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
