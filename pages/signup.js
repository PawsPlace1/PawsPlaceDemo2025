/**
 * Sign Up Page for PawsPlace
 * 
 * Allows new users to create an account with their chosen role.
 * Supports admin, agent, and tenant roles.
 */

import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signUpUser } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('tenant')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    try {
      const { user, error, mockMode } = await signUpUser(email, password, role)

      if (error) {
        setError(error.message || 'Failed to create account')
      } else {
        if (mockMode) {
          setSuccess('Account created successfully! (Mock mode - check console)')
          console.log('Mock user created:', { email, role })
        } else {
          setSuccess('Account created successfully! Please check your email to verify your account.')
        }
        
        // Clear form
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setRole('tenant')
        
        // Redirect to login after short delay
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Signup error:', err)
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
        <title>Sign Up - PawsPlace</title>
        <meta name="description" content="Create your PawsPlace account" />
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

        {/* Sign Up Form */}
        <main className="auth-main">
          <div className="auth-container">
            <div className="auth-card">
              <h1>Create Your Account</h1>
              <p className="auth-subtitle">Join the PawsPlace community</p>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

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
                  <label htmlFor="role">I am a...</label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  >
                    <option value="tenant">Tenant (Looking for pet-friendly rentals)</option>
                    <option value="agent">Agent/Landlord (Listing properties)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="At least 6 characters"
                    minLength="6"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm your password"
                    minLength="6"
                  />
                </div>

                <button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <div className="auth-links">
                <p>
                  Already have an account?{' '}
                  <Link href="/login">Sign in here</Link>
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

        .form-group input,
        .form-group select {
          padding: 12px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
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

        .success-message {
          background: #f0fff4;
          color: #22543d;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #c6f6d5;
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