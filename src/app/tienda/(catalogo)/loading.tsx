import React from "react";

export default function TiendaLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0b0e",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "40vw",
          height: "40vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212, 164, 55, 0.05) 0%, rgba(0, 0, 0, 0) 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
          zIndex: 1,
        }}
      >
        {/* Pulsing logo/spinner element */}
        <div style={{ position: "relative", width: "80px", height: "80px" }}>
          {/* Outer rotating ring */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "2px solid rgba(212, 164, 55, 0.1)",
              borderTopColor: "#d4a437",
              borderRadius: "50%",
              animation: "spin 1.5s linear infinite",
            }}
          />
          {/* Inner pulsing core */}
          <div
            style={{
              position: "absolute",
              inset: "20px",
              backgroundColor: "rgba(212, 164, 55, 0.2)",
              borderRadius: "50%",
              animation: "pulse 2s ease-in-out infinite",
              boxShadow: "0 0 20px rgba(212, 164, 55, 0.4)",
            }}
          />
        </div>

        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              color: "#ffffff",
              fontSize: "1.5rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              margin: "0 0 0.5rem 0",
              fontFamily: "var(--font-heading)",
            }}
          >
            Preparando el Catálogo
          </h2>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "0.95rem",
              fontFamily: "var(--font-body)",
              maxWidth: "280px",
              lineHeight: 1.5,
              margin: 0,
            }}
          >
            Cargando inventario y configurando la experiencia acústica...
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
