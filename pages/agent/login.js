/**
 * Agent Login Page
 * 
 * Login form specifically for agents to access their accounts.
 * Handles authentication and redirects to appropriate dashboard.
 */

import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { signInUser, isSupabaseConfigured } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

export default function AgentLogin() {
  const router = useRouter()
  const { isAuthenticated, mockLogin } = useAuth()
  const { message } = router.query // Success message from signup
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('') // Clear error when user types
  }

  const validateForm = () => {
    if (!formData.email.trim()) {
      return 'Email is required'
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return 'Please enter a valid email address'
    }
    if (!formData.password) {
      return 'Password is required'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError('')

    try {
      // For development mode without Supabase, use mock authentication
      if (!isSupabaseConfigured()) {
        // Mock authentication - simulate successful login
        const mockUserData = {
          name: 'Test Agent',
          email: formData.email.trim(),
          role: 'agent',
          company: 'Test Estate Agency'
        }
        
        mockLogin(mockUserData)
        router.push('/')
        return
      }

      const { data, error: signInError } = await signInUser(
        formData.email.trim(),
        formData.password
      )

      if (signInError) {
        setError(signInError.message || 'Invalid email or password')
        return
      }

      if (data?.user) {
        // Successful login - redirect to home page
        router.push('/')
      }

    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Agent Login - PawsPlace</title>
        <meta name="description" content="Login to your PawsPlace agent account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        {/* Header */}
        <header style={{ background: 'white', borderBottom: '1px solid #e5e5e5', padding: '20px 0' }}>
          <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Image
                src="/logo.png"
                alt="PawsPlace Logo"
                width={40}
                height={40}
                priority
              />
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#2563eb' }}>PawsPlace</span>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ padding: '60px 20px' }}>
          <div style={{ maxWidth: '450px', margin: '0 auto' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
                  Agent Login
                </h1>
                <p style={{ color: '#666', fontSize: '16px' }}>
                  Welcome back! Sign in to your agent account
                </p>
              </div>

              {message && (
                <div style={{ 
                  background: '#dff0d8', 
                  border: '1px solid #d6e9c6', 
                  color: '#3c763d', 
                  padding: '12px', 
                  borderRadius: '4px', 
                  marginBottom: '20px',
                  fontSize: '14px'
                }}>
                  {message}
                </div>
              )}

              {error && (
                <div style={{ 
                  background: '#fee', 
                  border: '1px solid #fcc', 
                  color: '#c33', 
                  padding: '12px', 
                  borderRadius: '4px', 
                  marginBottom: '20px',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter your email address"
                  />
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '16px',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: loading ? '#ccc' : '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                <p style={{ color: '#666', fontSize: '14px' }}>
                  Don&apos;t have an account?{' '}
                  <Link href="/agent/signup" style={{ color: '#2563eb', textDecoration: 'none' }}>
                    Sign up here
                  </Link>
                </p>
              </div>

              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <Link href="/" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>
                  ← Back to Properties
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}