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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Users</h1>
          {domain && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Domain: <span className="font-medium text-zinc-700 dark:text-zinc-300">{domain}</span>
            </p>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md mb-6">
            {error}
          </div>
        )}

        {showCreateForm && (
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow mb-6 p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Add User</h2>
            <form onSubmit={handleCreateUser} className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-48">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white text-sm"
                  placeholder={`user@${domain || 'yourdomain.com'}`}
                />
              </div>
              <div className="flex-1 min-w-48">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white text-sm"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-zinc-900 dark:bg-zinc-700 hover:bg-zinc-800 dark:hover:bg-zinc-600 text-white text-sm rounded-md disabled:opacity-50"
                >
                  {creating ? 'Adding...' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 text-sm rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              Users <span className="text-sm font-normal text-zinc-500">({users.length})</span>
            </h2>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-zinc-900 dark:bg-zinc-700 hover:bg-zinc-800 dark:hover:bg-zinc-600 text-white text-sm rounded-md"
            >
              + Add User
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="text-left p-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">Email</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">Quota</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.email} className="border-b border-zinc-100 dark:border-zinc-700 last:border-0">
                    <td className="p-4 text-sm text-zinc-900 dark:text-white">{user.email}</td>
                    <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {Math.round(user.quota_bytes / 1024 / 1024)} MB
                    </td>
                    <td className="p-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.active
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {user.active ? (
                        <button
                          onClick={() => handleDeactivate(user.email)}
                          className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReactivate(user.email)}
                          className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                        >
                          Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
