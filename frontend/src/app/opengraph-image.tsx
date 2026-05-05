import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Troviio — Pas le meilleur. Le tien.";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #0E1020 0%, #161827 50%, #1A1C3A 100%)",
          color: "white",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glows */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: 100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255, 107, 95, 0.12)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            right: 50,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "rgba(66, 87, 255, 0.10)",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 200,
            right: 300,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(62, 214, 163, 0.08)",
            filter: "blur(50px)",
          }}
        />

        {/* Logo / Icon */}
        <div style={{ fontSize: 48, marginBottom: 20, opacity: 0.9 }}>✦</div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: -2,
            color: "#FFF7ED",
            marginBottom: 8,
          }}
        >
          Troviio
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            color: "#8B8FA3",
            marginBottom: 40,
          }}
        >
          Pas le meilleur. Le tien.
        </div>

        {/* Divider */}
        <div
          style={{
            width: 160,
            height: 2,
            background: "#FF6B5F",
            borderRadius: 2,
            marginBottom: 40,
          }}
        />

        {/* URL */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#FF6B5F",
          }}
        >
          troviio.com
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 400,
            color: "#8B8FA3",
            marginTop: 8,
          }}
        >
          L'IA qui trouve le produit parfait pour toi
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
