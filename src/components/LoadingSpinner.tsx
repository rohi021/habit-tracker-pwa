export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950" role="status" aria-label="Loading">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Loading StudentOS...</p>
      </div>
    </div>
  );
}
