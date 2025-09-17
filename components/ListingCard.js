/**
 * ListingCard Component
 * 
 * Displays individual property listing information in a card format.
 * Shows all key details from the listings table including pet-specific features.
 */

import React from 'react'

const ListingCard = ({ listing }) => {
  // Format the rent display
  const formatRent = (rent) => {
    return `£${rent?.toLocaleString() || 'TBC'}`
  }

  // Format the listing date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently listed'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  // Generate feature tags based on listing properties
  const generateFeatures = () => {
    const features = []
    
    if (listing.Furnished) features.push('Furnished')
    if (listing.Garden) features.push('Garden/Outdoor Space')
    if (listing.StairFreeAccess) features.push('Stair-Free Access')
    if (listing.HouseShare) features.push('House Share')
    if (listing.PetParkingCosts && listing.PetParkingCosts > 0) {
      features.push(`Pet Parking: £${listing.PetParkingCosts}`)
    }
    
    return features
  }

  const features = generateFeatures()

  return (
    <div className="listing-card">
      <div className="listing-card-content">
        {/* Title and Rent */}
        <h3 className="listing-title">{listing.Title || 'Property Listing'}</h3>
        <div className="listing-rent">{formatRent(listing.Rent)} pcm</div>
        
        {/* Location */}
        <div className="listing-location">{listing.Location || 'London'}</div>
        
        {/* Key Details Grid */}
        <div className="listing-details">
          <div className="listing-detail">
            <strong>Bedrooms:</strong> {listing.Bedrooms || 'TBC'}
          </div>
          <div className="listing-detail">
            <strong>Bathrooms:</strong> {listing.Baths || 'TBC'}
          </div>
          {listing.SquareFootage && (
            <div className="listing-detail">
              <strong>Size:</strong> {listing.SquareFootage} sq ft
            </div>
          )}
          <div className="listing-detail">
            <strong>Type:</strong> {listing.Furnished ? 'Furnished' : 'Unfurnished'}
          </div>
        </div>
        
        {/* Description */}
        {listing.Description && (
          <p className="listing-description">{listing.Description}</p>
        )}
        
        {/* Feature Tags */}
        {features.length > 0 && (
          <div className="listing-features">
            {features.map((feature, index) => (
              <span 
                key={index} 
                className={`feature-tag ${feature.includes('Garden') || feature.includes('Pet') ? 'pet-friendly-tag' : ''}`}
              >
                {feature}
              </span>
            ))}
          </div>
        )}
        
        {/* Meta Information */}
        <div className="listing-meta">
          <span>Listed: {formatDate(listing.Listed)}</span>
          {listing.PetParkingCosts > 0 && (
            <span className="pet-friendly-indicator">🐾 Pet-Friendly</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ListingCard