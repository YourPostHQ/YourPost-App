'use client'

import { useState, useEffect } from 'react'
import { createUser, deactivateUser, updateUser } from '@/lib/api'
import { getToken, getUserDomain } from '@/lib/auth'

interface User {
  email: string
  active: boolean
  quota_bytes: number
  role: string
  domain: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [creating, setCreating] = useState(false)
  const domain = getUserDomain()

  useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/users`, {
        headers: { 'Authorization': `Bearer ${getToken()}` },
      })
      if (!res.ok) throw new Error('Failed to load users')
      const data = await res.json()
      setUsers(data.users || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeactivate(email: string) {
    if (!confirm(`Deactivate ${email}?`)) return
    try {
      await deactivateUser(email)
      await loadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate user')
    }
  }

  async function handleReactivate(email: string) {
    if (!confirm(`Reactivate ${email}?`)) return
    try {
      await updateUser(email, { active: true })
      await loadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reactivate user')
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setError('')
    try {
      await createUser(newEmail, newPassword)
      setNewEmail('')
      setNewPassword('')
      setShowCreateForm(false)
      await loadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Users</h1>
          {domain && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Domain: <span className="font-medium text-zinc-700 dark:text-zinc-300">{domain}</span>
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Create form */}
        {showCreateForm && (
          <div className="mb-6 p-6 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Add User</h2>
            <form onSubmit={handleCreateUser} className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-48">
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 focus:border-transparent"
                  placeholder={`user@${domain || 'yourdomain.com'}`}
                />
              </div>
              <div className="flex-1 min-w-48">
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
                >
                  {creating ? 'Adding…' : 'Add user'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 text-sm rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
                {loading ? 'Users' : `${users.length} ${users.length === 1 ? 'user' : 'users'}`}
              </h2>
            </div>
            {!showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-medium rounded-lg transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add user
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-zinc-200 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-400 dark:text-zinc-600">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <p className="text-sm">No users yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-700">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">User</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Quota</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.email} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-600 dark:text-zinc-300 flex-shrink-0">
                          {user.email[0].toUpperCase()}
                        </div>
                        <span className="text-sm text-zinc-900 dark:text-white">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400 tabular-nums">
                      {Math.round(user.quota_bytes / 1024 / 1024)} MB
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.active
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-green-500' : 'bg-zinc-400'}`} />
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.active ? (
                        <button
                          onClick={() => handleDeactivate(user.email)}
                          className="text-xs text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 transition-colors font-medium"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivate(user.email)}
                          className="text-xs text-zinc-400 hover:text-green-600 dark:text-zinc-500 dark:hover:text-green-400 transition-colors font-medium"
                        >
                          Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
