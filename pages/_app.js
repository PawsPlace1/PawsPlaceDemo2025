/**
 * Next.js App Component
 * 
 * This component wraps all pages and handles global configuration.
 * Imports global CSS and can be extended for global state management.
 */

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp