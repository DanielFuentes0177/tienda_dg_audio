"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Credenciales inválidas. Inténtalo de nuevo.");
      } else {
        const params = new URLSearchParams(window.location.search);
        const callbackUrl = params.get("callbackUrl") || "/admin";
        window.location.href = callbackUrl;
      }
    } catch (err) {
      setError("Ocurrió un error al intentar iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.875rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontFamily: "var(--font-body)",
    marginBottom: "1.5rem",
    fontSize: "1rem"
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-secondary)" }}>
      <div style={{ maxWidth: "400px", width: "100%", padding: "2.5rem", backgroundColor: "var(--bg-primary)", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
        
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", color: "var(--text-main)", marginBottom: "0.5rem" }}>
            DG <span style={{ color: "var(--color-accent)" }}>ADMIN</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Ingresa tus credenciales para acceder</p>
        </div>

        {error && (
          <div style={{ padding: "0.75rem", backgroundColor: "#ffebee", color: "#c62828", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.875rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, color: "var(--text-main)" }}>Correo Electrónico</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="admin@dgaudio.com"
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, color: "var(--text-main)" }}>Contraseña</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" disabled={isLoading} style={{ width: "100%", padding: "1rem", fontSize: "1rem" }}>
            {isLoading ? "Iniciando sesión..." : "Ingresar al Panel"}
          </Button>
        </form>

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <Link href="/tienda" style={{ color: "var(--text-muted)", fontSize: "0.875rem", textDecoration: "underline" }}>
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
}
