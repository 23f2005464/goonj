import React, { useState, useEffect, useRef } from 'react'
import { CheckCircle, XCircle, Camera, Keyboard, RefreshCw, User, Mail, GraduationCap } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'

let Html5Qrcode = null

export default function QRScannerPage() {
  const [mode, setMode] = useState('camera') // 'camera' | 'manual'
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null) // { success, message, registration }
  const [manualCode, setManualCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [libLoaded, setLibLoaded] = useState(false)
  const scannerRef = useRef(null)
  const scannerInstanceRef = useRef(null)

  // Load html5-qrcode dynamically
  useEffect(() => {
    import('html5-qrcode').then(mod => {
      Html5Qrcode = mod.Html5Qrcode
      setLibLoaded(true)
    }).catch(() => {
      console.error('Could not load QR scanner library')
    })
    return () => {
      stopScanner()
    }
  }, [])

  const stopScanner = async () => {
    if (scannerInstanceRef.current) {
      try {
        await scannerInstanceRef.current.stop()
        scannerInstanceRef.current.clear()
      } catch (e) {}
      scannerInstanceRef.current = null
    }
    setScanning(false)
  }

  const startScanner = async () => {
    if (!Html5Qrcode || !libLoaded) {
      toast.error('Scanner library not ready')
      return
    }
    setResult(null)

    try {
      await stopScanner()

      const qr = new Html5Qrcode('qr-reader')
      scannerInstanceRef.current = qr

      await qr.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 260, height: 260 },
          aspectRatio: 1.0,
        },
        async (decodedText) => {
          await stopScanner()
          await verifyQR(decodedText.trim())
        },
        () => {}
      )
      setScanning(true)
    } catch (err) {
      console.error('Camera error:', err)
      toast.error('Could not access camera. Try manual entry.')
      setMode('manual')
    }
  }

  const verifyQR = async (code) => {
    if (!code.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const { data } = await api.post('/api/registrations/verify-qr', { qr_code: code.trim() })
      setResult(data)
      if (data.success) {
        toast.success('✅ Entry verified!')
      } else {
        toast.error('❌ ' + data.message)
      }
    } catch (err) {
      setResult({ success: false, message: 'Server error. Try again.' })
      toast.error('Server error')
    } finally {
      setLoading(false)
    }
  }

  const handleManualSubmit = async (e) => {
    e.preventDefault()
    if (!manualCode.trim()) { toast.error('Enter a QR code'); return }
    await verifyQR(manualCode)
  }

  const reset = async () => {
    setResult(null)
    setManualCode('')
    if (mode === 'camera') {
      await startScanner()
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '40px 20px',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32, width: '100%', maxWidth: 480 }}>
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #e07b00, #f5a623)',
          borderRadius: 50,
          padding: '6px 20px',
          color: 'white',
          fontFamily: "'Baloo 2', cursive",
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: 2,
          textTransform: 'uppercase',
          marginBottom: 12,
        }}>Event Day Entry</div>
        <h1 style={{
          fontFamily: "'Baloo 2', cursive",
          fontSize: 36,
          fontWeight: 900,
          color: 'white',
          marginBottom: 4,
        }}>QR Verification</h1>
        <p style={{ color: '#aaa', fontSize: 14 }}>Goonj 2026 — 17 March 2026</p>
      </div>

      <div style={{ width: '100%', maxWidth: 480 }}>
        {/* Mode tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 14,
          padding: 4,
          marginBottom: 24,
        }}>
          {[['camera', <Camera size={16} />, 'Camera Scan'], ['manual', <Keyboard size={16} />, 'Manual Entry']].map(([m, icon, label]) => (
            <button
              key={m}
              onClick={() => { stopScanner(); setMode(m); setResult(null) }}
              style={{
                flex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '10px',
                border: 'none',
                borderRadius: 10,
                background: mode === m ? 'linear-gradient(135deg, #e07b00, #f5a623)' : 'transparent',
                color: mode === m ? 'white' : '#aaa',
                fontFamily: "'Baloo 2', cursive",
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >{icon}{label}</button>
          ))}
        </div>

        {/* Camera mode */}
        {mode === 'camera' && !result && (
          <div style={{ textAlign: 'center' }}>
            <div
              id="qr-reader"
              style={{
                width: '100%',
                borderRadius: 20,
                overflow: 'hidden',
                border: '2px solid rgba(245,166,35,0.4)',
                marginBottom: 16,
                minHeight: scanning ? 300 : 0,
                background: scanning ? 'black' : 'transparent',
              }}
            />
            {!scanning ? (
              <button
                className="btn btn-primary"
                onClick={startScanner}
                disabled={!libLoaded || loading}
                style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: 17 }}
              >
                <Camera size={20} /> {libLoaded ? 'Start Camera' : 'Loading...'}
              </button>
            ) : (
              <div>
                <div style={{
                  background: 'rgba(245,166,35,0.15)',
                  border: '1px solid rgba(245,166,35,0.4)',
                  borderRadius: 12,
                  padding: '12px 20px',
                  color: '#f5a623',
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 12,
                }}>📷 Point camera at QR code...</div>
                <button
                  className="btn"
                  onClick={stopScanner}
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                >Stop Scanner</button>
              </div>
            )}
          </div>
        )}

        {/* Manual mode */}
        {mode === 'manual' && !result && (
          <form onSubmit={handleManualSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#ccc', fontWeight: 600, marginBottom: 8, fontSize: 14 }}>
                Enter QR Code Token
              </label>
              <input
                type="text"
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
                placeholder="Paste or type QR code here..."
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: '2px solid rgba(245,166,35,0.4)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 15,
                  outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = '#f5a623'}
                onBlur={e => e.target.style.borderColor = 'rgba(245,166,35,0.4)'}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: 17 }}
            >
              {loading ? '⏳ Verifying...' : '✓ Verify Entry'}
            </button>
          </form>
        )}

        {/* Loading */}
        {loading && !result && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className="spinner" style={{ borderTopColor: '#f5a623', borderColor: 'rgba(255,255,255,0.1)' }} />
            <p style={{ color: '#aaa', marginTop: 16 }}>Verifying QR code...</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div style={{
            background: result.success ? 'rgba(39,174,96,0.1)' : 'rgba(231,76,60,0.1)',
            border: `2px solid ${result.success ? '#27ae60' : '#e74c3c'}`,
            borderRadius: 20,
            padding: '32px 24px',
            textAlign: 'center',
          }}>
            <div style={{ marginBottom: 16 }}>
              {result.success
                ? <CheckCircle size={64} style={{ color: '#27ae60' }} />
                : <XCircle size={64} style={{ color: '#e74c3c' }} />
              }
            </div>

            <h2 style={{
              fontFamily: "'Baloo 2', cursive",
              fontSize: 26,
              fontWeight: 800,
              color: result.success ? '#27ae60' : '#e74c3c',
              marginBottom: 8,
            }}>
              {result.success ? '✅ Entry Approved' : '❌ Entry Denied'}
            </h2>

            <p style={{ color: '#ccc', fontSize: 15, marginBottom: 20 }}>{result.message}</p>

            {result.registration && result.success && (
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 14,
                padding: '20px',
                textAlign: 'left',
                marginBottom: 20,
              }}>
                {[
                  [<User size={14} />, 'Name', result.registration.full_name],
                  [<Mail size={14} />, 'Email', result.registration.email],
                  [<GraduationCap size={14} />, 'College', result.registration.college],
                  [null, 'Department', result.registration.department],
                  [null, 'Year', result.registration.year],
                ].map(([icon, label, val], i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 0',
                    borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                    fontSize: 14,
                  }}>
                    {icon && <span style={{ color: '#f5a623' }}>{icon}</span>}
                    <span style={{ color: '#888', minWidth: 80 }}>{label}</span>
                    <span style={{ color: 'white', fontWeight: 600 }}>{val}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              className="btn"
              onClick={reset}
              style={{
                background: 'linear-gradient(135deg, #e07b00, #f5a623)',
                color: 'white',
                border: 'none',
                width: '100%',
                justifyContent: 'center',
                padding: '14px',
                fontSize: 16,
              }}
            >
              <RefreshCw size={18} /> Scan Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
