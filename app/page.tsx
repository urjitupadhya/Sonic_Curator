"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ChevronRight, Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log(`Starting ${isSignUp ? 'Sign Up' : 'Sign In'} process...`);
      
      const authPromise = isSignUp ? 
        authClient.signUp.email({
          email,
          password,
          name,
          callbackURL: "/dashboard",
        }) : 
        authClient.signIn.email({
          email,
          password,
          callbackURL: "/dashboard",
        });

      // Add a 10-second timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Request timed out. Please check your internet and database.")), 15000)
      );

      const result: any = await Promise.race([authPromise, timeoutPromise]);
      console.log("Auth result:", result);

      if (result.error) {
        setError(result.error.message || "Authentication failed. Check your credentials.");
        setLoading(false);
      } else {
        console.log("Success! Redirecting...");
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Auth Exception:", err);
      setError(err.message || "A connection error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div className="nebula-bg" />
      
      <div className="glass glass-float fade-in" style={{ 
        padding: '64px', 
        width: '100%', 
        maxWidth: '460px',
        border: '1px solid rgba(194, 193, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <header style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ 
            display: 'inline-block',
            padding: '12px',
            background: 'rgba(94, 92, 230, 0.1)',
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            <Lock size={32} color="var(--primary)" />
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>AETHER ARCHIVE</h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.1rem' }}>
            {isSignUp ? "Register for vault access." : "Enter the sonic vault."}
          </p>
        </header>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {isSignUp && (
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--outline)' }} />
              <input 
                type="text" 
                placeholder="Full Name" 
                style={{ paddingLeft: '48px' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--outline)' }} />
            <input 
              type="email" 
              placeholder="Admin Email" 
              style={{ paddingLeft: '48px' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--outline)' }} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Access Key" 
              style={{ paddingLeft: '48px', paddingRight: '48px' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--outline)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                borderRadius: '50%',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--outline)')}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <div style={{ 
              color: 'var(--error)', 
              fontSize: '0.875rem', 
              textAlign: 'center',
              background: 'rgba(239, 68, 68, 0.1)',
              padding: '10px',
              borderRadius: '8px'
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ marginTop: '12px', height: '56px', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? "Authenticating..." : (isSignUp ? "INITIALIZE ACCOUNT" : "ESTABLISH CONNECTION")}
            {!loading && <ChevronRight size={20} />}
          </button>
        </form>

        <footer style={{ marginTop: '48px', textAlign: 'center' }}>
          <button 
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            style={{ 
              background: 'none',
              border: 'none',
              color: 'var(--outline)', 
              fontSize: '0.875rem', 
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            {isSignUp ? "Already have access? Login" : "New operative? Request Access"}
          </button>
        </footer>
      </div>
    </main>
  );
}
