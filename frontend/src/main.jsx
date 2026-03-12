import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'

import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import PerformancesPage from './pages/PerformancesPage'
import QRScannerPage from './pages/QRScannerPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: "'Baloo 2', cursive",
            fontWeight: 600,
            borderRadius: '12px',
          },
          success: { style: { background: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' } },
          error: { style: { background: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' } },
        }}
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/performances" element={<PerformancesPage />} />
        <Route path="/scanner" element={<QRScannerPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
