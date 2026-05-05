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

  const roleBadge = (role: string) => {
    const cls =
      role === 'system' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300' :
      role === 'admin'  ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' :
                          'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
    return <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${cls}`}>{role}</span>
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">System</h1>
          {!loading && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {users.length} {users.length === 1 ? 'user' : 'users'} &middot; {domains.length} {domains.length === 1 ? 'domain' : 'domains'}
            </p>
          )}
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-zinc-200 dark:border-zinc-700">
          {(['users', 'domains'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
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
            {/* Create form */}
            {showCreateForm && (
              <div className="mb-6 p-6 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-white mb-4">Create User</h2>
                <form onSubmit={handleCreateUser} className="flex flex-wrap gap-3 items-end">
                  <div className="flex-1 min-w-48">
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">Email</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={e => setNewEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400 focus:border-transparent"
                      placeholder="user@domain.com"
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
                  <div>
                    <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">Role</label>
                    <select
                      value={newRole}
                      onChange={e => setNewRole(e.target.value)}
                      className="px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-400"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                      <option value="system">system</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={creating}
                      className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
                    >
                      {creating ? 'Creating…' : 'Create'}
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

            {/* Users table */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {loading ? 'Users' : `${users.length} ${users.length === 1 ? 'user' : 'users'}`}
                </h2>
                {!showCreateForm && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-medium rounded-lg transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    New user
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-5 h-5 border-2 border-zinc-200 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin" />
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-zinc-100 dark:border-zinc-700">
                      <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">User</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Domain</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Role</th>
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
                        <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">{user.domain || '—'}</td>
                        <td className="px-6 py-4">{roleBadge(user.role)}</td>
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
                          {user.active && user.role !== 'system' && (
                            <button
                              onClick={() => handleDeactivate(user.email)}
                              className="text-xs text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 transition-colors font-medium"
                            >
                              Deactivate
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {tab === 'domains' && (
          <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-700">
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">
                {loading ? 'Domains' : `${domains.length} ${domains.length === 1 ? 'domain' : 'domains'}`}
              </h2>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-5 h-5 border-2 border-zinc-200 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin" />
              </div>
            ) : domains.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-400 dark:text-zinc-600">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <p className="text-sm">No domains registered</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-700">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Domain</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Users</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wide">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {domains.map(d => (
                    <tr key={d.domain} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-400 flex-shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="2" y1="12" x2="22" y2="12"/>
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-zinc-900 dark:text-white">{d.domain}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400 tabular-nums">
                        {users.filter(u => u.domain === d.domain).length}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                        {new Date(d.created_at * 1000).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
