import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Clock, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      background: '#1a1a2e',
      color: '#ccc',
      padding: '60px 24px 30px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 40,
          marginBottom: 40,
        }}>
          {/* Brand */}
          <div>
            <h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 32, fontWeight: 900, color: '#f5a623', marginBottom: 8 }}>
              GOONJ
            </h2>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: '#aaa' }}>
              The most awaited Grand Cultural Festival of JP Arts and Science College, Bharuch — celebrating art, music, dance and drama.
            </p>
          </div>

          {/* Event Info */}
          <div>
            <h3 style={{ fontFamily: "'Baloo 2', cursive", color: '#f5a623', marginBottom: 16, fontSize: 18 }}>Event Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <MapPin size={16} style={{ color: '#f5a623', flexShrink: 0, marginTop: 2 }} />
                <span>Indoor Auditorium, JP Arts and Science College, Bharuch</span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Clock size={16} style={{ color: '#f5a623', flexShrink: 0 }} />
                <span>17 March 2026 | 2:00 PM – 5:00 PM</span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Phone size={16} style={{ color: '#f5a623', flexShrink: 0 }} />
                <span>79907 41568 (Hariom Dave)</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 style={{ fontFamily: "'Baloo 2', cursive", color: '#f5a623', marginBottom: 16, fontSize: 18 }}>Quick Links</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['/', 'Home'], ['/register', 'Register Now']].map(([to, label]) => (
                <Link key={to} to={to} style={{ color: '#bbb', textDecoration: 'none', fontSize: 14, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#f5a623'}
                  onMouseLeave={e => e.target.style.color = '#bbb'}
                >{label}</Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #2d2d4e', paddingTop: 24, textAlign: 'center', fontSize: 13, color: '#666' }}>
          <p>© 2026 Goonj — Government Engineering College, Bharuch. All rights reserved.</p>
          <p style={{ marginTop: 6 }}>Convener: <span style={{ color: '#f5a623' }}>Prof. Swaral Naik</span></p>
        </div>
      </div>
    </footer>
  )
}
