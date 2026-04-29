export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '4rem', margin: 0, color: '#FF6B5F' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', margin: '0.5rem 0', color: '#FFF7ED' }}>Page non trouvée</h2>
      <p style={{ color: '#9CA3AF', maxWidth: 400 }}>
        Cette page n'existe pas ou a été déplacée.
      </p>
      <a
        href="/"
        style={{
          marginTop: '1.5rem',
          padding: '0.75rem 2rem',
          backgroundColor: '#FF6B5F',
          color: '#FFF',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        Retour à l'accueil
      </a>
    </div>
  );
}
