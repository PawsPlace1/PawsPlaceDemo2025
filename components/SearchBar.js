/**
 * SearchBar Component
 * 
 * Provides search functionality for postcode/area filtering.
 * Allows users to search for properties by location.
 */

import React, { useState } from 'react'

const SearchBar = ({ onSearch, placeholder = "Search by postcode or area (e.g., SW1, Camden, Islington...)" }) => {
  const [searchTerm, setSearchTerm] = useState('')

  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    
    // Debounce search - call onSearch after user stops typing for 300ms
    clearTimeout(handleSearchChange.timeoutId)
    handleSearchChange.timeoutId = setTimeout(() => {
      onSearch(value)
    }, 300)
  }

  // Handle search form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  // Clear search
  const clearSearch = () => {
    setSearchTerm('')
    onSearch('')
  }

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative', display: 'inline-block', width: '100%', maxWidth: '500px' }}>
          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              paddingRight: searchTerm ? '50px' : '16px'
            }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#666',
                padding: '4px'
              }}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default SearchBar