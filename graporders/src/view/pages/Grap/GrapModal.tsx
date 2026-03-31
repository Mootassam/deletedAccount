import React, { useState } from 'react';
import Dates from 'src/view/shared/utils/Dates';
import { i18n } from '../../../i18n';

// Helper function to generate random review data
const generateRandomReviewData = () => {
  // Generate random rating between 4.0 and 5.0 (with 1 decimal place)
  const rating = (Math.random() * 1 + 4).toFixed(1); // 4.0 to 5.0
  
  // Generate random number of reviews between 100 and 5,000
  const reviewCount = Math.floor(Math.random() * 4900) + 100; // 100 to 5,000
  
  // Format the number with commas
  const formattedReviewCount = reviewCount.toLocaleString();
  
  return { rating, reviewCount: formattedReviewCount };
};

// ----------------------------------------------------------------------
// RateModal Component (inner)
// ----------------------------------------------------------------------
interface RateModalProps {
  onClose: () => void;
  onSubmit: (rating: number) => void;
}

function RateModal({ onClose, onSubmit }: RateModalProps) {
  const options = [
    i18n('pages.grap.rateModal.options.0'),
    i18n('pages.grap.rateModal.options.1'),
    i18n('pages.grap.rateModal.options.2'),
    i18n('pages.grap.rateModal.options.3'),
    i18n('pages.grap.rateModal.options.4'),
    i18n('pages.grap.rateModal.options.5'),
    i18n('pages.grap.rateModal.options.6'),
  ];

  const [selected, setSelected] = useState<boolean[]>(() =>
    options.map((_, index) => index === 0)
  );

  const [rating, setRating] = useState<number>(4);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const toggleCheckbox = (index: number) => {
    setSelected((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const handleSubmit = () => {
    onSubmit(rating);
    onClose();
  };

  const getPreviewText = () => {
    const selectedOptions = options.filter((_, idx) => selected[idx]);
    if (selectedOptions.length === 0) return i18n('pages.grap.rateModal.selectOptions');
    if (selectedOptions.length === 1) return `“${selectedOptions[0]}”`;
    return `“${selectedOptions[0]}” +${selectedOptions.length - 1} ${i18n('pages.grap.rateModal.more')}`;
  };

  const renderStars = () => {
    const stars: JSX.Element[] = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= (hoverRating || rating);
      stars.push(
        <i
          key={i}
          className={`fas fa-star ${isFilled ? 'rate-star-filled' : 'rate-star-empty'}`}
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
          style={{ cursor: 'pointer', transition: 'all 0.1s ease' }}
        ></i>
      );
    }
    return stars;
  };

  return (
    <div className="rate-modal-overlay" onClick={onClose}>
      <div className="rate-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rate-modal-header">
          <h2>{i18n('pages.grap.rateModal.title')}</h2>
          <div className="rate-close-icon" onClick={onClose}>
            <i className="fas fa-times"></i>
          </div>
        </div>

        <div className="rate-rating-section">
          <div className="rate-stars-container interactive">
            {renderStars()}
          </div>
          <div className="rate-rating-label">
            {rating === 0 && i18n('pages.grap.rateModal.label.tapToRate')}
            {rating === 1 && i18n('pages.grap.rateModal.label.poor')}
            {rating === 2 && i18n('pages.grap.rateModal.label.fair')}
            {rating === 3 && i18n('pages.grap.rateModal.label.good')}
            {rating === 4 && i18n('pages.grap.rateModal.label.veryGood')}
            {rating === 5 && i18n('pages.grap.rateModal.label.excellent')}
          </div>
        </div>

        <div className="rate-selected-preview">
          {getPreviewText()}
        </div>

        <div className="rate-options-list">
          {options.map((text, idx) => (
            <div
              key={idx}
              className="rate-option-row"
              onClick={() => toggleCheckbox(idx)}
            >
              <span className="rate-option-text">{text}</span>
              <span
                className={`rate-option-checkbox ${selected[idx] ? 'checked' : ''
                  }`}
              ></span>
            </div>
          ))}
        </div>

        <div 
          className={`rate-submit-btn ${rating === 0 ? 'disabled' : ''}`} 
          onClick={rating > 0 ? handleSubmit : undefined}
        >
          {i18n('pages.grap.rateModal.submit')}
        </div>
      </div>

      <style>{`
        .rate-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 1200;
        }

        .rate-modal {
          background: linear-gradient(135deg, #0f0f0f 0%, #0a0a0a 100%);
          width: 100%;
          max-width: 380px;
          border-radius: 32px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 175, 55, 0.2);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          max-height: 85vh;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .rate-modal-header {
          padding: 24px 24px 12px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        }

        .rate-modal-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #fff 0%, #d4af37 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          font-family: 'Playfair Display', serif;
        }

        .rate-close-icon {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(212, 175, 55, 0.1);
          border-radius: 50%;
          transition: all 0.2s;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .rate-close-icon:hover {
          background: rgba(212, 175, 55, 0.2);
          transform: rotate(90deg);
          color: #d4af37;
        }

        .rate-rating-section {
          padding: 20px 24px 12px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .rate-stars-container.interactive {
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: center;
        }

        .rate-star-filled {
          color: #d4af37;
          font-size: 2rem;
          filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.3));
        }

        .rate-star-empty {
          color: rgba(255, 255, 255, 0.2);
          font-size: 2rem;
        }

        .rate-rating-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #d4af37;
          margin-bottom: 4px;
          letter-spacing: 0.5px;
        }

        .rate-selected-preview {
          padding: 8px 24px 16px 24px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #d4af37;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          margin-bottom: 4px;
          line-height: 1.4;
          min-height: 45px;
          font-style: italic;
        }

        .rate-options-list {
          padding: 8px 20px;
          overflow-y: auto;
          flex: 1 1 auto;
          max-height: 320px;
        }

        .rate-option-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
          cursor: pointer;
          transition: all 0.2s;
        }

        .rate-option-row:hover {
          background: rgba(212, 175, 55, 0.05);
          padding-left: 8px;
          border-radius: 12px;
        }

        .rate-option-text {
          font-size: 0.85rem;
          line-height: 1.4;
          color: rgba(255, 255, 255, 0.85);
          flex: 1;
          padding-right: 16px;
          font-weight: 450;
        }

        .rate-option-checkbox {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid rgba(212, 175, 55, 0.5);
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          flex-shrink: 0;
          margin-top: 2px;
          transition: all 0.2s;
        }

        .rate-option-checkbox.checked {
          background: #d4af37;
          border-color: #d4af37;
        }

        .rate-option-checkbox.checked::after {
          content: "\\f00c";
          font-family: "Font Awesome 6 Free";
          font-weight: 900;
          color: #0a0a0a;
          font-size: 12px;
        }

        .rate-submit-btn {
          background: linear-gradient(135deg, #d4af37 0%, #b8960f 100%);
          border: none;
          border-radius: 30px;
          padding: 14px 20px;
          margin: 16px 24px 24px 24px;
          color: #0a0a0a;
          font-size: 1rem;
          font-weight: 700;
          text-align: center;
          letter-spacing: 0.5px;
          box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .rate-submit-btn.disabled {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.3);
          box-shadow: none;
          cursor: not-allowed;
        }

        .rate-submit-btn:not(.disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(212, 175, 55, 0.5);
          background: linear-gradient(135deg, #e0b84d 0%, #c9a227 100%);
        }

        .rate-submit-btn:active {
          transform: translateY(1px);
        }

        .rate-options-list::-webkit-scrollbar {
          width: 4px;
        }
        
        .rate-options-list::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        
        .rate-options-list::-webkit-scrollbar-thumb {
          background: #d4af37;
          border-radius: 20px;
        }

        .rate-star-filled, .rate-star-empty {
          transition: all 0.2s ease;
        }
        
        .rate-star-filled:hover, .rate-star-empty:hover {
          transform: scale(1.15);
        }
      `}</style>
    </div>
  );
}

// ----------------------------------------------------------------------
// GrapModal Component
// ----------------------------------------------------------------------
function GrapModal(props) {
  const { items, number, hideModal, submit } = props;
  const [showRateModal, setShowRateModal] = useState(false);
  const [reviewData] = useState(generateRandomReviewData);

  const calculateProfit = (price, commission) => {
    const p = parseFloat(price) || 0;
    const c = parseFloat(commission) || 0;
    return ((p * c) / 100).toFixed(3);
  };

  const handleOrderSubmission = () => {
    setShowRateModal(true);
  };

  const handleRateSubmit = (rating: number) => {
    console.log('User rating:', rating);
    submit();
  };

  return (
    <div className="modal-overlay">
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={hideModal}>
          <i className="fas fa-times"></i>
        </button>

        <div className="modal-contents">
          <div className="modal-hero">
            <img
              src={
                items?.image ||
                items?.photo?.[0]?.downloadUrl ||
                'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&auto=format&fit=crop'
              }
              alt={items?.title}
              loading='lazy'
              className="hero-image"
            />
            <div className="hero-overlay"></div>
          </div>

          <div className="product-title-main">
            {items?.title || i18n('pages.grap.modal.productName')}
          </div>
          
          <div className="review-subtitle">
            <div className="stars-group">
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star"></i>
              <i className="fas fa-star-half-alt"></i>
            </div>
            <span className="rating-value">{reviewData.rating}</span>
            <span className="review-count">({reviewData.reviewCount} {i18n('pages.grap.modal.positiveReviews')})</span>
          </div>

          <div className="amenities-row">
            <div className="amenity-circle"><i className="fas fa-gem"></i></div>
            <div className="amenity-circle"><i className="fas fa-tachometer-alt"></i></div>
            <div className="amenity-circle"><i className="fas fa-crown"></i></div>
            <div className="amenity-circle"><i className="fas fa-road"></i></div>
            <div className="amenity-circle"><i className="fas fa-gas-pump"></i></div>
            <div className="amenity-circle"><i className="fas fa-snowplow"></i></div>
          </div>

          <div className="order-card">
            <div className="order-row">
              <span className="order-label">{i18n('pages.grapModal.orderNumber')}</span>
              <span className="order-value"># {number}</span>
            </div>
            <div className="order-row">
              <span className="order-label">{i18n('pages.grapModal.totalOrderAmount')}</span>
              <span className="order-value">$ {items?.amount || '0.00'}</span>
            </div>
            <div className="order-row">
              <span className="order-label">{i18n('pages.grapModal.orderTime')}</span>
              <span className="order-value">{Dates.current()}</span>
            </div>
          </div>

          <div className="commission-box">
            <span className="commission-label-text">Your Commission</span>
            <div className="commission-amount">
              <span className="currency-symbol">$</span>
              <span className="commission-value">
                {calculateProfit(items?.price ?? items?.amount, items?.commission)}
              </span>
            </div>
          </div>

          <div className="submission-row">
            <div className="left-commission">
              <span className="x1-large">x1</span>
              <span className="commission-label-small">{i18n('pages.grapModal.commission')}</span>
            </div>
            <button className="right-button" onClick={handleOrderSubmission}>
              <i className="fas fa-check-circle"></i> {i18n('pages.grapModal.submit')}
            </button>
          </div>
        </div>
      </div>

      {showRateModal && (
        <RateModal
          onClose={() => setShowRateModal(false)}
          onSubmit={handleRateSubmit}
        />
      )}

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3000;
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .product-modal {
          max-width: 450px;
          width: 100%;
          background: linear-gradient(135deg, #0f0f0f 0%, #0a0a0a 100%);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 175, 55, 0.2);
          position: relative;
          height: 90vh;
          max-height: 700px;
          overflow-y: auto;
          border-radius: 32px;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .product-modal::-webkit-scrollbar {
          width: 4px;
        }

        .product-modal::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }

        .product-modal::-webkit-scrollbar-thumb {
          background: #d4af37;
          border-radius: 10px;
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(10, 10, 10, 0.8);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(212, 175, 55, 0.3);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: #d4af37;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          transition: all 0.2s;
        }

        .modal-close:hover {
          background: rgba(212, 175, 55, 0.2);
          transform: rotate(90deg);
          border-color: #d4af37;
        }

        .modal-contents {
          padding: 0 20px 20px 20px;
        }

        .modal-hero {
          position: relative;
          width: calc(100% + 40px);
          margin-left: -20px;
          margin-top: 0;
          height: 240px;
          overflow: hidden;
          border-radius: 32px 32px 0 0;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .hero-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
        }

        .product-title-main {
          font-size: 1.1rem;
          font-weight: 700;
          line-height: 1.3;
          color: white;
          margin: 20px 0 8px 0;
          letter-spacing: -0.3px;
          font-family: 'Playfair Display', serif;
        }

        .review-subtitle {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .stars-group {
          display: flex;
          gap: 3px;
          color: #d4af37;
          font-size: 0.85rem;
        }

        .rating-value {
          font-size: 0.9rem;
          font-weight: 600;
          color: #d4af37;
        }

        .review-count {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .amenities-row {
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin-bottom: 24px;
          padding: 0 4px;
          gap: 8px;
        }

        .amenity-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d4af37;
          font-size: 1.3rem;
          border: 1px solid rgba(212, 175, 55, 0.3);
          transition: all 0.2s;
        }

        .amenity-circle:hover {
          border-color: #d4af37;
          transform: scale(1.05);
          background: rgba(212, 175, 55, 0.2);
        }

        .order-card {
          background: rgba(15, 15, 15, 0.6);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 18px 20px;
          margin-bottom: 20px;
          border: 1px solid rgba(212, 175, 55, 0.2);
        }

        .order-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
        }

        .order-row:not(:last-child) {
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
        }

        .order-label {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.65);
          font-weight: 500;
          letter-spacing: 0.3px;
        }

        .order-value {
          font-size: 14px;
          font-weight: 700;
          color: white;
          letter-spacing: 0.2px;
        }

        .commission-box {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05));
          border-radius: 24px;
          padding: 16px 20px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .commission-label-text {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: 0.5px;
        }

        .commission-amount {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .currency-symbol {
          font-size: 1rem;
          font-weight: 600;
          color: #d4af37;
        }

        .commission-value {
          font-size: 1.4rem;
          font-weight: 800;
          color: #d4af37;
        }

        .submission-row {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .left-commission {
          flex: 1;
          background: rgba(212, 175, 55, 0.1);
          border-radius: 24px;
          padding: 14px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .x1-large {
          font-size: 1.3rem;
          font-weight: 800;
          line-height: 1;
          color: #d4af37;
          margin-bottom: 4px;
        }

        .commission-label-small {
          font-size: 0.7rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .right-button {
          flex: 2;
          background: linear-gradient(135deg, #d4af37 0%, #b8960f 100%);
          border-radius: 24px;
          padding: 16px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0a0a0a;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.5px;
          box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          gap: 8px;
        }

        .right-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(212, 175, 55, 0.5);
          background: linear-gradient(135deg, #e0b84d 0%, #c9a227 100%);
        }

        .right-button:active {
          transform: translateY(1px);
        }

        .right-button i {
          font-size: 1rem;
        }

        @media (max-width: 480px) {
          .product-modal {
            max-width: 95%;
            height: 85vh;
            border-radius: 28px;
          }
          
          .amenity-circle {
            width: 42px;
            height: 42px;
            font-size: 1.1rem;
          }
          
          .product-title-main {
            font-size: 1rem;
          }
          
          .commission-value {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
}

export default GrapModal;