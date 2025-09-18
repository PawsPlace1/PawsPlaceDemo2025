/**
 * PawsPlace Homepage
 * 
 * Main landing page featuring property listings with search, filter, and sort functionality.
 * Displays pet-friendly rental properties in London with comprehensive details.
 */

import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { fetchListings, searchListingsByLocation } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import ListingCard from '../components/ListingCard'
import SearchBar from '../components/SearchBar'
import Filters from '../components/Filters'

export default function Home() {
  const { user, profile, signOut, isAuthenticated, loading: authLoading } = useAuth()
  
  // State management
  const [listings, setListings] = useState([])
  const [filteredListings, setFilteredListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showPetFriendlyOnly, setShowPetFriendlyOnly] = useState(false)

  // Load initial listings on component mount
  useEffect(() => {
    loadListings()
  }, [])

  // Apply filters and sorting whenever relevant state changes
  useEffect(() => {
    applyFiltersAndSort()
  }, [listings, searchTerm, propertyType, sortBy, showPetFriendlyOnly]) // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Load listings from Supabase
   */
  const loadListings = async () => {
    setLoading(true)
    try {
      const data = await fetchListings()
      setListings(data)
    } catch (error) {
      console.error('Error loading listings:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle search functionality
   */
  const handleSearch = async (term) => {
    setSearchTerm(term)
    
    if (term.trim()) {
      // If there's a search term, search by location
      setLoading(true)
      try {
        const searchResults = await searchListingsByLocation(term)
        setListings(searchResults)
      } catch (error) {
        console.error('Error searching listings:', error)
      } finally {
        setLoading(false)
      }
    } else {
      // If search is cleared, reload all listings
      loadListings()
    }
  }

  /**
   * Apply filters and sorting to listings
   */
  const applyFiltersAndSort = () => {
    let filtered = [...listings]

    // Apply property type filter
    if (propertyType) {
      filtered = filtered.filter(listing => {
        switch (propertyType) {
          case 'studio':
            return listing.Bedrooms === 0
          case 'one-bed':
            return listing.Bedrooms === 1
          case 'two-bed':
            return listing.Bedrooms === 2
          case 'three-bed':
            return listing.Bedrooms >= 3
          case 'house-share':
            return listing.HouseShare === true
          case 'furnished':
            return listing.Furnished === true
          case 'unfurnished':
            return listing.Furnished === false
          default:
            return true
        }
      })
    }

    // Apply pet-friendly filter
    if (showPetFriendlyOnly) {
      filtered = filtered.filter(listing => 
        listing.PetParkingCosts > 0 || 
        listing.Garden === true ||
        listing.Description?.toLowerCase().includes('pet') ||
        listing.Description?.toLowerCase().includes('dog') ||
        listing.Description?.toLowerCase().includes('cat')
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.Listed) - new Date(a.Listed)
        case 'oldest':
          return new Date(a.Listed) - new Date(b.Listed)
        case 'cheapest':
          return (a.Rent || 0) - (b.Rent || 0)
        case 'expensive':
          return (b.Rent || 0) - (a.Rent || 0)
        case 'bedrooms-asc':
          return (a.Bedrooms || 0) - (b.Bedrooms || 0)
        case 'bedrooms-desc':
          return (b.Bedrooms || 0) - (a.Bedrooms || 0)
        default:
          return 0
      }
    })

    setFilteredListings(filtered)
  }

  return (
    <>
      <Head>
        <title>PawsPlace - Pet-Friendly Rentals in London</title>
        <meta 
          name="description" 
          content="Find pet-friendly rental properties in London. PawsPlace connects pet owners with landlords who welcome furry friends." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
      </Head>

      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo-container">
              <Image
                src="/logo.png"
                alt="PawsPlace Logo"
                width={60}
                height={60}
                className="logo"
                priority
              />
              <div className="brand-text">PawsPlace</div>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '2rem',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <div style={{ color: '#666', fontSize: '16px', textAlign: 'center' }}>
                Pet-friendly rentals in London 🐾
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {authLoading ? (
                  <div style={{ color: '#666', fontSize: '14px' }}>Loading...</div>
                ) : isAuthenticated ? (
                  <>
                    <span style={{ 
                      color: '#2d5a2d', 
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      Welcome, {profile?.first_name || user?.email?.split('@')[0]}
                      {profile?.role && (
                        <span style={{ 
                          color: '#666', 
                          fontSize: '12px',
                          marginLeft: '4px'
                        }}>
                          ({profile.role})
                        </span>
                      )}
                    </span>
                    <button
                      onClick={signOut}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'transparent',
                        color: '#2d5a2d',
                        border: '1px solid #2d5a2d',
                        borderRadius: '4px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/auth/login"
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'transparent',
                        color: '#2d5a2d',
                        border: '1px solid #2d5a2d',
                        borderRadius: '4px',
                        fontSize: '14px',
                        textDecoration: 'none',
                        display: 'inline-block'
                      }}
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/auth/signup"
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#2d5a2d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '14px',
                        textDecoration: 'none',
                        display: 'inline-block'
                      }}
                    >
                      Join as Agent
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <section className="search-filters">
        <div className="container">
          <SearchBar onSearch={handleSearch} />
          <Filters
            propertyType={propertyType}
            onPropertyTypeChange={setPropertyType}
            sortBy={sortBy}
            onSortChange={setSortBy}
            showPetFriendlyOnly={showPetFriendlyOnly}
            onPetFriendlyFilter={setShowPetFriendlyOnly}
          />
        </div>
      </section>

      {/* Main Content */}
      <main className="listings-section">
        <div className="container">
          <div className="listings-header">
            <h1 className="listings-title">
              {searchTerm ? `Properties in "${searchTerm}"` : 'Available Properties'}
            </h1>
            <div className="listings-count">
              {loading ? 'Loading...' : `${filteredListings.length} properties found`}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading">
              <p>Finding your perfect pet-friendly home...</p>
            </div>
          )}

          {/* No Results State */}
          {!loading && filteredListings.length === 0 && (
            <div className="no-listings">
              <h3>No properties found</h3>
              <p>Try adjusting your search criteria or check back later for new listings.</p>
              {searchTerm && (
                <p style={{ marginTop: '10px' }}>
                  <button 
                    onClick={() => handleSearch('')}
                    style={{
                      background: '#2563eb',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Show All Properties
                  </button>
                </p>
              )}
            </div>
          )}

          {/* Listings Grid */}
          {!loading && filteredListings.length > 0 && (
            <div className="listings-grid">
              {filteredListings.map((listing, index) => (
                <ListingCard key={listing.id || index} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ 
        background: '#f8f9fa', 
        padding: '40px 0', 
        marginTop: '60px',
        borderTop: '1px solid #e5e5e5',
        textAlign: 'center',
        color: '#666'
      }}>
        <div className="container">
          <p>Made with ❤️ by pet lovers, for pet lovers.</p>
          <p style={{ marginTop: '10px', fontSize: '14px' }}>
            Ready for future features: agent/tenant login, property management, and more!
          </p>
        </div>
      </footer>
    </>
  )
}