/**
 * Filters Component
 * 
 * Provides filtering and sorting options for property listings.
 * Includes property type filter and sort options that are easily extendable.
 */

import React from 'react'

const Filters = ({ 
  onPropertyTypeChange, 
  onSortChange, 
  propertyType = '', 
  sortBy = 'newest',
  onPetFriendlyFilter,
  showPetFriendlyOnly = false
}) => {
  
  // Property type options (easily extendable)
  const propertyTypes = [
    { value: '', label: 'All Property Types' },
    { value: 'studio', label: 'Studio' },
    { value: 'one-bed', label: '1 Bedroom' },
    { value: 'two-bed', label: '2 Bedrooms' },
    { value: 'three-bed', label: '3+ Bedrooms' },
    { value: 'house-share', label: 'House Share' },
    { value: 'furnished', label: 'Furnished Only' },
    { value: 'unfurnished', label: 'Unfurnished Only' }
  ]

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'cheapest', label: 'Price: Low to High' },
    { value: 'expensive', label: 'Price: High to Low' },
    { value: 'bedrooms-asc', label: 'Bedrooms: Low to High' },
    { value: 'bedrooms-desc', label: 'Bedrooms: High to Low' }
  ]

  return (
    <div className="filters-container">
      {/* Property Type Filter */}
      <div className="filter-group">
        <label className="filter-label" htmlFor="property-type">
          Property Type
        </label>
        <select
          id="property-type"
          className="filter-select"
          value={propertyType}
          onChange={(e) => onPropertyTypeChange(e.target.value)}
        >
          {propertyTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort Options */}
      <div className="filter-group">
        <label className="filter-label" htmlFor="sort-by">
          Sort By
        </label>
        <select
          id="sort-by"
          className="filter-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Pet-Friendly Filter */}
      <div className="filter-group">
        <label className="filter-label">
          <input
            type="checkbox"
            checked={showPetFriendlyOnly}
            onChange={(e) => onPetFriendlyFilter(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Pet-Friendly Only 🐾
        </label>
      </div>

      {/* Future filter placeholder - easily extendable */}
      {/* 
      <div className="filter-group">
        <label className="filter-label" htmlFor="price-range">
          Price Range
        </label>
        <select id="price-range" className="filter-select">
          <option value="">Any Price</option>
          <option value="0-1000">Under £1,000</option>
          <option value="1000-2000">£1,000 - £2,000</option>
          <option value="2000-3000">£2,000 - £3,000</option>
          <option value="3000+">£3,000+</option>
        </select>
      </div>
      */}
    </div>
  )
}

export default Filters