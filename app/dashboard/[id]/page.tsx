"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Copy, 
  Download, 
  Play, 
  Pause, 
  Clock, 
  Info,
  ChevronRight,
  Activity
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function TranscriptDetail({ params }: { params: { id: string } }) {
  const [transcript, setTranscript] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchDetail();
  }, []);

  const fetchDetail = async () => {
    try {
      const res = await fetch(`/api/transcripts/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setTranscript(data);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript.content);
    alert("Transcript copied to vault!");
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="nebula-bg" />
      <Activity className="animate-spin" size={48} color="var(--primary)" />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      <div className="nebula-bg" />
      
      {/* Header */}
      <header className="glass" style={{ 
        padding: '24px 48px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        margin: '24px',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button 
            onClick={() => router.push("/dashboard")}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--on-surface)', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft size={20} />
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Archive</span>
          </button>
          <div style={{ width: '1px', height: '24px', background: 'var(--outline-variant)' }} />
          <h1 style={{ fontSize: '1.25rem', letterSpacing: '0.05em' }}>{transcript.fileName}</h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={copyToClipboard} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Copy size={16} />
            COPY
          </button>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={16} />
            EXPORT
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1, padding: '0 24px 120px 24px', gap: '24px' }}>
        
        {/* Transcript Text */}
        <main className="glass" style={{ 
          flex: 1, 
          padding: '64px', 
          overflowY: 'auto',
          lineHeight: '1.8',
          fontSize: '1.1rem',
          color: 'var(--on-surface)',
          whiteSpace: 'pre-wrap'
        }}>
          <div style={{ 
            fontFamily: 'Space Grotesk', 
            fontSize: '0.75rem', 
            color: 'var(--primary)', 
            marginBottom: '16px',
            letterSpacing: '0.2em'
          }}>
            SPEAKER A
          </div>
          {transcript.content}
        </main>

        {/* Sidebar Metadata */}
        <aside style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Technical Specs</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--on-surface-variant)' }}>
                  <Clock size={16} />
                  <span>Duration</span>
                </div>
                <span style={{ fontFamily: 'Space Grotesk' }}>00:58</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--on-surface-variant)' }}>
                  <Info size={16} />
                  <span>AI Confidence</span>
                </div>
                <span style={{ color: 'var(--primary)', fontFamily: 'Space Grotesk' }}>98.4%</span>
              </div>
            </div>
          </div>

          <div className="glass" style={{ padding: '32px', flex: 1 }}>
             <h3 style={{ fontSize: '1rem', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Recent Weaves</h3>
             <div style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>
                Quick access to related audio files will appear here.
             </div>
          </div>
        </aside>
      </div>

      {/* Floating Audio Player */}
      <div className="glass fade-in" style={{ 
        position: 'fixed', 
        bottom: '24px', 
        left: '50%', 
        transform: 'translateX(-50%)',
        width: 'calc(100% - 48px)',
        maxWidth: '1000px',
        padding: '24px 40px',
        display: 'flex',
        alignItems: 'center',
        gap: '48px',
        boxShadow: '0 -20px 40px rgba(0,0,0,0.3)',
        border: '1px solid rgba(194, 193, 255, 0.2)'
      }}>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '50%', 
            background: 'var(--primary)', 
            border: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(194, 193, 255, 0.4)'
          }}
        >
          {isPlaying ? <Pause color="black" /> : <Play color="black" style={{ marginLeft: '4px' }} />}
        </button>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', fontFamily: 'Space Grotesk', color: 'var(--on-surface-variant)' }}>
            <span>00:24</span>
            <span>00:58</span>
          </div>
          <div style={{ height: '4px', background: 'rgba(194, 193, 255, 0.1)', borderRadius: '2px', position: 'relative' }}>
             <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '40%', background: 'var(--primary)', borderRadius: '2px', boxShadow: '0 0 10px var(--primary)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px' }}>
           <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--outline)', marginBottom: '4px' }}>SPEED</div>
              <div style={{ fontFamily: 'Space Grotesk', fontWeight: 600 }}>1.0x</div>
           </div>
        </div>
      </div>
    </div>
  );
}
