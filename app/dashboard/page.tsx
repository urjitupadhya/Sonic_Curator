"use client";

import { useState, useEffect } from "react";
import { 
  Upload, 
  LogOut, 
  FileAudio, 
  Clock, 
  CheckCircle, 
  ChevronRight,
  Activity,
  Plus,
  Search
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchTranscripts();
  }, []);

  const fetchTranscripts = async () => {
    try {
      const res = await fetch("/api/transcripts", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setTranscripts(data);
      }
    } catch (err) {
      console.error("Failed to fetch transcripts");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (res.ok) {
        setFile(null);
        fetchTranscripts();
      } else {
        const errorData = await res.json();
        alert(`Upload failed: ${errorData.error || errorData.details || "Unknown error"}`);
      }
    } catch (err) {
      alert("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      <div className="nebula-bg" />
      
      {/* Sidebar */}
      <aside className="glass" style={{ 
        width: '320px', 
        margin: '24px 0 24px 24px', 
        display: 'flex', 
        flexDirection: 'column',
        padding: '40px',
        border: '1px solid rgba(194, 193, 255, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '64px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            background: 'var(--primary-container)', 
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(94, 92, 230, 0.3)'
          }}>
            <Activity size={24} color="white" />
          </div>
          <h2 style={{ fontSize: '1.5rem', letterSpacing: '0.05em' }}>SONIC CURATOR</h2>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ 
            padding: '16px 20px', 
            background: 'rgba(194, 193, 255, 0.1)', 
            borderRadius: 'var(--radius-sm)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontFamily: 'Space Grotesk',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            <FileAudio size={20} />
            <span>Archive</span>
          </div>
        </nav>

        <button onClick={handleLogout} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
          <LogOut size={18} />
          DISCONNECT
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '48px 64px', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '64px' }}>
          <div>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '8px' }}>THE ARCHIVE</h1>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '1.2rem' }}>Curate your sonic collection with AI precision.</p>
          </div>
          <div className="glass" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
             <Search size={20} color="var(--outline)" />
             <span style={{ color: 'var(--outline)', fontSize: '0.9rem' }}>Search transcripts...</span>
          </div>
        </header>

        {/* Upload Section */}
        <section className="glass" style={{ 
          padding: '64px', 
          textAlign: 'center', 
          marginBottom: '64px', 
          borderStyle: 'dashed',
          borderColor: 'rgba(194, 193, 255, 0.2)',
          background: 'rgba(32, 31, 34, 0.2)'
        }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: 'rgba(94, 92, 230, 0.05)', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 32px',
            border: '1px solid rgba(94, 92, 230, 0.2)'
          }}>
            <Plus size={40} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '12px' }}>
            {file ? file.name : "Initiate Transcription"}
          </h3>
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: '40px', fontSize: '1rem' }}>
            Support for WAV, MP3, AAC up to 60 seconds.
          </p>
          
          <form onSubmit={handleUpload}>
            <input 
              type="file" 
              accept="audio/*" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
              id="audio-upload"
            />
            {!file ? (
              <label htmlFor="audio-upload" className="btn-primary" style={{ margin: '0 auto', display: 'inline-flex' }}>
                BROWSE FILES
              </label>
            ) : (
              <button type="submit" className="btn-primary" style={{ margin: '0 auto' }} disabled={uploading}>
                {uploading ? "WAVING DIGITAL TEXT..." : "START WEAVING"}
              </button>
            )}
          </form>
        </section>

        {/* List Section */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Recent Weaves</h3>
            <span style={{ color: 'var(--on-surface-variant)', fontSize: '0.9rem', fontFamily: 'Space Grotesk' }}>
              {transcripts.length} ARCHIVED
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {transcripts.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', color: 'var(--on-surface-variant)', border: '1px solid var(--outline-variant)' }}>
                The archive is currently empty.
              </div>
            ) : (
              transcripts.map((t) => (
                <div 
                  key={t.id} 
                  className="card card-interactive" 
                  style={{ display: 'flex', alignItems: 'center', gap: '32px', border: '1px solid var(--outline-variant)', cursor: 'pointer' }}
                  onClick={() => router.push(`/dashboard/${t.id}`)}
                >
                  <div style={{ 
                    width: '56px', 
                    height: '56px', 
                    background: 'var(--surface-low)', 
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--outline-variant)'
                  }}>
                    <FileAudio size={28} color="var(--primary)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '6px', color: 'var(--on-surface)' }}>{t.fileName}</h4>
                    <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.95rem', maxWidth: '600px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.content}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="badge badge-completed" style={{ marginBottom: '8px', display: 'inline-block' }}>
                      VERIFIED
                    </div>
                    <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', fontFamily: 'Space Grotesk' }}>
                      <Clock size={12} />
                      {new Date(t.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <ChevronRight size={24} color="var(--outline)" />
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
