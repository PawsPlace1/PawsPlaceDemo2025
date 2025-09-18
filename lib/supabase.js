/**
 * Supabase client configuration for PawsPlace
 * 
 * This file sets up the Supabase client using environment variables.
 * Make sure to set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * in your .env.local file for local development or in Vercel environment variables.
 */

import { createClient } from '@supabase/supabase-js'

// Supabase project URL and public API key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create and export the Supabase client
// Use placeholder values for build time if environment variables are not set
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

/**
 * Check if Supabase is properly configured
 * @returns {boolean} True if Supabase credentials are set
 */
export function isSupabaseConfigured() {
  return !!(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'https://placeholder.supabase.co' && 
    supabaseAnonKey !== 'placeholder-key')
}

/**
 * Fetch all listings from the 'listings' table
 * @returns {Promise<Array>} Array of listing objects
 */
export async function fetchListings() {
  // Return mock data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return getMockListings()
  }

  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('Listed', { ascending: false }) // Show newest listings first by default

    if (error) {
      console.error('Error fetching listings:', error)
      return getMockListings() // Return mock data on error
    }

    return data || []
  } catch (error) {
    console.error('Error in fetchListings:', error)
    return getMockListings() // Return mock data on error
  }
}

/**
 * Search listings by location (postcode/area)
 * @param {string} searchTerm - The location search term
 * @returns {Promise<Array>} Array of filtered listing objects
 */
export async function searchListingsByLocation(searchTerm) {
  // Return filtered mock data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    const mockData = getMockListings()
    return mockData.filter(listing => 
      listing.Location.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .ilike('Location', `%${searchTerm}%`)
      .order('Listed', { ascending: false })

    if (error) {
      console.error('Error searching listings:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in searchListingsByLocation:', error)
    return []
  }
}

/**
 * Filter listings by property type
 * Note: This assumes property type can be derived from other fields
 * You can modify this based on your exact database schema
 * @param {string} propertyType - The type of property to filter by
 * @returns {Promise<Array>} Array of filtered listing objects
 */
export async function filterListingsByType(propertyType) {
  // Return filtered mock data if Supabase is not configured
  if (!isSupabaseConfigured()) {
    return getMockListings()
  }

  try {
    // This is a basic implementation - you may need to adjust based on your schema
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .gte('Bedrooms', propertyType === 'studio' ? 0 : 1)
      .order('Listed', { ascending: false })

    if (error) {
      console.error('Error filtering listings:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in filterListingsByType:', error)
    return []
  }
}

// ==================== AUTHENTICATION FUNCTIONS ====================

/**
 * Sign up a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role (admin, agent, tenant)
 * @returns {Promise<Object>} Signup result with user data or error
 */
export async function signUpUser(email, password, role = 'tenant') {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, using mock authentication')
    return { 
      user: { id: 'mock-user', email, role }, 
      error: null,
      mockMode: true 
    }
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role
        }
      }
    })

    if (error) {
      return { user: null, error }
    }

    return { user: data.user, error: null }
  } catch (error) {
    console.error('Error in signUpUser:', error)
    return { user: null, error }
  }
}

/**
 * Sign in an existing user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Login result with user data or error
 */
export async function signInUser(email, password) {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, using mock authentication')
    return { 
      user: { id: 'mock-user', email, role: 'tenant' }, 
      error: null,
      mockMode: true 
    }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return { user: null, error }
    }

    return { user: data.user, error: null }
  } catch (error) {
    console.error('Error in signInUser:', error)
    return { user: null, error }
  }
}

/**
 * Sign out the current user
 * @returns {Promise<Object>} Signout result
 */
export async function signOutUser() {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, using mock authentication')
    return { error: null, mockMode: true }
  }

  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    console.error('Error in signOutUser:', error)
    return { error }
  }
}

/**
 * Get the current authenticated user
 * @returns {Promise<Object>} Current user or null
 */
export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    return null
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting current user:', error)
      return null
    }

    return user
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

/**
 * Get user role from user metadata
 * @param {Object} user - User object from Supabase
 * @returns {string} User role (admin, agent, tenant)
 */
export function getUserRole(user) {
  if (!user) return null
  return user.user_metadata?.role || 'tenant'
}

/**
 * Listen to authentication state changes
 * @param {Function} callback - Callback function to handle auth state changes
 * @returns {Function} Unsubscribe function
 */
export function onAuthStateChange(callback) {
  if (!isSupabaseConfigured()) {
    return () => {} // Return empty unsubscribe function
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
  return () => subscription.unsubscribe()
}

/**
 * Mock data for development and demonstration purposes
 * @returns {Array} Array of mock listing objects
 */
function getMockListings() {
  return [
    {
      id: 1,
      Title: "Spacious 2-Bedroom Flat in Camden",
      Rent: 2200,
      Listed: "2024-01-15T10:00:00Z",
      Bedrooms: 2,
      Baths: 1,
      Location: "Camden, NW1",
      Description: "Beautiful 2-bedroom apartment with large windows and pet-friendly amenities. Close to Camden Market and tube station. Garden access available for pets.",
      Furnished: true,
      Garden: true,
      SquareFootage: 850,
      PetParkingCosts: 50,
      StairFreeAccess: false,
      HouseShare: false
    },
    {
      id: 2,
      Title: "Modern Studio with Pet-Friendly Courtyard",
      Rent: 1650,
      Listed: "2024-01-12T14:30:00Z",
      Bedrooms: 0,
      Baths: 1,
      Location: "Islington, N1",
      Description: "Contemporary studio apartment with access to shared courtyard. Perfect for pet owners with small to medium pets. Utilities included.",
      Furnished: true,
      Garden: true,
      SquareFootage: 400,
      PetParkingCosts: 25,
      StairFreeAccess: true,
      HouseShare: false
    },
    {
      id: 3,
      Title: "3-Bedroom House with Large Garden",
      Rent: 3200,
      Listed: "2024-01-10T09:15:00Z",
      Bedrooms: 3,
      Baths: 2,
      Location: "Clapham, SW4",
      Description: "Charming Victorian house with large private garden. Perfect for families with pets. Recently renovated kitchen and bathrooms.",
      Furnished: false,
      Garden: true,
      SquareFootage: 1200,
      PetParkingCosts: 0,
      StairFreeAccess: false,
      HouseShare: false
    },
    {
      id: 4,
      Title: "Room in Pet-Friendly House Share",
      Rent: 950,
      Listed: "2024-01-08T16:45:00Z",
      Bedrooms: 1,
      Baths: 1,
      Location: "Hackney, E8",
      Description: "Large double room in friendly house share. Current housemates have cats and are very welcoming to pets. Shared garden and living spaces.",
      Furnished: true,
      Garden: true,
      SquareFootage: 180,
      PetParkingCosts: 15,
      StairFreeAccess: true,
      HouseShare: true
    },
    {
      id: 5,
      Title: "Luxury 1-Bedroom with Balcony",
      Rent: 2800,
      Listed: "2024-01-05T11:20:00Z",
      Bedrooms: 1,
      Baths: 1,
      Location: "Canary Wharf, E14",
      Description: "High-specification apartment with private balcony and concierge service. Pet washing station in building. River views.",
      Furnished: true,
      Garden: false,
      SquareFootage: 650,
      PetParkingCosts: 100,
      StairFreeAccess: true,
      HouseShare: false
    }
  ]
}