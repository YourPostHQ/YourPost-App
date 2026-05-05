'use client'

import { useState, useEffect } from 'react'
import { systemListUsers, systemListDomains, systemCreateUser, systemDeactivateUser, Domain } from '@/lib/api'

interface User {
  email: string
  role: string
  domain: string
  active: boolean
  quota_bytes: number
}

type Tab = 'users' | 'domains'

export default function SystemPage() {
  const [tab, setTab] = useState<Tab>('users')
  const [users, setUsers] = useState<User[]>([])
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState('user')
  const [creating, setCreating] = useState(false)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    setError('')
    try {
      const [u, d] = await Promise.all([systemListUsers(), systemListDomains()])
      setUsers(u)
      setDomains(d)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeactivate(email: string) {
    if (!confirm(`Deactivate ${email}?`)) return
    try {
      await systemDeactivateUser(email)
      await loadAll()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate user')
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    setError('')
    try {
      await systemCreateUser(newEmail, newPassword, newRole)
      setNewEmail('')
      setNewPassword('')
      setNewRole('user')
      setShowCreateForm(false)
      await loadAll()
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
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">System</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
          {users.length} users · {domains.length} domains
        </p>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-zinc-200 dark:border-zinc-700">
          {(['users', 'domains'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
                tab === t
                  ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white'
                  : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'users' && (
          <>
            {showCreateForm && (
              <div className="bg-white dark:bg-zinc-800 rounded-lg shadow mb-6 p-6">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">Create User</h2>
                <form onSubmit={handleCreateUser} className="flex flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-48">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white text-sm"
                      placeholder="user@domain.com"
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
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Role</label>
                    <select
                      value={newRole}
                      onChange={e => setNewRole(e.target.value)}
                      className="px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white text-sm"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                      <option value="system">system</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" disabled={creating}
                      className="px-4 py-2 bg-zinc-900 dark:bg-zinc-700 hover:bg-zinc-800 text-white text-sm rounded-md disabled:opacity-50">
                      {creating ? 'Creating...' : 'Create'}
                    </button>
                    <button type="button" onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 text-sm rounded-md">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow">
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  All Users <span className="text-sm font-normal text-zinc-500">({users.length})</span>
                </h2>
                <button onClick={() => setShowCreateForm(true)}
                  className="px-4 py-2 bg-zinc-900 dark:bg-zinc-700 hover:bg-zinc-800 text-white text-sm rounded-md">
                  + New User
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-700">
                      <th className="text-left p-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">Email</th>
                      <th className="text-left p-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">Domain</th>
                      <th className="text-left p-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">Role</th>
                      <th className="text-left p-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">Quota</th>
                      <th className="text-left p-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">Status</th>
                      <th className="text-right p-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.email} className="border-b border-zinc-100 dark:border-zinc-700 last:border-0">
                        <td className="p-4 text-sm text-zinc-900 dark:text-white">{user.email}</td>
                        <td className="p-4 text-sm text-zinc-500 dark:text-zinc-400">{user.domain}</td>
                        <td className="p-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.role === 'system'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                              : user.role === 'admin'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                              : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300'
                          }`}>
                            {user.role}
                          </span>
                        </td>
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
                          {user.active && user.role !== 'system' && (
                            <button
                              onClick={() => handleDeactivate(user.email)}
                              className="text-sm text-red-600 dark:text-red-400 hover:text-red-800"
                            >
                              Deactivate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {tab === 'domains' && (
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow">
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Domains <span className="text-sm font-normal text-zinc-500">({domains.length})</span>
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700">
                    <th className="text-left p-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">Domain</th>
                    <th className="text-left p-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">Users</th>
                    <th className="text-left p-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {domains.map(d => (
                    <tr key={d.domain} className="border-b border-zinc-100 dark:border-zinc-700 last:border-0">
                      <td className="p-4 text-sm font-medium text-zinc-900 dark:text-white">{d.domain}</td>
                      <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400">
                        {users.filter(u => u.domain === d.domain).length}
                      </td>
                      <td className="p-4 text-sm text-zinc-500 dark:text-zinc-400">
                        {new Date(d.created_at * 1000).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
