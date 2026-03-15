import React from 'react'
import { Link } from 'react-router-dom'
import { Youtube, Radio, ArrowLeft, Star, MapPin, Clock, Calendar } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// 🔁 Replace this with your actual YouTube Live video ID or embed URL
const YOUTUBE_VIDEO_ID = 'live_stream_id_here'

export default function RegisterPage() {
  return (
    <div style={{ background: '#fff8f0', minHeight: '100vh' }}>
      <Navbar />

      {/* ── Hero Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #b35200 0%, #e07b00 40%, #f5a623 70%, #c45c00 100%)',
        padding: '110px 24px 64px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative mandala rings */}
        {[180, 320, 460, 600].map((size, i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%',
            width: size, height: size,
            border: `1px solid rgba(255,255,255,${0.06 + i * 0.02})`,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }} />
        ))}
        {/* Floating dots */}
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 6 + (i % 3) * 4,
            height: 6 + (i % 3) * 4,
            background: `rgba(255,255,255,${0.1 + (i % 4) * 0.05})`,
            borderRadius: '50%',
            top: `${8 + (i * 7) % 80}%`,
            left: `${4 + (i * 9) % 92}%`,
            pointerEvents: 'none',
          }} />
        ))}

        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Closed badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: 30, padding: '7px 22px',
            color: 'white', fontSize: 13, fontWeight: 600,
            letterSpacing: 2, textTransform: 'uppercase',
            marginBottom: 20, backdropFilter: 'blur(8px)',
          }}>
            <Star size={13} /> Registration Closed — Seats Full
          </div>

          <h1 style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: 'clamp(34px, 6vw, 58px)',
            fontWeight: 900, color: 'white',
            textShadow: '0 4px 20px rgba(0,0,0,0.2)',
            marginBottom: 12, lineHeight: 1.1,
          }}>
            Registration Closed 🔒<br />
            <span style={{ color: '#ffd700' }}>But Goonj 2026 Goes Live!</span>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.88)', fontSize: 16,
            maxWidth: 460, margin: '0 auto 28px',
            lineHeight: 1.7,
          }}>
            All seats have been filled. Don't miss the experience — watch the full performance live on YouTube!
          </p>

          {/* Event chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['📅 17 March 2026', '🕑 2:00 – 5:00 PM', '📍 JP Arts & Science College, Bharuch'].map((chip, i) => (
              <span key={i} style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 20, padding: '6px 16px',
                color: 'white', fontSize: 13, fontWeight: 600,
                backdropFilter: 'blur(6px)',
              }}>{chip}</span>
            ))}
          </div>
        </div>

        {/* Bottom wave */}
        <div style={{
          position: 'absolute', bottom: -2, left: 0, right: 0, height: 40,
          background: '#fff8f0',
          clipPath: 'ellipse(55% 100% at 50% 100%)',
        }} />
      </div>

      {/* ── Main Content ── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 80px' }}>

        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: '#e07b00', textDecoration: 'none', fontWeight: 600,
          fontSize: 14, marginBottom: 36,
          transition: 'gap 0.2s',
        }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* ── Closed Card ── */}
        <div style={{
          background: 'white',
          borderRadius: 28,
          padding: '44px 40px',
          boxShadow: '0 20px 60px rgba(224,123,0,0.11), 0 4px 16px rgba(0,0,0,0.05)',
          border: '1.5px solid #f0e0c0',
          textAlign: 'center',
          marginBottom: 32,
        }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>🎪</div>

          <h2 style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: 28, fontWeight: 800, color: '#1a1a2e', marginBottom: 12,
          }}>
            Registration is Now Closed
          </h2>

          <p style={{
            color: '#666', fontSize: 15, lineHeight: 1.9,
            maxWidth: 480, margin: '0 auto 28px',
            fontFamily: "'Inter', sans-serif",
          }}>
            We've received an overwhelming response and all available seats are now taken. 🙏<br />
            You can still be part of the magic — <strong style={{ color: '#e07b00' }}>watch Goonj 2026 live on YouTube!</strong>
          </p>

          {/* Event details */}
          <div style={{
            background: 'linear-gradient(135deg, #fff8f0, #fff3d0)',
            borderRadius: 16, padding: '18px 20px', marginBottom: 32,
            border: '1.5px solid #f5a623',
            fontSize: 14, color: '#7a5c3a', lineHeight: 2.2,
            display: 'inline-block', textAlign: 'left',
          }}>
            <div><Calendar size={14} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
              <strong>17 March 2026 (Tuesday)</strong></div>
            <div><Clock size={14} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
              <strong>2:00 PM – 5:00 PM</strong></div>
            <div><MapPin size={14} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
              <strong>Indoor Auditorium, JP Arts & Science College, Bharuch</strong></div>
          </div>

          {/* YouTube Live Button */}
          <div>
            <a
              href={`https://www.youtube.com/watch?v=${YOUTUBE_VIDEO_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                background: 'linear-gradient(135deg, #c00 0%, #ff0000 60%, #ff4444 100%)',
                color: 'white',
                padding: '16px 36px',
                borderRadius: 14,
                fontFamily: "'Baloo 2', cursive",
                fontWeight: 800,
                fontSize: 18,
                textDecoration: 'none',
                boxShadow: '0 8px 28px rgba(200,0,0,0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                letterSpacing: 0.3,
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 12px 36px rgba(200,0,0,0.45)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 28px rgba(200,0,0,0.35)'
              }}
            >
              <Youtube size={22} />
              Watch Live on YouTube
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: 20, padding: '2px 10px',
                fontSize: 12, fontWeight: 700, letterSpacing: 1,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <Radio size={11} /> LIVE
              </span>
            </a>

            <p style={{ color: '#aaa', fontSize: 13, marginTop: 12 }}>
              Stream starts at 2:00 PM IST on 17 March 2026
            </p>
          </div>
        </div>

        {/* ── YouTube Embed ── */}
        <div style={{
          background: 'white',
          borderRadius: 28,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(224,123,0,0.11), 0 4px 16px rgba(0,0,0,0.05)',
          border: '1.5px solid #f0e0c0',
        }}>
          {/* Embed header */}
          <div style={{
            background: 'linear-gradient(135deg, #c00, #ff4444)',
            padding: '14px 24px',
            display: 'flex', alignItems: 'center', gap: 10,
            color: 'white',
          }}>
            <Youtube size={20} />
            <span style={{
              fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 16,
            }}>
              Goonj 2026 — Live Stream
            </span>
            <span style={{
              marginLeft: 'auto',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 20, padding: '3px 12px',
              fontSize: 12, fontWeight: 700, letterSpacing: 1,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <Radio size={11} /> LIVE
            </span>
          </div>

          {/* Responsive 16:9 embed */}
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=0&rel=0`}
              title="Goonj 2026 Live Stream"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%',
              }}
            />
          </div>

          <div style={{
            padding: '16px 24px',
            background: '#fffdf8',
            display: 'flex', alignItems: 'center', gap: 8,
            borderTop: '1px solid #f0e0c0',
            color: '#7a5c3a', fontSize: 13,
          }}>
            <Radio size={13} style={{ color: '#e07b00' }} />
            Live from <strong style={{ marginLeft: 4 }}>JP Arts & Science College, Bharuch</strong>
            <span style={{ marginLeft: 'auto', color: '#bbb' }}>17 March 2026 · 2:00–5:00 PM IST</span>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}