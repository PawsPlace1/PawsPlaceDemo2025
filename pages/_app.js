/**
 * Next.js App Component
 * 
 * This component wraps all pages and handles global configuration.
 * Imports global CSS and provides authentication context to all pages.
 */

import '../styles/globals.css'
import { AuthProvider } from '../lib/AuthContext'

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp