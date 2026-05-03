export default function LogoTroviio({ size = 38 }: { size?: number }) {
  const wordmarkStyle = {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700,
    fontSize: "26px",
    letterSpacing: "-1px",
    color: "var(--text, #FAFAFA)",
  };
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ filter: "drop-shadow(0 6px 12px rgba(255,107,95,0.25))" }}>
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B5F"/>
            <stop offset="100%" stopColor="#3ED6A3"/>
          </linearGradient>
        </defs>
        <path d="M 28 85 V 38 L 50 18 L 72 38 V 48 C 72 60, 62 68, 50 68 H 28"
              fill="none"
              stroke="url(#logo-grad)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"/>
        <path d="M 50 43 C 50 49, 46 53, 40 53 C 46 53, 50 57, 50 63 C 50 57, 54 53, 60 53 C 54 53, 50 49, 50 43 Z"
              fill="#4257FF"/>
      </svg>
      <span style={wordmarkStyle}>
        TROV<span style={{ color: "#FF6B5F" }}>i</span><span style={{ color: "#3ED6A3" }}>i</span>O
      </span>
    </div>
  );
}
