export default function ProductLoading() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-5 w-48 rounded" style={{ backgroundColor: "var(--bg-surface)" }} />
          <div className="h-10 w-3/4 rounded" style={{ backgroundColor: "var(--bg-surface)" }} />
          <div className="h-24 w-full rounded-3xl" style={{ backgroundColor: "var(--bg-surface)" }} />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-28 rounded-3xl" style={{ backgroundColor: "var(--bg-surface)" }} />
            <div className="h-28 rounded-3xl" style={{ backgroundColor: "var(--bg-surface)" }} />
            <div className="h-28 rounded-3xl" style={{ backgroundColor: "var(--bg-surface)" }} />
          </div>
        </div>
      </div>
    </main>
  );
}
