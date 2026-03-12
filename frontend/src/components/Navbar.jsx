import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/register', label: 'Register' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => setOpen(false), [location])

  const isActive = (to) => location.pathname === to

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(26,26,46,0.97)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.3)' : 'none',
      padding: scrolled ? '10px 24px' : '20px 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 42, height: 42,
            background: 'linear-gradient(135deg, #e07b00, #f5a623)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Baloo 2', cursive",
            fontWeight: 900, fontSize: 18, color: 'white',
            boxShadow: '0 2px 12px rgba(224,123,0,0.5)'
          }}>G</div>
          <span style={{
            fontFamily: "'Baloo 2', cursive",
            fontWeight: 800,
            fontSize: 22,
            color: 'white',
            letterSpacing: 1,
          }}>GOONJ <span style={{ color: '#f5a623' }}>2026</span></span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="desktop-nav">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                textDecoration: 'none',
                padding: '8px 18px',
                borderRadius: 30,
                fontFamily: "'Baloo 2', cursive",
                fontWeight: 600,
                fontSize: 15,
                color: isActive(to) ? '#1a1a2e' : 'white',
                background: isActive(to) ? '#f5a623' : 'transparent',
                transition: 'all 0.2s',
                letterSpacing: 0.3,
              }}
              onMouseEnter={e => { if (!isActive(to)) { e.target.style.background = 'rgba(245,166,35,0.2)' } }}
              onMouseLeave={e => { if (!isActive(to)) { e.target.style.background = 'transparent' } }}
            >{label}</Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 4 }}
          className="mobile-menu-btn"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: 'rgba(26,26,46,0.98)',
          padding: '16px 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          borderTop: '1px solid rgba(245,166,35,0.3)'
        }}>
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                textDecoration: 'none',
                padding: '12px 16px',
                borderRadius: 10,
                fontFamily: "'Baloo 2', cursive",
                fontWeight: 600,
                fontSize: 17,
                color: isActive(to) ? '#1a1a2e' : 'white',
                background: isActive(to) ? '#f5a623' : 'transparent',
              }}
            >{label}</Link>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 769px) { .mobile-menu-btn { display: none !important; } }
        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
      `}</style>
    </nav>
  )
}
