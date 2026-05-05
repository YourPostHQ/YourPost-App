'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="h-screen flex items-center justify-center bg-zinc-900">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-white mb-2">
          Something went wrong!
        </h2>
        <p className="text-sm text-zinc-400 mb-4">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-white text-zinc-900 text-sm font-medium rounded-lg hover:bg-zinc-100 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
