/**
 * Authentication Context for PawsPlace
 * 
 * Provides authentication state and functions to all components.
 * Handles user login, logout, and profile management.
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, onAuthStateChange, getUserProfile, signOut as supabaseSignOut } from '../lib/supabase'

// Create the auth context
const AuthContext = createContext({})

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial auth state
    getCurrentUser().then(initialUser => {
      setUser(initialUser)
      if (initialUser) {
        getUserProfile(initialUser.id).then(setProfile)
      }
      setLoading(false)
    })

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null
      setUser(currentUser)
      
      if (currentUser) {
        // Fetch user profile when user logs in
        const userProfile = await getUserProfile(currentUser.id)
        setProfile(userProfile)
      } else {
        // Clear profile when user logs out
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  // Sign out function
  const signOut = async () => {
    try {
      await supabaseSignOut()
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = {
    user,
    profile,
    loading,
    signOut,
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

export default AuthContext