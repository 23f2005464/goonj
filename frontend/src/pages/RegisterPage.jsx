import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { User, Mail, Phone, GraduationCap, BookOpen, Calendar, Star, CheckCircle, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../utils/api'

const years = ['Sem 2', 'Sem 4', 'Sem 6', 'Sem 8']
const departments = ['Computer Engineering', 'Electronics and Communication', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Electrical Engineering']
export default function RegisterPage() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    enrollment: '',   // ✅ add this
    department: '',
    year: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)

  // useCallback prevents new function reference on each render — fixes focus-loss bug
  const handleChange = useCallback((name, value) => {
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => prev[name] ? { ...prev, [name]: '' } : prev)
  }, [])

  const validate = () => {
    const e = {}
    if (!form.full_name.trim()) e.full_name = 'Name is required'
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) e.phone = 'Valid 10-digit phone required'
    if (!form.enrollment || form.enrollment.length !== 12) e.enrollment = 'Enrollment number must be 12 digits'
    if (!form.department.trim()) e.department = 'Department is required'
    if (!form.year) e.year = 'Please select your year'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const { data } = await api.post('/api/registrations/', form)
      setSuccess(data)
      toast.success('Registration submitted! Waiting for admin approval.')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div>
        <Navbar />
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(160deg, #fff8f0, #fff3d0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '100px 24px 60px',
        }}>
          <div style={{
            background: 'white', borderRadius: 28, padding: '52px 44px',
            maxWidth: 520, width: '100%', textAlign: 'center',
            boxShadow: '0 24px 80px rgba(224,123,0,0.18)',
            border: '2px solid #f5d070',
          }}>
            <div style={{ fontSize: 64, marginBottom: 8 }}>🎉</div>
            <div style={{ color: '#27ae60', display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <CheckCircle size={52} strokeWidth={2} />
            </div>
            <h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 32, fontWeight: 800, color: '#1a1a2e', marginBottom: 8 }}>
              Wait for Your Final Entry Pass!
            </h2>
            <p style={{ color: '#666', fontSize: 15, lineHeight: 1.9, marginBottom: 24, fontFamily: "'Inter', sans-serif" }}>
             <strong style={{ color: '#e07b00' }}>{success.full_name}</strong>! 🎊<br />
              Your registration request has been submitted.<br />
              As limited seats are available you will receive a confirmation email from our team for your entry pass<br />
              <strong style={{ color: '#1a1a2e' }}>{success.email}</strong>
            </p>
            <div style={{
              background: 'linear-gradient(135deg, #fff8f0, #fff3d0)',
              borderRadius: 16, padding: '18px 20px', marginBottom: 28,
              border: '1.5px solid #f5a623',
              fontSize: 14, color: '#7a5c3a', lineHeight: 2,
            }}>
              📅 <strong>17 March 2026 (Tuesday)</strong><br />
              🕑 2:00 PM – 5:00 PM<br />
              📍 Indoor Auditorium, JP Arts & Science College, Bharuch
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Link to="/" className="btn btn-primary">Back to Home</Link>
              <Link to="/performances" className="btn btn-outline">Youtube Link</Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

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
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.35)',
            borderRadius: 30, padding: '7px 22px',
            color: 'white', fontSize: 13, fontWeight: 600,
            letterSpacing: 2, textTransform: 'uppercase',
            marginBottom: 20, backdropFilter: 'blur(8px)',
          }}>
            <Star size={13} /> Free Entry — Limited Seats
          </div>

          <h1 style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: 'clamp(34px, 6vw, 58px)',
            fontWeight: 900, color: 'white',
            textShadow: '0 4px 20px rgba(0,0,0,0.2)',
            marginBottom: 12, lineHeight: 1.1,
          }}>
            Register for Your Entry Pass <br />
            <span style={{ color: '#ffd700' }}>at Goonj 2026</span>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.88)', fontSize: 16,
            maxWidth: 400, margin: '0 auto 28px',
            lineHeight: 1.7,
          }}>

            Fill in your details and instantly receive your personalized QR code
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

      {/* ── Form Card ── */}
      <div style={{ maxWidth: 660, margin: '0 auto', padding: '40px 24px 80px' }}>

        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: '#e07b00', textDecoration: 'none', fontWeight: 600,
          fontSize: 14, marginBottom: 28,
          transition: 'gap 0.2s',
        }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div style={{
          background: 'white',
          borderRadius: 28,
          padding: '44px 40px',
          boxShadow: '0 20px 60px rgba(224,123,0,0.11), 0 4px 16px rgba(0,0,0,0.05)',
          border: '1.5px solid #f0e0c0',
        }}>
          <h2 style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: 26, fontWeight: 800, color: '#1a1a2e', marginBottom: 4,
          }}>Register yourself for entry pass</h2>
          <p style={{ color: '#bbb', fontSize: 13, marginBottom: 36 }}>
            Fields marked * are required
          </p>

          {/* All styles isolated in a style tag — avoids inline style object recreations */}
          <style>{`
            .rg { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; }
            .rg-full { grid-column: 1 / -1; }
            .rg-wrap { position: relative; }
            .rg-wrap .rg-icon {
              position: absolute; left: 14px; top: 50%;
              transform: translateY(-50%);
              color: #c8a87a; pointer-events: none;
              display: flex; align-items: center;
            }
            .rg-input {
              width: 100%;
              padding: 13px 16px 13px 44px;
              border: 2px solid #ecdfc8;
              border-radius: 12px;
              font-family: 'Rajdhani', sans-serif;
              font-size: 15px;
              color: #2d1a00;
              background: #fffdf8;
              outline: none;
              transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
              box-sizing: border-box;
            }
            .rg-input::placeholder { color: #c8b89a; }
            .rg-input:focus {
              border-color: #e07b00;
              box-shadow: 0 0 0 4px rgba(224,123,0,0.1);
              background: #ffffff;
            }
            .rg-input.has-err { border-color: #e74c3c; }
            .rg-input.has-err:focus { box-shadow: 0 0 0 4px rgba(231,76,60,0.1); }
            .rg-label {
              display: block;
              font-weight: 700;
              color: #6b4c2e;
              font-size: 13px;
              margin-bottom: 8px;
              letter-spacing: 0.2px;
            }
            .rg-err { color: #e74c3c; font-size: 12px; margin-top: 5px; font-weight: 500; }
            .rg-select { padding-left: 44px; cursor: pointer; appearance: auto; }
            .rg-no-icon { padding-left: 16px; }
            @media (max-width: 540px) {
              .rg { grid-template-columns: 1fr; }
              .rg-full { grid-column: 1; }
            }
          `}</style>

          <form onSubmit={handleSubmit} noValidate>
            <div className="rg">

              {/* Full Name */}
              <div className="rg-full">
                <label className="rg-label">Full Name *</label>
                <div className="rg-wrap">
                  <span className="rg-icon"><User size={16} /></span>
                  <input
                    className={`rg-input${errors.full_name ? ' has-err' : ''}`}
                    type="text"
                    placeholder="Your full name"
                    value={form.full_name}
                    onChange={e => handleChange('full_name', e.target.value)}
                    autoComplete="name"
                  />
                </div>
                {errors.full_name && <p className="rg-err">⚠ {errors.full_name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="rg-label">Email Address *</label>
                <div className="rg-wrap">
                  <span className="rg-icon"><Mail size={16} /></span>
                  <input
                    className={`rg-input${errors.email ? ' has-err' : ''}`}
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="rg-err">⚠ {errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="rg-label">Phone Number *</label>
                <div className="rg-wrap">
                  <span className="rg-icon"><Phone size={16} /></span>
                  <input
                    className={`rg-input${errors.phone ? ' has-err' : ''}`}
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                    autoComplete="tel"
                    maxLength={10}
                  />
                </div>
                {errors.phone && <p className="rg-err">⚠ {errors.phone}</p>}
              </div>

              {/* College */}
              <div className="rg-full">
                <label className="rg-label">Enrollment Number *</label>
                <div className="rg-wrap">
                  <span className="rg-icon"><GraduationCap size={16} /></span>
                  <input
                    className={`rg-input${errors.enrollment ? ' has-err' : ''}`}
                    type="text"
                    placeholder="e.g. 230140111056"
                    value={form.enrollment}
                    maxLength={12}
                    onChange={e => handleChange('enrollment', e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                {errors.enrollment && <p className="rg-err">⚠ {errors.enrollment}</p>}
              </div>
              {/* Department */}
              <div>
                <label className="rg-label">Department *</label>
                <div className="rg-wrap">
                  <span className="rg-icon"><BookOpen size={16} /></span>
                  <select
                    className={`rg-input rg-select${errors.department ? ' has-err' : ''}`}
                    value={form.department}
                    onChange={e => handleChange('department', e.target.value)}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dep => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </select>
                </div>
                {errors.department && <p className="rg-err">⚠ {errors.department}</p>}
              </div>

              {/* Year */}
              <div>
                <label className="rg-label">Year *</label>
                <div className="rg-wrap">
                  <span className="rg-icon"><Calendar size={16} /></span>
                  <select
                    className={`rg-input rg-select${errors.year ? ' has-err' : ''}`}
                    value={form.year}
                    onChange={e => handleChange('year', e.target.value)}
                  >
                    <option value="">Select your semester</option>
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                {errors.year && <p className="rg-err">⚠ {errors.year}</p>}
              </div>
            </div>

            {/* Divider */}
            <div style={{
              height: 1,
              background: 'linear-gradient(90deg, transparent, #f0d9b0, transparent)',
              margin: '36px 0',
            }} />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '18px',
                background: loading
                  ? '#e0c9a0'
                  : 'linear-gradient(135deg, #c45c00 0%, #e07b00 50%, #f5a623 100%)',
                border: 'none',
                borderRadius: 14,
                color: 'white',
                fontFamily: "'Baloo 2', cursive",
                fontWeight: 800,
                fontSize: 18,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 8px 28px rgba(224,123,0,0.38)',
                transition: 'all 0.25s',
                letterSpacing: 0.5,
              }}
            >
              {loading ? '⏳ Registering...' : '🎉 Submit Registration Request'}
            </button>

            <p style={{ textAlign: 'center', color: '#777575', fontSize: 16, marginTop: 14 }}>
              Grab Fast — Limited Seats Available !
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}