export default function CategoryLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg)" }}>
      <div className="text-center space-y-4">
        <div
          className="w-12 h-12 rounded-full border-4 mx-auto animate-spin"
          style={{ borderColor: "var(--border)", borderTopColor: "var(--coral)" }}
        />
        <p className="text-sm" style={{ color: "#8B8B9A" }}>Chargement...</p>
      </div>
    </div>
  );
}
