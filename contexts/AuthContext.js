/**
 * Authentication Context for PawsPlace
 * 
 * Provides authentication state and functions throughout the application.
 * Manages user login, logout, and authentication status.
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, getCurrentUser, signOutUser, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user session
    getCurrentUser().then(({ data, error }) => {
      if (data?.user && !error) {
        setUser(data.user)
        setProfile(data.user.user_metadata || {})
      }
      setLoading(false)
    })

    // Listen for auth changes only if Supabase is configured
    if (isSupabaseConfigured() && supabase && supabase.auth) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session?.user) {
            setUser(session.user)
            setProfile(session.user.user_metadata || {})
          } else {
            setUser(null)
            setProfile(null)
          }
          setLoading(false)
        }
      )

      return () => subscription.unsubscribe()
    }
  }, [])

  // Mock login function for development mode
  const mockLogin = (userData) => {
    const mockUser = {
      id: 'mock-user-id',
      email: userData.email,
      user_metadata: userData
    }
    setUser(mockUser)
    setProfile(userData)
    localStorage.setItem('mockUser', JSON.stringify(mockUser))
  }

  // Check for mock user in localStorage on load
  useEffect(() => {
    if (!loading && !user) {
      const mockUserData = localStorage.getItem('mockUser')
      if (mockUserData) {
        try {
          const mockUser = JSON.parse(mockUserData)
          setUser(mockUser)
          setProfile(mockUser.user_metadata || {})
        } catch (error) {
          console.error('Error parsing mock user data:', error)
          localStorage.removeItem('mockUser')
        }
      }
    }
  }, [loading, user])

  const logout = async () => {
    try {
      await signOutUser()
      setUser(null)
      setProfile(null)
      localStorage.removeItem('mockUser')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const value = {
    user,
    profile,
    loading,
    logout,
    mockLogin, // Expose for development use
    isAuthenticated: !!user,
    isAgent: profile?.role === 'agent',
    isAdmin: profile?.role === 'admin',
    isTenant: profile?.role === 'tenant'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}