/**
 * Agent Sign Up Page
 * 
 * Registration form specifically for real estate agents.
 * Includes role validation and profile setup.
 */

import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { signUp } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'

export default function AgentSignUp() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    agency: '',
    phone: ''
  })
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
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
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        'agent',
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          agency: formData.agency,
          phone: formData.phone,
          full_name: `${formData.firstName} ${formData.lastName}`
        }
      )

      if (error) {
        setErrors({ submit: error.message })
      } else {
        setSuccess(true)
        // Redirect to login after successful signup
        setTimeout(() => {
          router.push('/auth/login?message=Please check your email to verify your account')
        }, 2000)
      }
    } catch (error) {
      console.error('Signup error:', error)
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8fffe' 
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{ color: '#2d5a2d', fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ color: '#2d5a2d', marginBottom: '1rem' }}>Account Created!</h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Please check your email to verify your account before logging in.
          </p>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Redirecting to login page...
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Agent Sign Up - PawsPlace</title>
        <meta name="description" content="Join PawsPlace as a real estate agent" />
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
          maxWidth: '500px'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ 
              color: '#2d5a2d', 
              fontSize: '2rem', 
              marginBottom: '0.5rem',
              fontWeight: 'bold'
            }}>
              Join PawsPlace as an Agent
            </h1>
            <p style={{ color: '#666', fontSize: '16px' }}>
              Help pet owners find their perfect home
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: '#333'
                }}>
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.firstName ? '#dc3545' : '#ddd'}`,
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}
                  placeholder="John"
                />
                {errors.firstName && (
                  <span style={{ color: '#dc3545', fontSize: '14px' }}>
                    {errors.firstName}
                  </span>
                )}
              </div>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: '#333'
                }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: `1px solid ${errors.lastName ? '#dc3545' : '#ddd'}`,
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}
                  placeholder="Smith"
                />
                {errors.lastName && (
                  <span style={{ color: '#dc3545', fontSize: '14px' }}>
                    {errors.lastName}
                  </span>
                )}
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: '#333'
              }}>
                Email Address *
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
                placeholder="john.smith@agency.com"
              />
              {errors.email && (
                <span style={{ color: '#dc3545', fontSize: '14px' }}>
                  {errors.email}
                </span>
              )}
            </div>

            {/* Phone */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: '#333'
              }}>
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${errors.phone ? '#dc3545' : '#ddd'}`,
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                placeholder="+44 20 1234 5678"
              />
              {errors.phone && (
                <span style={{ color: '#dc3545', fontSize: '14px' }}>
                  {errors.phone}
                </span>
              )}
            </div>

            {/* Agency */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: '#333'
              }}>
                Agency/Company (Optional)
              </label>
              <input
                type="text"
                name="agency"
                value={formData.agency}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                placeholder="Pet-Friendly Properties Ltd"
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: '#333'
              }}>
                Password *
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
                placeholder="At least 6 characters"
              />
              {errors.password && (
                <span style={{ color: '#dc3545', fontSize: '14px' }}>
                  {errors.password}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: '#333'
              }}>
                Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `1px solid ${errors.confirmPassword ? '#dc3545' : '#ddd'}`,
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <span style={{ color: '#dc3545', fontSize: '14px' }}>
                  {errors.confirmPassword}
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
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creating Account...' : 'Create Agent Account'}
            </button>
          </form>

          {/* Footer */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '1.5rem',
            padding: '1rem 0',
            borderTop: '1px solid #eee'
          }}>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Already have an account?{' '}
              <Link 
                href="/auth/login" 
                style={{ color: '#2d5a2d', textDecoration: 'none', fontWeight: '500' }}
              >
                Sign in here
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