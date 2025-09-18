/**
 * Agent Login Page
 * 
 * Login form for real estate agents and other users.
 * Handles authentication and redirects appropriately.
 */

import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signIn } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

export default function Login() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { message } = router.query
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    
    try {
      const { data, error } = await signIn(formData.email, formData.password)

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ submit: 'Invalid email or password. Please try again.' })
        } else if (error.message.includes('Email not confirmed')) {
          setErrors({ submit: 'Please check your email and confirm your account before logging in.' })
        } else {
          setErrors({ submit: error.message })
        }
      } else {
        // Successful login - context will handle the redirect
        router.push('/')
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Agent Login - PawsPlace</title>
        <meta name="description" content="Sign in to your PawsPlace agent account" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>

      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8fffe',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ 
              color: '#2d5a2d', 
              fontSize: '2rem', 
              marginBottom: '0.5rem',
              fontWeight: 'bold'
            }}>
              Welcome Back
            </h1>
            <p style={{ color: '#666', fontSize: '16px' }}>
              Sign in to your PawsPlace account
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div style={{ 
              backgroundColor: '#d4edda',
              color: '#155724',
              padding: '0.75rem',
              borderRadius: '4px',
              marginBottom: '1rem',
              fontSize: '14px'
            }}>
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: '#333'
              }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${errors.email ? '#dc3545' : '#ddd'}`,
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <span style={{ color: '#dc3545', fontSize: '14px' }}>
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: '#333'
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${errors.password ? '#dc3545' : '#ddd'}`,
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                placeholder="Enter your password"
              />
              {errors.password && (
                <span style={{ color: '#dc3545', fontSize: '14px' }}>
                  {errors.password}
                </span>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div style={{ 
                backgroundColor: '#f8d7da',
                color: '#721c24',
                padding: '0.75rem',
                borderRadius: '4px',
                marginBottom: '1rem',
                fontSize: '14px'
              }}>
                {errors.submit}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: loading ? '#ccc' : '#2d5a2d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '1rem'
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Forgot Password */}
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <a 
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  alert('Password reset functionality will be available soon!')
                }}
                style={{ 
                  color: '#2d5a2d', 
                  textDecoration: 'none', 
                  fontSize: '14px'
                }}
              >
                Forgot your password?
              </a>
            </div>
          </form>

          {/* Footer */}
          <div style={{ 
            textAlign: 'center', 
            padding: '1rem 0',
            borderTop: '1px solid #eee'
          }}>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Don&apos;t have an account?{' '}
              <Link 
                href="/auth/signup" 
                style={{ color: '#2d5a2d', textDecoration: 'none', fontWeight: '500' }}
              >
                Sign up as an agent
              </Link>
            </p>
            <p style={{ color: '#666', fontSize: '14px', marginTop: '0.5rem' }}>
              <Link 
                href="/" 
                style={{ color: '#2d5a2d', textDecoration: 'none' }}
              >
                ← Back to PawsPlace
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}