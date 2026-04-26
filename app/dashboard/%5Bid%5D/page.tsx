"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  FileText, 
  Clock, 
  Copy, 
  Check,
  Download,
  Share2
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function TranscriptDetail({ params }: { params: { id: string } }) {
  const [transcript, setTranscript] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchTranscript();
  }, [params.id]);

  const fetchTranscript = async () => {
    try {
      const res = await fetch(`/api/transcripts/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setTranscript(data);
      }
    } catch (err) {
      console.error("Failed to fetch transcript");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transcript?.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!transcript) {
    return (
      <div className="glass" style={{ margin: '100px auto', maxWidth: '800px', padding: '64px', textAlign: 'center' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 24px' }} />
        <p>Retrieving from archive...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '48px 64px' }}>
      <div className="nebula-bg" />
      
      <button 
        onClick={() => router.back()}
        style={{ 
          background: 'none', 
          border: 'none', 
          color: 'var(--primary)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          cursor: 'pointer',
          marginBottom: '48px',
          fontFamily: 'Space Grotesk',
          fontWeight: '600',
          fontSize: '1rem'
        }}
      >
        <ArrowLeft size={20} />
        BACK TO ARCHIVE
      </button>

      <main className="glass" style={{ maxWidth: '1000px', margin: '0 auto', padding: '64px' }}>
        <header style={{ marginBottom: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="badge badge-completed" style={{ marginBottom: '16px' }}>TRANSCRIPTION VERIFIED</div>
            <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>{transcript.fileName}</h1>
            <div style={{ display: 'flex', gap: '24px', color: 'var(--on-surface-variant)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} />
                {new Date(transcript.createdAt).toLocaleString()}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} />
                {transcript.content.split(' ').length} WORDS
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={copyToClipboard} className="btn-secondary" style={{ padding: '12px' }}>
              {copied ? <Check size={20} color="#00ff88" /> : <Copy size={20} />}
            </button>
            <button className="btn-secondary" style={{ padding: '12px' }}>
              <Download size={20} />
            </button>
            <button className="btn-secondary" style={{ padding: '12px' }}>
              <Share2 size={20} />
            </button>
          </div>
        </header>

        <section style={{ 
          background: 'rgba(32, 31, 34, 0.3)', 
          padding: '48px', 
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--outline-variant)',
          lineHeight: '1.8',
          fontSize: '1.2rem',
          color: 'var(--on-surface)',
          whiteSpace: 'pre-wrap'
        }}>
          {transcript.content}
        </section>
      </main>
    </div>
  );
}
