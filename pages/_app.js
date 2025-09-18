/**
 * Next.js App Component
 * 
 * This component wraps all pages and handles global configuration.
 * Imports global CSS and provides authentication context.
 */

import '../styles/globals.css'
import { AuthProvider } from '../contexts/AuthContext'

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp