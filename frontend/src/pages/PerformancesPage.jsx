import React, { useState, useEffect } from 'react'
import { Award, Clock, User, Filter } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../utils/api'

const CATEGORIES = ['All', 'Classical Dance', 'Folk Dance', 'Western Dance', 'Music', 'Group Singing', 'Drama', 'Mime', 'Instrumental']

const categoryColors = {
  'Classical Dance': '#8e44ad',
  'Folk Dance': '#e07b00',
  'Western Dance': '#2980b9',
  'Music': '#27ae60',
  'Group Singing': '#16a085',
  'Drama': '#c0392b',
  'Mime': '#34495e',
  'Instrumental': '#f39c12',
}

function PerformanceCard({ p }) {
  const color = categoryColors[p.category] || '#e07b00'
  return (
    <div style={{
      background: 'white',
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #f0e0c0',
      transition: 'all 0.3s',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.15)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'
      }}
    >
      {/* Image */}
      <div style={{
        height: 200,
        background: p.image_url ? `url(${p.image_url}) center/cover` : `linear-gradient(135deg, ${color}22, ${color}44)`,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          top: 12,
          left: 12,
          background: color,
          color: 'white',
          borderRadius: 20,
          padding: '4px 12px',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 0.5,
        }}>{p.category}</div>
        {p.year && (
          <div style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            borderRadius: 20,
            padding: '4px 12px',
            fontSize: 12,
            fontWeight: 700,
          }}>{p.year}</div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        <h3 style={{
          fontFamily: "'Baloo 2', cursive",
          fontSize: 20,
          fontWeight: 700,
          color: '#1a1a2e',
          marginBottom: 4,
          lineHeight: 1.3,
        }}>{p.title}</h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#7a5c3a', fontSize: 13, marginBottom: 10 }}>
          <User size={13} /><span>{p.performer}</span>
        </div>

        {p.description && (
          <p style={{
            color: '#666',
            fontSize: 13,
            lineHeight: 1.7,
            marginBottom: 12,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>{p.description}</p>
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 'auto' }}>
          {p.duration && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: '#f0f0f0', borderRadius: 20, padding: '3px 10px',
              fontSize: 12, color: '#555',
            }}>
              <Clock size={11} />{p.duration}
            </span>
          )}
          {p.award && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: '#fff8d0', borderRadius: 20, padding: '3px 10px',
              fontSize: 12, color: '#7a5c00', fontWeight: 600,
            }}>
              <Award size={11} />🏆 {p.award}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PerformancesPage() {
  const [performances, setPerformances] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')
  const [yearFilter, setYearFilter] = useState('All')

  useEffect(() => {
    api.get('/api/performances/')
      .then(({ data }) => setPerformances(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const years = ['All', ...new Set(performances.map(p => p.year))].sort((a, b) => b - a)

  const filtered = performances.filter(p => {
    const catMatch = category === 'All' || p.category === category
    const yearMatch = yearFilter === 'All' || p.year === parseInt(yearFilter)
    return catMatch && yearMatch
  })

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1a4a 50%, #1a1a2e 100%)',
        padding: '120px 24px 60px',
        textAlign: 'center',
      }}>
        <h1 style={{ fontFamily: "'Baloo 2', cursive", fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 900, color: '#f5a623', marginBottom: 8 }}>
          Past Performances
        </h1>
        <p style={{ color: '#ccc', fontSize: 16 }}>Reliving the magic from previous editions of Goonj</p>
      </div>

      <div style={{ background: '#fff8f0', minHeight: '60vh', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Filters */}
          <div style={{
            background: 'white',
            borderRadius: 16,
            padding: '20px 24px',
            marginBottom: 36,
            boxShadow: '0 2px 12px rgba(224,123,0,0.1)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#7a5c3a', fontWeight: 600 }}>
              <Filter size={16} /> Filter:
            </div>

            {/* Year filter */}
            <select
              value={yearFilter}
              onChange={e => setYearFilter(e.target.value)}
              style={{
                padding: '8px 16px',
                borderRadius: 30,
                border: '2px solid #e8d5b0',
                fontFamily: "'Baloo 2', cursive",
                fontWeight: 600,
                background: 'white',
                cursor: 'pointer',
              }}
            >
              {years.map(y => <option key={y} value={y}>{y === 'All' ? 'All Years' : `Year ${y}`}</option>)}
            </select>

            {/* Category pills */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: 30,
                    border: '2px solid',
                    borderColor: category === cat ? '#e07b00' : '#e8d5b0',
                    background: category === cat ? '#e07b00' : 'white',
                    color: category === cat ? 'white' : '#7a5c3a',
                    fontFamily: "'Baloo 2', cursive",
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >{cat}</button>
              ))}
            </div>
          </div>

          {/* Count */}
          <p style={{ color: '#7a5c3a', fontSize: 14, marginBottom: 24, fontWeight: 600 }}>
            Showing {filtered.length} performance{filtered.length !== 1 ? 's' : ''}
          </p>

          {loading ? (
            <div className="spinner" />
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎭</div>
              <p>No performances found for these filters</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 24,
            }}>
              {filtered.map(p => <PerformanceCard key={p.id} p={p} />)}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
