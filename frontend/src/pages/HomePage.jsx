import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Clock, Music, Star, ChevronDown, Mic2, Drama, Drum } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const COUNTDOWN_TARGET = new Date('2026-03-17T14:00:00')

function useCountdown(target) {
  const calc = () => {
    const diff = target - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    }
  }
  const [time, setTime] = useState(calc)
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

function CountdownUnit({ value, label }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      minWidth: 72,
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 16,
        width: 80, height: 80,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Baloo 2', cursive",
        fontSize: 36, fontWeight: 900, color: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
        marginBottom: 8,
        transition: 'transform 0.1s',
      }}>
        {String(value).padStart(2, '0')}
      </div>
      <span style={{
        fontSize: 11, fontWeight: 700,
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 2, textTransform: 'uppercase',
      }}>{label}</span>
    </div>
  )
}

const highlights = [
  { emoji: '💃', title: 'Classical Dance', desc: 'Bharatanatyam, Kathak and vibrant folk traditions performed by talented artists' },
  { emoji: '🎭', title: 'Drama & Theater', desc: 'Gripping one-act plays and mime performances that move hearts and spark conversations' },
  { emoji: '🎵', title: 'Live Music', desc: 'Soulful vocals, instrumental fusion and group singing celebrating India\'s musical richness' },
  { emoji: '🥁', title: 'Cultural Showcase', desc: 'A grand celebration of Gujarat\'s heritage through art, costume and storytelling' },
]

export default function HomePage() {
  const countdown = useCountdown(COUNTDOWN_TARGET)
  const [mounted, setMounted] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    // Staggered entrance
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div>
      <Navbar />

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section
        ref={heroRef}
        style={{
          minHeight: '100vh',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '100px 24px 80px',
        }}
      >
        {/* Multi-layer gradient background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, #7a2e00 0%, #c45c00 25%, #e07b00 50%, #f5a623 72%, #d4620a 88%, #8b2500 100%)',
        }} />

        {/* Radial glow overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,200,60,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Animated mandala rings */}
        {[120, 240, 380, 530, 700].map((size, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: size, height: size,
            border: `${i === 0 ? 2 : 1}px solid rgba(255,255,255,${0.04 + (4 - i) * 0.025})`,
            borderRadius: '50%',
            top: '42%', left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: `spin ${30 + i * 15}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
            pointerEvents: 'none',
          }} />
        ))}

        {/* Floating petals/dots */}
        {[...Array(16)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 4 + (i % 4) * 3,
            height: 4 + (i % 4) * 3,
            background: `rgba(255,215,0,${0.15 + (i % 5) * 0.07})`,
            borderRadius: i % 3 === 0 ? '50% 0 50% 0' : '50%',
            top: `${5 + (i * 6) % 88}%`,
            left: `${3 + (i * 7) % 94}%`,
            animation: `floatDot ${4 + (i % 4)}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.3}s`,
            pointerEvents: 'none',
          }} />
        ))}

        {/* ── Content ── */}
        <div style={{
          position: 'relative', zIndex: 3,
          textAlign: 'center',
          maxWidth: 760,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}>

          {/* College tag */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.14)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.28)',
            borderRadius: 30, padding: '8px 22px',
            color: 'rgba(255,255,255,0.92)',
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 600, fontSize: 13,
            letterSpacing: 2, textTransform: 'uppercase',
            marginBottom: 24,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s',
          }}>
            JP Arts & Science College, Bharuch · Presents
          </div>

          {/* Event label */}
          <div style={{
            fontFamily: "'Kalam', cursive",
            fontSize: 'clamp(15px, 2.5vw, 22px)',
            color: '#ffd580',
            letterSpacing: 3, marginBottom: 6,
            opacity: mounted ? 1 : 0,
            transition: 'opacity 0.8s ease 0.2s',
          }}>most awaited annual event</div>

          {/* GOONJ title */}
          <div style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'scale(1)' : 'scale(0.92)',
            transition: 'opacity 0.8s ease 0.25s, transform 0.8s ease 0.25s',
          }}>
            <h1 style={{
              fontFamily: "'Baloo 2', cursive",
              fontSize: 'clamp(82px, 18vw, 160px)',
              fontWeight: 900,
              color: 'white',
              lineHeight: 0.85,
              textShadow: '3px 3px 0 rgba(0,0,0,0.25), 0 8px 30px rgba(0,0,0,0.2)',
              letterSpacing: -4,
              margin: 0,
              userSelect: 'none',
            }}>GOONJ</h1>

            <div style={{
              fontFamily: "'Baloo 2', cursive",
              fontSize: 'clamp(60px, 14vw, 120px)',
              fontWeight: 900,
              color: '#ffd700',
              lineHeight: 0.9,
              textShadow: '3px 3px 0 rgba(139,37,0,0.5), 0 0 50px rgba(255,215,0,0.25)',
              letterSpacing: -2,
              marginBottom: 12,
              userSelect: 'none',
            }}>2026</div>
          </div>

          {/* Subtitle */}
          <div style={{
            fontFamily: "'Kalam', cursive",
            fontSize: 'clamp(18px, 3vw, 26px)',
            color: 'rgba(255,255,255,0.9)',
            letterSpacing: 4,
            marginBottom: 36,
            opacity: mounted ? 1 : 0,
            transition: 'opacity 0.8s ease 0.4s',
          }}>Grand Cultural Festival</div>

          {/* Info chips */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 10,
            justifyContent: 'center', marginBottom: 44,
            opacity: mounted ? 1 : 0,
            transition: 'opacity 0.8s ease 0.5s',
          }}>
            {[
              { icon: <Calendar size={15} />, text: '17 March 2026 — Tuesday' },
              { icon: <Clock size={15} />, text: '2:00 PM – 5:00 PM' },
              { icon: <MapPin size={15} />, text: 'Indoor Auditorium, JP College' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.14)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.22)',
                borderRadius: 30, padding: '9px 18px',
                color: 'white', fontSize: 14, fontWeight: 600,
              }}>
                {item.icon}{item.text}
              </div>
            ))}
          </div>

          {/* Countdown */}
          <div style={{
            marginBottom: 48,
            opacity: mounted ? 1 : 0,
            transition: 'opacity 0.8s ease 0.55s',
          }}>
            <p style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: 12, fontWeight: 700,
              letterSpacing: 3, textTransform: 'uppercase',
              marginBottom: 18,
            }}>Event Starts In</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <CountdownUnit value={countdown.days} label="Days" />
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 36, fontWeight: 900, alignSelf: 'center', marginBottom: 16 }}>:</div>
              <CountdownUnit value={countdown.hours} label="Hours" />
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 36, fontWeight: 900, alignSelf: 'center', marginBottom: 16 }}>:</div>
              <CountdownUnit value={countdown.minutes} label="Minutes" />
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 36, fontWeight: 900, alignSelf: 'center', marginBottom: 16 }}>:</div>
              <CountdownUnit value={countdown.seconds} label="Seconds" />
            </div>
          </div>

          {/* CTAs */}
          <div style={{
            display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap',
            opacity: mounted ? 1 : 0,
            transition: 'opacity 0.8s ease 0.65s',
          }}>
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'white',
              color: '#c45c00',
              borderRadius: 50,
              padding: '16px 40px',
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 800, fontSize: 17,
              textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              border: 'none',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(0,0,0,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)' }}
            >
              <Star size={18} /> Register Free
            </Link>

            <Link to="/performances" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'transparent',
              color: 'white',
              borderRadius: 50,
              padding: '16px 36px',
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 700, fontSize: 16,
              textDecoration: 'none',
              border: '2px solid rgba(255,255,255,0.5)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)' }}
            >
              <Music size={16} /> Past Performances
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.45)',
          animation: 'bounceDown 2s ease-in-out infinite',
          zIndex: 3,
        }}>
          <ChevronDown size={26} />
        </div>
      </section>

      {/* ════════════════════════════════════════
          HIGHLIGHTS
      ════════════════════════════════════════ */}
      <section style={{ background: '#fff8f0', padding: '88px 24px' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #e07b00, #f5a623)',
              color: 'white',
              borderRadius: 30, padding: '6px 20px',
              fontSize: 12, fontWeight: 700,
              letterSpacing: 2, textTransform: 'uppercase',
              marginBottom: 16,
            }}>What to Expect</span>
            <h2 style={{
              fontFamily: "'Baloo 2', cursive",
              fontSize: 'clamp(28px, 5vw, 46px)',
              fontWeight: 800, color: '#1a1a2e',
              marginBottom: 10, lineHeight: 1.2,
            }}>A Celebration of Culture</h2>
            <p style={{ color: '#9a7a5a', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
              Experience the best of art, music, dance and drama under one roof
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 24,
          }}>
            {highlights.map((item, i) => (
              <HighlightCard key={i} item={item} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA STRIP
      ════════════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f2744 50%, #1a1a2e 100%)',
        padding: '80px 24px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 300,
          background: 'radial-gradient(ellipse, rgba(224,123,0,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎟️</div>
          <h2 style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: 'clamp(28px, 5vw, 42px)',
            fontWeight: 800, color: '#f5a623',
            marginBottom: 14,
          }}>Grab Your Free Entry Pass</h2>
          <p style={{ color: '#aaa', fontSize: 16, lineHeight: 1.8, marginBottom: 36 }}>
            Register now and receive your personalized <strong style={{ color: 'white' }}>QR code pass</strong> via email.
            Show it at the gate for instant entry — completely free!
          </p>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'linear-gradient(135deg, #e07b00, #f5a623)',
            color: 'white',
            borderRadius: 50, padding: '16px 44px',
            fontFamily: "'Baloo 2', cursive",
            fontWeight: 800, fontSize: 18,
            textDecoration: 'none',
            boxShadow: '0 8px 32px rgba(224,123,0,0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(224,123,0,0.55)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(224,123,0,0.4)' }}
          >
            Register Now — It's Free 🎉
          </Link>
          <p style={{ color: '#555', fontSize: 13, marginTop: 20 }}>
            Convener: <span style={{ color: '#f5a623' }}>Prof. Swaral Naik</span> &nbsp;·&nbsp;
            Coordinator: <span style={{ color: '#f5a623' }}>Hariom Dave — 79907 41568</span>
          </p>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes spin { to { transform: translate(-50%, -50%) rotate(360deg); } }
        @keyframes floatDot {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-14px) rotate(15deg); }
        }
        @keyframes bounceDown {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.45; }
          50% { transform: translateX(-50%) translateY(8px); opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}

// Separate component prevents re-render of parent on hover
function HighlightCard({ item, delay }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white',
        borderRadius: 22,
        padding: '36px 28px',
        textAlign: 'center',
        border: `2px solid ${hovered ? '#f5a623' : 'transparent'}`,
        boxShadow: hovered
          ? '0 16px 48px rgba(224,123,0,0.18)'
          : '0 4px 20px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: 'default',
      }}
    >
      <div style={{ fontSize: 52, marginBottom: 18 }}>{item.emoji}</div>
      <h3 style={{
        fontFamily: "'Baloo 2', cursive",
        fontSize: 20, fontWeight: 700,
        color: '#1a1a2e', marginBottom: 10,
      }}>{item.title}</h3>
      <p style={{ color: '#9a7a5a', fontSize: 14, lineHeight: 1.7 }}>{item.desc}</p>
    </div>
  )
}