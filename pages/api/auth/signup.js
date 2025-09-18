/**
 * Sign-up API Route
 * 
 * Handles user registration via API endpoint.
 * Alternative to direct client-side Supabase auth calls.
 */

import { signUpUser } from '../../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password, userData } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const { data, error } = await signUpUser(email, password, userData)

    if (error) {
      return res.status(400).json({ error: error.message || 'Sign up failed' })
    }

    res.status(200).json({ 
      success: true, 
      user: data.user,
      message: 'Account created successfully' 
    })

  } catch (error) {
    console.error('Sign up API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}