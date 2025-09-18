/**
 * Login Page for PawsPlace
 * 
 * Allows existing users to sign in to their account.
 */

import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signInUser } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const { isAuthenticated, updateAuthState } = useAuth()

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      const { user, error, mockMode } = await signInUser(email, password)

      if (error) {
        setError(error.message || 'Failed to sign in')
      } else {
        if (mockMode) {
          console.log('Mock user signed in:', { email })
          // Update auth state manually for mock mode
          const mockUser = { id: 'mock-user', email }
          const mockRole = email.includes('admin') ? 'admin' : 
                           email.includes('agent') ? 'agent' : 'tenant'
          updateAuthState(mockUser, mockRole)
        }
        
        // Redirect to homepage
        router.push('/')
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (isAuthenticated) {
    return null // Will redirect
  }

  return (
    <>
      <Head>
        <title>Sign In - PawsPlace</title>
        <meta name="description" content="Sign in to your PawsPlace account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <div className="auth-page">
        {/* Header */}
        <header className="header">
          <div className="container">
            <div className="header-content">
              <Link href="/" className="logo-container">
                <Image
                  src="/logo.png"
                  alt="PawsPlace Logo"
                  width={60}
                  height={60}
                  className="logo"
                  priority
                />
                <div className="brand-text">PawsPlace</div>
              </Link>
            </div>
          </div>
        </header>

        {/* Login Form */}
        <main className="auth-main">
          <div className="auth-container">
            <div className="auth-card">
              <h1>Welcome Back</h1>
              <p className="auth-subtitle">Sign in to your PawsPlace account</p>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Your password"
                  />
                </div>

                <button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <div className="demo-credentials">
                <h3>Demo Credentials</h3>
                <p><strong>Tenant:</strong> tenant@demo.com / password</p>
                <p><strong>Agent:</strong> agent@demo.com / password</p>
                <p><strong>Admin:</strong> admin@demo.com / password</p>
              </div>

              <div className="auth-links">
                <p>
                  Don&apos;t have an account?{' '}
                  <Link href="/signup">Create one here</Link>
                </p>
                <p>
                  <Link href="/">← Back to PawsPlace</Link>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .auth-main {
          padding: 40px 20px;
        }

        .auth-container {
          max-width: 400px;
          margin: 0 auto;
        }

        .auth-card {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
        }

        .auth-card h1 {
          text-align: center;
          margin-bottom: 8px;
          color: #333;
          font-size: 28px;
        }

        .auth-subtitle {
          text-align: center;
          color: #666;
          margin-bottom: 30px;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 600;
          color: #333;
        }

        .form-group input {
          padding: 12px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #667eea;
        }

        .auth-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 15px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .auth-button:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .auth-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .demo-credentials {
          margin: 30px 0;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .demo-credentials h3 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 16px;
        }

        .demo-credentials p {
          margin: 8px 0;
          font-size: 14px;
          color: #555;
        }

        .auth-links {
          margin-top: 30px;
          text-align: center;
        }

        .auth-links p {
          margin: 10px 0;
          color: #666;
        }

        .auth-links a {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
        }

        .auth-links a:hover {
          text-decoration: underline;
        }

        .error-message {
          background: #fee;
          color: #c53030;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #fed7d7;
          margin-bottom: 20px;
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: inherit;
        }

        .brand-text {
          font-size: 28px;
          font-weight: bold;
          color: #333;
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 30px 20px;
          }
          
          .auth-card h1 {
            font-size: 24px;
          }
        }
      `}</style>
    </>
  )
}