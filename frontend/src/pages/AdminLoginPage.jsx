import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, User } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/api/admin/login', form)
      localStorage.setItem('admin_token', data.access_token)
      toast.success('Welcome back!')
      navigate('/admin/dashboard')
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(245,166,35,0.3)',
        borderRadius: 24,
        padding: '48px 40px',
        width: '100%',
        maxWidth: 420,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 72, height: 72,
            background: 'linear-gradient(135deg, #e07b00, #f5a623)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 0 30px rgba(224,123,0,0.4)',
          }}>
            <Lock size={32} color="white" />
          </div>
          <h1 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 4 }}>
            Admin Portal
          </h1>
          <p style={{ color: '#888', fontSize: 14 }}>Goonj 2026 — Restricted Access</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', color: '#ccc', fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="admin"
                style={{
                  width: '100%',
                  padding: '13px 16px 13px 42px',
                  borderRadius: 12,
                  border: '2px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.07)',
                  color: 'white',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 15,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#f5a623'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', color: '#ccc', fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '13px 16px 13px 42px',
                  borderRadius: 12,
                  border: '2px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.07)',
                  color: 'white',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 15,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.target.style.borderColor = '#f5a623'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              background: 'linear-gradient(135deg, #e07b00, #f5a623)',
              border: 'none',
              borderRadius: 12,
              color: 'white',
              fontFamily: "'Baloo 2', cursive",
              fontWeight: 700,
              fontSize: 17,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 20px rgba(224,123,0,0.4)',
            }}
          >
            {loading ? '⏳ Logging in...' : '🔓 Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}
