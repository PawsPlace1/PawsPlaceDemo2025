/**
 * Authentication Context for PawsPlace
 * 
 * Provides authentication state management throughout the application.
 * Handles user login, logout, and role-based access.
 */

import React, { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentUser, onAuthStateChange, getUserRole, isSupabaseConfigured } from './supabase'

const AuthContext = createContext({})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  // Function to manually update auth state (for mock mode)
  const updateAuthState = (newUser, newRole) => {
    setUser(newUser)
    setRole(newRole)
    setLoading(false)
  }

  useEffect(() => {
    // Get initial user state
    getCurrentUser().then((user) => {
      setUser(user)
      setRole(getUserRole(user))
      setLoading(false)
    })

    // Listen for auth state changes (only if Supabase is configured)
    if (isSupabaseConfigured()) {
      const unsubscribe = onAuthStateChange((event, session) => {
        setUser(session?.user || null)
        setRole(getUserRole(session?.user))
        setLoading(false)
      })
      return unsubscribe
    } else {
      // In mock mode, just set loading to false
      setLoading(false)
      return () => {}
    }
  }, [])

  const value = {
    user,
    role,
    loading,
    isAuthenticated: !!user,
    isAdmin: role === 'admin',
    isAgent: role === 'agent',
    isTenant: role === 'tenant',
    updateAuthState // Expose for mock mode
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}