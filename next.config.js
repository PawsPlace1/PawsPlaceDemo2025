/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Image optimization configuration
  images: {
    domains: ['localhost'], // Add your image domains here
    // For Vercel deployment, you might want to add your domain
    // domains: ['your-domain.com'],
  },

  // Environment variables that should be available on the client side
  // These are already handled by NEXT_PUBLIC_ prefix, but good to document
  env: {
    // Custom environment variables can be added here
  },

  // Optional: Custom webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Perform customizations to webpack config
    // Important: return the modified config
    return config
  },

  // Optional: Redirects for better SEO
  async redirects() {
    return [
      // Add any redirects here
    ]
  },

  // Optional: Headers for security
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig