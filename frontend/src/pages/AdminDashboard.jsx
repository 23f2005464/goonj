import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users, BarChart2, Film, LogOut, Search, Edit2, Trash2,
  CheckCircle, XCircle, Plus, Save, X, RefreshCw, Download
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../utils/api'

const TABS = [
  { id: 'stats', label: 'Dashboard', icon: <BarChart2 size={18} /> },
  { id: 'registrations', label: 'Registrations', icon: <Users size={18} /> },
  { id: 'performances', label: 'Performances', icon: <Film size={18} /> },
]

// ── Stat Card ─────────────────────────────────────
function StatCard({ label, value, color, icon }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      padding: '24px',
      borderLeft: `5px solid ${color}`,
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ color: '#888', fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{label}</p>
          <p style={{ fontFamily: "'Baloo 2', cursive", fontSize: 40, fontWeight: 900, color, lineHeight: 1 }}>{value}</p>
        </div>
        <div style={{ background: `${color}20`, borderRadius: 12, padding: 12, color }}>{icon}</div>
      </div>
    </div>
  )
}

// ── Edit Registration Modal ─────────────────────
function EditRegModal({ reg, onClose, onSave }) {
  const [form, setForm] = useState({
    full_name: reg.full_name,
    email: reg.email,
    phone: reg.phone,
    enrollment: reg.enrollment,
    department: reg.department,
    year: reg.year,
    event_interest: reg.event_interest || '',
  })
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const { data } = await api.put(`/api/admin/registrations/${reg.id}`, form)
      onSave(data)
      toast.success('Registration updated!')
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: 20,
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: 'white', borderRadius: 20, padding: '32px', width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>Edit Registration #{reg.id}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={22} /></button>
        </div>
        {[
          ['full_name', 'Full Name', 'text'],
          ['email', 'Email', 'email'],
          ['phone', 'Phone', 'text'],
          ['college', 'College', 'text'],
          ['department', 'Department', 'text'],
          ['year', 'Year', 'text'],
          ['event_interest', 'Event Interest', 'text'],
        ].map(([key, label, type]) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 5, fontSize: 13, color: '#555' }}>{label}</label>
            <input
              type={type}
              value={form[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="form-input"
            />
          </div>
        ))}
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <button onClick={handleSave} disabled={loading} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            <Save size={16} />{loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button onClick={onClose} className="btn btn-outline">Cancel</button>
        </div>
      </div>
    </div>
  )
}

// ── Edit Performance Modal ─────────────────────
function EditPerfModal({ perf, onClose, onSave }) {
  const isNew = !perf.id
  const [form, setForm] = useState(perf)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      let data
      if (isNew) {
        const res = await api.post('/api/admin/performances', form)
        data = res.data
        toast.success('Performance added!')
      } else {
        const res = await api.put(`/api/admin/performances/${perf.id}`, form)
        data = res.data
        toast.success('Performance updated!')
      }
      onSave(data, isNew)
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: 20,
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: 'white', borderRadius: 20, padding: '32px', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>
            {isNew ? 'Add Performance' : 'Edit Performance'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={22} /></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          {[
            ['title', 'Title', 'text', '1/-1'],
            ['performer', 'Performer', 'text', ''],
            ['category', 'Category', 'text', ''],
            ['year', 'Year', 'number', ''],
            ['duration', 'Duration', 'text', ''],
            ['award', 'Award', 'text', '1/-1'],
            ['image_url', 'Image URL', 'url', '1/-1'],
            ['video_url', 'Video URL', 'url', '1/-1'],
          ].map(([key, label, type, col]) => (
            <div key={key} style={{ marginBottom: 14, gridColumn: col || 'auto' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 5, fontSize: 13, color: '#555' }}>{label}</label>
              <input
                type={type}
                value={form[key] || ''}
                onChange={e => setForm({ ...form, [key]: type === 'number' ? parseInt(e.target.value) || '' : e.target.value })}
                className="form-input"
              />
            </div>
          ))}
          <div style={{ gridColumn: '1/-1', marginBottom: 14 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 5, fontSize: 13, color: '#555' }}>Description</label>
            <textarea
              value={form.description || ''}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="form-input"
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button onClick={handleSave} disabled={loading} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
            <Save size={16} />{loading ? 'Saving...' : isNew ? 'Add Performance' : 'Save Changes'}
          </button>
          <button onClick={onClose} className="btn btn-outline">Cancel</button>
        </div>
      </div>
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('stats')
  const [stats, setStats] = useState(null)
  const [registrations, setRegistrations] = useState([])
  const [performances, setPerformances] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [editReg, setEditReg] = useState(null)
  const [editPerf, setEditPerf] = useState(null)

  const logout = () => {
    localStorage.removeItem('admin_token')
    navigate('/admin/login')
  }

  const fetchStats = useCallback(async () => {
    try { const { data } = await api.get('/api/admin/stats'); setStats(data) } catch { }
  }, [])

  const fetchRegistrations = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/api/admin/registrations?search=${encodeURIComponent(search)}`)
      setRegistrations(data)
    } catch { }
    setLoading(false)
  }, [search])

  const fetchPerformances = useCallback(async () => {
    setLoading(true)
    try { const { data } = await api.get('/api/admin/performances'); setPerformances(data) }
    catch { }
    setLoading(false)
  }, [])

  useEffect(() => { fetchStats() }, [])
  useEffect(() => { if (tab === 'registrations') fetchRegistrations() }, [tab, search])
  useEffect(() => { if (tab === 'performances') fetchPerformances() }, [tab])

  const deleteReg = async (id) => {
    if (!confirm('Delete this registration?')) return
    try {
      await api.delete(`/api/admin/registrations/${id}`)
      setRegistrations(r => r.filter(x => x.id !== id))
      fetchStats()
      toast.success('Deleted')
    } catch { toast.error('Delete failed') }
  }

  const toggleAttendance = async (id) => {
    try {
      const { data } = await api.patch(`/api/admin/registrations/${id}/attendance`)
      setRegistrations(r => r.map(x => x.id === id ? data : x))
      fetchStats()
    } catch { toast.error('Failed') }
  }

  const approveRegistration = async (id) => {
    const loadingToast = toast.loading('Approving and sending email...')
    try {
      const { data } = await api.post(`/api/admin/registrations/${id}/approve`)
      setRegistrations(r => r.map(x => x.id === id ? data : x))
      fetchStats()
      toast.dismiss(loadingToast)
      toast.success('✅ Approved! QR sent to email')
    } catch (err) { 
      toast.dismiss(loadingToast)
      toast.error('Approval failed') 
    }
  }

  const rejectRegistration = async (id) => {
    try {
      const { data } = await api.post(`/api/admin/registrations/${id}/reject`)
      setRegistrations(r => r.map(x => x.id === id ? data : x))
      fetchStats()
      toast.success('❌ Registration rejected')
    } catch { toast.error('Rejection failed') }
  }

  const deletePerf = async (id) => {
    if (!confirm('Delete this performance?')) return
    try {
      await api.delete(`/api/admin/performances/${id}`)
      setPerformances(p => p.filter(x => x.id !== id))
      toast.success('Deleted')
    } catch { toast.error('Delete failed') }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f0e8', fontFamily: "'Rajdhani', sans-serif" }}>
      {/* Sidebar */}
      <div style={{
        width: 240,
        background: '#1a1a2e',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
      }}>
        <div style={{ padding: '28px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 900, fontSize: 22, color: '#f5a623' }}>GOONJ 2026</div>
          <div style={{ fontSize: 12, color: '#666', letterSpacing: 1, textTransform: 'uppercase' }}>Admin Panel</div>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                borderRadius: 12,
                background: tab === t.id ? 'linear-gradient(135deg, #e07b00, #f5a623)' : 'transparent',
                color: tab === t.id ? 'white' : '#999',
                fontFamily: "'Baloo 2', cursive",
                fontWeight: 600,
                fontSize: 15,
                cursor: 'pointer',
                marginBottom: 4,
                transition: 'all 0.2s',
                textAlign: 'left',
              }}
            >{t.icon}{t.label}</button>
          ))}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={logout}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              width: '100%', padding: '12px 16px',
              border: 'none', borderRadius: 12,
              background: 'transparent', color: '#e74c3c',
              fontFamily: "'Baloo 2', cursive", fontWeight: 600, fontSize: 15,
              cursor: 'pointer',
            }}
          ><LogOut size={18} />Logout</button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ marginLeft: 240, flex: 1, padding: '32px', minHeight: '100vh' }}>

        {/* Stats tab */}
        {tab === 'stats' && (
          <div>
            <h1 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 30, fontWeight: 800, color: '#1a1a2e', marginBottom: 6 }}>Dashboard</h1>
            <p style={{ color: '#888', marginBottom: 32 }}>Overview of Goonj 2026 registrations</p>

            {stats ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
                <StatCard label="Total Registered" value={stats.total_registrations} color="#e07b00" icon={<Users size={24} />} />
                <StatCard label="Attended" value={stats.attended} color="#27ae60" icon={<CheckCircle size={24} />} />
                <StatCard label="Not Attended" value={stats.not_attended} color="#e74c3c" icon={<XCircle size={24} />} />
                <StatCard label="Emails Sent" value={stats.emails_sent} color="#3498db" icon={<Download size={24} />} />
              </div>
            ) : <div className="spinner" />}

            {stats && stats.total_registrations > 0 && (
              <div style={{ background: 'white', borderRadius: 16, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#1a1a2e' }}>Attendance Rate</h3>
                <div style={{ background: '#f0f0f0', borderRadius: 100, height: 20, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.round((stats.attended / stats.total_registrations) * 100)}%`,
                    background: 'linear-gradient(90deg, #e07b00, #f5a623)',
                    borderRadius: 100,
                    transition: 'width 1s ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontSize: 11, fontWeight: 700,
                  }}>
                    {Math.round((stats.attended / stats.total_registrations) * 100)}%
                  </div>
                </div>
                <p style={{ color: '#888', fontSize: 13, marginTop: 8 }}>
                  {stats.attended} out of {stats.total_registrations} registrants attended
                </p>
              </div>
            )}
          </div>
        )}

        {/* Registrations tab */}
        {tab === 'registrations' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h1 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 28, fontWeight: 800, color: '#1a1a2e' }}>Registrations</h1>
                <p style={{ color: '#888', fontSize: 14 }}>{registrations.length} records</p>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                  <input
                    type="text"
                    placeholder="Search name, email, college..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                      padding: '10px 16px 10px 38px',
                      borderRadius: 30,
                      border: '2px solid #e8d5b0',
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: 14,
                      width: 260,
                      outline: 'none',
                    }}
                  />
                </div>
                <button onClick={fetchRegistrations} className="btn btn-outline btn-sm">
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>
            </div>

            {loading ? <div className="spinner" /> : (
              <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                      <tr style={{ background: '#1a1a2e', color: 'white' }}>
                        {['ID', 'Name', 'Email', 'Department', 'Year', 'Status', 'Attendance', 'Registered', 'Actions'].map(h => (
                          <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontFamily: "'Baloo 2', cursive", fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((r, i) => (
                        <tr key={r.id} style={{ background: i % 2 === 0 ? 'white' : '#fafafa', borderBottom: '1px solid #f0e8d0' }}>
                          <td style={{ padding: '12px 16px', color: '#888', fontWeight: 600 }}>#{r.id}</td>
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1a1a2e', whiteSpace: 'nowrap' }}>{r.full_name}</td>
                          <td style={{ padding: '12px 16px', color: '#555' }}>{r.email}</td>
                          <td style={{ padding: '12px 16px', color: '#555', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.department}</td>
                          <td style={{ padding: '12px 16px', color: '#555' }}>{r.year}</td>
                          <td style={{ padding: '12px 16px' }}>
                            {r.status === "pending" && (
                              <span style={{
                                background: '#fff3cd',
                                color: '#856404',
                                padding: '4px 10px',
                                borderRadius: 12,
                                fontSize: 12,
                                fontWeight: 700
                              }}>
                                Pending
                              </span>
                            )}

                            {r.status === "approved" && (
                              <span style={{
                                background: '#d4edda',
                                color: '#155724',
                                padding: '4px 10px',
                                borderRadius: 12,
                                fontSize: 12,
                                fontWeight: 700
                              }}>
                                Approved
                              </span>
                            )}

                            {r.status === "rejected" && (
                              <span style={{
                                background: '#f8d7da',
                                color: '#721c24',
                                padding: '4px 10px',
                                borderRadius: 12,
                                fontSize: 12,
                                fontWeight: 700
                              }}>
                                Rejected
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <button
                              onClick={() => toggleAttendance(r.id)}
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '5px 14px',
                                borderRadius: 20,
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: 700,
                                fontSize: 12,
                                background: r.is_attended ? '#d4edda' : '#f8d7da',
                                color: r.is_attended ? '#155724' : '#721c24',
                              }}
                            >
                              {r.is_attended ? <><CheckCircle size={12} />Present</> : <><XCircle size={12} />Absent</>}
                            </button>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#888', fontSize: 12, whiteSpace: 'nowrap' }}>
                            {new Date(r.registered_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                              {r.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => approveRegistration(r.id)}
                                    className="btn btn-sm"
                                    style={{ background: '#d4edda', color: '#155724', border: 'none', borderRadius: 8, padding: '6px 10px', fontWeight: 600, cursor: 'pointer' }}
                                    title="Approve and send QR email"
                                  ><CheckCircle size={13} /> Approve</button>
                                  <button
                                    onClick={() => rejectRegistration(r.id)}
                                    className="btn btn-sm"
                                    style={{ background: '#f8d7da', color: '#721c24', border: 'none', borderRadius: 8, padding: '6px 10px', fontWeight: 600, cursor: 'pointer' }}
                                    title="Reject this registration"
                                  ><XCircle size={13} /> Reject</button>
                                </>
                              )}
                              <button
                                onClick={() => setEditReg(r)}
                                className="btn btn-sm"
                                style={{ background: '#e8f4fd', color: '#2980b9', border: 'none', borderRadius: 8, padding: '6px 10px' }}
                              ><Edit2 size={13} /></button>
                              <button
                                onClick={() => deleteReg(r.id)}
                                className="btn btn-sm"
                                style={{ background: '#fde8e8', color: '#c0392b', border: 'none', borderRadius: 8, padding: '6px 10px' }}
                              ><Trash2 size={13} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {registrations.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa' }}>No registrations found</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Performances tab */}
        {tab === 'performances' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h1 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 28, fontWeight: 800, color: '#1a1a2e' }}>Performances</h1>
                <p style={{ color: '#888', fontSize: 14 }}>{performances.length} records</p>
              </div>
              <button
                onClick={() => setEditPerf({ title: '', performer: '', category: '', year: new Date().getFullYear(), description: '', image_url: '', video_url: '', duration: '', award: '' })}
                className="btn btn-primary"
              ><Plus size={16} /> Add Performance</button>
            </div>

            {loading ? <div className="spinner" /> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                {performances.map(p => (
                  <div key={p.id} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #f0e8d0' }}>
                    {p.image_url && (
                      <div style={{ height: 160, background: `url(${p.image_url}) center/cover`, position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '3px 10px', borderRadius: 10, fontSize: 12, fontWeight: 600 }}>
                          {p.year}
                        </div>
                      </div>
                    )}
                    <div style={{ padding: '16px' }}>
                      <span style={{ background: '#fff3d0', color: '#7a5c00', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 10 }}>{p.category}</span>
                      <h3 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '8px 0 4px' }}>{p.title}</h3>
                      <p style={{ color: '#888', fontSize: 13, marginBottom: 12 }}>by {p.performer}</p>
                      {p.award && <p style={{ fontSize: 12, color: '#7a5c00', background: '#fff8d0', padding: '4px 10px', borderRadius: 8, marginBottom: 12 }}>🏆 {p.award}</p>}
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => setEditPerf(p)}
                          className="btn btn-sm"
                          style={{ flex: 1, justifyContent: 'center', background: '#e8f4fd', color: '#2980b9', border: 'none', borderRadius: 10 }}
                        ><Edit2 size={13} /> Edit</button>
                        <button
                          onClick={() => deletePerf(p.id)}
                          className="btn btn-sm"
                          style={{ flex: 1, justifyContent: 'center', background: '#fde8e8', color: '#c0392b', border: 'none', borderRadius: 10 }}
                        ><Trash2 size={13} /> Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {editReg && (
        <EditRegModal
          reg={editReg}
          onClose={() => setEditReg(null)}
          onSave={(updated) => {
            setRegistrations(r => r.map(x => x.id === updated.id ? updated : x))
          }}
        />
      )}

      {editPerf && (
        <EditPerfModal
          perf={editPerf}
          onClose={() => setEditPerf(null)}
          onSave={(data, isNew) => {
            if (isNew) {
              setPerformances(p => [data, ...p])
            } else {
              setPerformances(p => p.map(x => x.id === data.id ? data : x))
            }
          }}
        />
      )}
    </div>
  )
}
