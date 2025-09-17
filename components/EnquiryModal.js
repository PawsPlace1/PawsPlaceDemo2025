/**
 * EnquiryModal Component
 * 
 * Modal form for users to enquire about property listings.
 * Collects name, email, and message for submission to Supabase or console logging.
 */

import React, { useState } from 'react'

const EnquiryModal = ({ listing, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Validate form fields
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const enquiryData = {
        listing_id: listing.id,
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        timestamp: new Date().toISOString()
      }
      
      await onSubmit(enquiryData)
      
      // Reset form and close modal on success
      setFormData({ name: '', email: '', message: '' })
      setErrors({})
      onClose()
    } catch (error) {
      console.error('Error submitting enquiry:', error)
      setErrors({ submit: 'Failed to submit enquiry. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle modal close
  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: '', email: '', message: '' })
      setErrors({})
      onClose()
    }
  }

  // Don't render if modal is not open
  if (!isOpen) return null

  return (
    <div className="enquiry-modal-overlay" onClick={handleClose}>
      <div className="enquiry-modal" onClick={(e) => e.stopPropagation()}>
        <div className="enquiry-modal-header">
          <h2>Enquire About Property</h2>
          <button 
            className="enquiry-modal-close" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>
        
        <div className="enquiry-modal-body">
          <div className="enquiry-property-info">
            <h3>{listing?.Title || 'Property Listing'}</h3>
            <p>{listing?.Location || 'London'}</p>
            <p className="enquiry-rent">£{listing?.Rent?.toLocaleString() || 'TBC'} pcm</p>
          </div>
          
          <form onSubmit={handleSubmit} className="enquiry-form">
            <div className="form-group">
              <label htmlFor="enquiry-name">Name *</label>
              <input
                type="text"
                id="enquiry-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                disabled={isSubmitting}
                placeholder="Your full name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="enquiry-email">Email *</label>
              <input
                type="email"
                id="enquiry-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                disabled={isSubmitting}
                placeholder="your.email@example.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="enquiry-message">Message *</label>
              <textarea
                id="enquiry-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={errors.message ? 'error' : ''}
                disabled={isSubmitting}
                placeholder="Tell us about your interest in this property, any questions you have, or requirements for your pets..."
                rows="4"
              />
              {errors.message && <span className="error-message">{errors.message}</span>}
            </div>
            
            {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}
            
            <div className="enquiry-form-actions">
              <button 
                type="button" 
                onClick={handleClose}
                disabled={isSubmitting}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? 'Sending...' : 'Send Enquiry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EnquiryModal