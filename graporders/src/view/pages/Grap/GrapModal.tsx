import React, { useState } from 'react';
import Dates from 'src/view/shared/utils/Dates';
import { i18n } from '../../../i18n';

// Helper function to generate random review data
const generateRandomReviewData = () => {
  // Generate random rating between 3.0 and 5.0 (with 1 decimal place)
  const rating = (Math.random() * 2 + 3).toFixed(1); // 3.0 to 5.0
  
  // Generate random number of reviews between 10,000 and 500,000
  const reviewCount = Math.floor(Math.random() * 490000) + 10000; // 10,000 to 500,000
  
  // Format the number with commas
  const formattedReviewCount = reviewCount.toLocaleString();
  
  return { rating, reviewCount: formattedReviewCount };
};

// ----------------------------------------------------------------------
// RateModal Component (inner)
// ----------------------------------------------------------------------
interface RateModalProps {
  onClose: () => void;
  onSubmit: (rating: number) => void; // Modified to include rating
}

function RateModal({ onClose, onSubmit }: RateModalProps) {
  // List of review options (same as in the HTML)
  const options = [
    i18n('pages.grap.rateModal.options.0'),
    i18n('pages.grap.rateModal.options.1'),
    i18n('pages.grap.rateModal.options.2'),
    i18n('pages.grap.rateModal.options.3'),
    i18n('pages.grap.rateModal.options.4'),
    i18n('pages.grap.rateModal.options.5'),
    i18n('pages.grap.rateModal.options.6'),
  ];

  // State to track which checkboxes are selected (first one selected by default)
  const [selected, setSelected] = useState<boolean[]>(() =>
    options.map((_, index) => index === 0) // only first option checked initially
  );

  // State for star rating (0-5)
  const [rating, setRating] = useState<number>(4); // Default to 4 stars
  const [hoverRating, setHoverRating] = useState<number>(0); // For hover effect

  const toggleCheckbox = (index: number) => {
    setSelected((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const handleSubmit = () => {
    onSubmit(rating); // pass the rating to the parent
    onClose();  // close the modal
  };

  // Get the preview text based on selected options
  const getPreviewText = () => {
    const selectedOptions = options.filter((_, idx) => selected[idx]);
    if (selectedOptions.length === 0) return i18n('pages.grap.rateModal.selectOptions');
    if (selectedOptions.length === 1) return `“${selectedOptions[0]}”`;
    return `“${selectedOptions[0]}” +${selectedOptions.length - 1} ${i18n('pages.grap.rateModal.more')}`;
  };

  // Render stars
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
          style={{ cursor: 'pointer', transition: 'color 0.1s ease' }}
        ></i>
      );
    }
    return stars;
  };

  return (
    <div className="rate-modal-overlay" onClick={onClose}>
      <div className="rate-modal" onClick={(e) => e.stopPropagation()}>
        {/* header */}
        <div className="rate-modal-header">
          <h2>{i18n('pages.grap.rateModal.title')}</h2>
          <div className="rate-close-icon" onClick={onClose}>
            <i className="fas fa-times"></i>
          </div>
        </div>

        {/* rating section - moved to top */}
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

        {/* preview text (dynamic based on selection) */}
        <div className="rate-selected-preview">
          {getPreviewText()}
        </div>

        {/* scrollable options list */}
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

        {/* submit button */}
        <div 
          className={`rate-submit-btn ${rating === 0 ? 'disabled' : ''}`} 
          onClick={rating > 0 ? handleSubmit : undefined}
          style={rating === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
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
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 1100; /* above the first modal */
        }

        .rate-modal {
          background: #ffffff;
          width: 100%;
          max-width: 380px;
          border-radius: 32px;
          box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.3), 0 10px 30px -10px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          max-height: 85vh;
        }

        .rate-modal-header {
          padding: 20px 22px 6px 22px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .rate-modal-header h2 {
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: #1c1c1e;
          margin: 0;
        }

        .rate-close-icon {
          font-size: 1.4rem;
          color: #8e8e93;
          cursor: pointer;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f0f0;
          border-radius: 50%;
        }

        .rate-rating-section {
          padding: 16px 22px 8px 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .rate-stars-container.interactive {
          display: flex;
          gap: 8px;
          align-items: center;
          justify-content: center;
        }

        .rate-rating-label {
          font-size: 0.9rem;
          font-weight: 500;
          color: #f7931e;
          margin-bottom: 4px;
        }

        .rate-selected-preview {
          padding: 0 22px 12px 22px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #f7931e;
          border-bottom: 1px solid #f0f0f0;
          margin-bottom: 4px;
          line-height: 1.4;
          min-height: 40px;
        }

        .rate-options-list {
          padding: 0 22px;
          overflow-y: auto;
          flex: 1 1 auto;
          max-height: 320px;
        }

        .rate-option-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
        }

        .rate-option-row:hover {
          background-color: #fafafc;
        }

        .rate-option-text {
          font-size: 0.85rem;
          line-height: 1.4;
          color: #1c1c1e;
          flex: 1;
          padding-right: 16px;
          font-weight: 450;
        }

        .rate-option-checkbox {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 2px solid #c6c6c8;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          flex-shrink: 0;
          margin-top: 2px;
          transition: all 0.1s;
        }

        .rate-option-checkbox.checked {
          background: #f7931e;
          border-color: #f7931e;
        }

        .rate-option-checkbox.checked::after {
          content: "\\f00c";
          font-family: "Font Awesome 6 Free";
          font-weight: 900;
          color: white;
          font-size: 12px;
        }

        .rate-submit-btn {
          background: #f7931e;
          border: none;
          border-radius: 30px;
          padding: 14px 20px;
          margin: 16px 22px 16px 22px;
          color: white;
          font-size: 1.1rem;
          font-weight: 700;
          text-align: center;
          letter-spacing: 0.2px;
          box-shadow: 0 12px 24px -10px rgba(247, 147, 30, 0.4);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .rate-submit-btn.disabled {
          background: #ccc;
          box-shadow: none;
        }

        .rate-submit-btn:not(.disabled):hover {
          background: #e07d0e;
          transform: scale(1.02);
        }

        .rate-star-filled {
          color: #f7931e;
          font-size: 1.8rem;
        }

        .rate-star-empty {
          color: #d5d5d7;
          font-size: 1.8rem;
        }

        .rate-options-list::-webkit-scrollbar {
          width: 4px;
        }
        .rate-options-list::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 20px;
        }

        /* Animation for stars */
        .rate-star-filled, .rate-star-empty {
          transition: transform 0.1s ease;
        }
        .rate-star-filled:hover, .rate-star-empty:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}

// ----------------------------------------------------------------------
// Original GrapModal (modified)
// ----------------------------------------------------------------------
function GrapModal(props) {
  const { items, number, hideModal, submit } = props;
  const [showRateModal, setShowRateModal] = useState(false);
  
  // Generate random review data once when component mounts
  const [reviewData] = useState(generateRandomReviewData);

  const calculateProfit = (price, commission) => {
    const p = parseFloat(price) || 0;
    const c = parseFloat(commission) || 0;
    return ((p * c) / 100).toFixed(3);
  };

  const handleOrderSubmission = () => {
    // Instead of calling submit directly, open the rate modal
    setShowRateModal(true);
  };

  const handleRateSubmit = (rating: number) => {
    // This will be called when user clicks "Submit Review" in RateModal
    console.log('User rating:', rating); // You can use this rating value
    submit(); // original submit action
  };

  return (
    <div className="modal-overlay" >
      <div
        className="product-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button className="modal-close" onClick={hideModal}>
          <i className="fas fa-times"></i>
        </button>

        <div className="modal-contents">
          {/* Hero image with vertical title */}
          <div className="modal-hero">
            <img
              src={
                items?.image ||
                items?.photo?.[0]?.downloadUrl ||
                'https://www.kayak.fr/rimg/himg/44/a8/8a/ice-178163-01c8df-614698.jpg?width=836&height=607&crop=true'
              }
              alt={items?.title}
              loading='lazy'
              className="hero-image"
            />
          </div>

          {/* Product title and rating line with random values */}
          <div className="product-title-main">
            {items?.title || i18n('pages.grap.modal.productName')}
          </div>
          <div className="review-subtitle">
            <i className="fas fa-star" style={{ color: '#ffb340' }}></i> {reviewData.rating} · {reviewData.reviewCount} {i18n('pages.grap.modal.positiveReviews')}
          </div>

          {/* Amenities row (static for now; can be dynamic) */}
          <div className="amenities-row">
            <div className="amenity-circle"><i className="fas fa-wifi"></i></div>
            <div className="amenity-circle"><i className="fas fa-wine-glass-alt"></i></div>
            <div className="amenity-circle"><i className="fas fa-parking"></i></div>
            <div className="amenity-circle"><i className="fas fa-dumbbell"></i></div>
            <div className="amenity-circle"><i className="fas fa-utensils"></i></div>
            <div className="amenity-circle"><i className="fas fa-swimmer"></i></div>
          </div>

          {/* Order details card */}
          <div className="order-card">
            <div className="order-row">
              <span className="order-label">{i18n('pages.grapModal.orderNumber')}</span>
              <span className="order-value">N{number}</span>
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

          {/* Commission box (estimated return) */}
          <div className="commission-box">
            <span className="currency-symbol">$</span>
            <span className="commission-value">
              {calculateProfit(
                items?.price ?? items?.amount,
                items?.commission
              )}
            </span>
          </div>

          {/* Submission row: x1 Commission + Order submission button */}
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

      {/* Render the RateModal when needed */}
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
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        .product-modal {
          max-width: 430px;
          width: 100%;
          background: #ffffff;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
          position: relative;
          height:100dvh;
          overflow-y: auto;
          padding: 0 0 20px 0;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(4px);
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: #1c1c1e;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
        }

        .modal-close:hover {
          background: white;
        }

        .modal-contents {
          padding: 0 20px;
        }

        /* Hero image */
        .modal-hero {
          position: relative;
          width: calc(100% + 40px);
          margin-left: -20px;
          margin-top: 0;
          height: 220px;
          overflow: hidden;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .product-title-main {
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          line-height: 1.1;
          color: #000;
          margin: 16px 0 4px 0;
          letter-spacing: -0.5px;
        }

        .review-subtitle {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.95rem;
          color: #5e5e60;
          margin-bottom: 22px;
        }

        /* Amenities */
        .amenities-row {
          display: flex;
          justify-content: space-around;
          align-items: center;
          margin-bottom: 28px;
          padding: 0 4px;
        }

        .amenity-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #f2f5fa;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0A84FF;
          font-size: 1.3rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
          border: 1px solid rgba(0,0,0,0.02);
        }

        /* Order card */
        .order-card {
          background: #f8fafd;
          border-radius: 26px;
          padding: 18px 20px;
          margin-bottom: 24px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.02);
          border: 0.5px solid rgba(0,0,0,0.02);
        }

        .order-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
        }

        .order-row:not(:last-child) {
          border-bottom: 1px solid #e9ecf0;
        }

        .order-label {
          font-size: 14px;
          color: #5e5e60;
          font-weight: 450;
        }

        .order-value {
          font-size: 14px;
          font-weight: 600;
          color: #1c1c1e;
          letter-spacing: 0.2px;
        }

        /* Commission box */
        .commission-box {
          background: #f2f5fa;
          border-radius: 24px;
          padding: 10px 22px;
          margin-bottom: 28px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          font-size: 1.3rem;
          font-weight: 600;
          color: #1c1c1e;
          border: 0.5px solid rgba(0,0,0,0.02);
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.02);
        }

        .currency-symbol {
          font-size: 1.2rem;
          font-weight: 500;
          color: #6c6c70;
          margin-right: 6px;
          order: -1;
        }

        /* Submission row */
        .submission-row {
          display: flex;
          gap: 16px;
          align-items: center;
          margin-bottom: 10px;
        }

        .left-commission {
          flex: 1;
          background: #f2f5fa;
          border-radius: 26px;
          padding: 14px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(0,0,0,0.02);
          border: 0.5px solid rgba(0,0,0,0.02);
        }

        .x1-large {
          font-size: 1.4rem;
          font-weight: 700;
          line-height: 1;
          color: #0A84FF;
          margin-bottom: 2px;
        }

        .commission-label-small {
          font-size: 0.8rem;
          font-weight: 500;
          color: #5e5e60;
          text-transform: uppercase;
          letter-spacing: 0.2px;
        }

        .right-button {
          flex: 2;
          background: #0A84FF;
          border-radius: 26px;
          padding: 18px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.3px;
          box-shadow: 0 10px 22px -8px rgba(10,132,255,0.3);
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }

        .right-button:hover {
          background: #0077e6;
        }

        .right-button i {
          margin-right: 8px;
          font-size: 1.1rem;
        }

        /* Small screens */
        @media (max-width: 400px) {
          .amenity-circle {
            width: 40px;
            height: 40px;
            font-size: 1.1rem;
          }
          .product-title-main {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </div>
  );
}

export default GrapModal;
