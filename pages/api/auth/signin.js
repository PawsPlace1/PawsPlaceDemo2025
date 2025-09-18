/**
 * Sign-in API Route
 * 
 * Handles user authentication via API endpoint.
 * Alternative to direct client-side Supabase auth calls.
 */

import { signInUser } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const { data, error } = await signInUser(email, password)

    if (error) {
      return res.status(401).json({ error: error.message || 'Invalid credentials' })
    }

    res.status(200).json({ 
      success: true, 
      user: data.user,
      message: 'Login successful' 
    })

  } catch (error) {
    console.error('Sign in API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}