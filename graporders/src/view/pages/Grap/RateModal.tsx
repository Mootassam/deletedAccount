import React, { useState } from 'react';

interface RateModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (selectedIndices: number[], rating: number) => void;
  options?: string[]; // optional custom list of review phrases
}

const RateModal: React.FC<RateModalProps> = ({
  visible,
  onClose,
  onSubmit,
  options = [
    'The car was in immaculate condition, performed flawlessly throughout the rental',
    'Exceptional service and the vehicle exceeded all expectations',
    'The staff went above and beyond to ensure a perfect luxury driving experience',
    'An unforgettable experience driving this masterpiece on the open road',
    'The vehicle was perfectly prepared, spotless and ready to go',
    'Excellent service with premium vehicles located in the heart of the city',
    'The performance, comfort, and attention to detail made this rental exceptional. Staff was extremely helpful and professional',
  ],
}) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([0]);
  const [rating, setRating] = useState<number>(4);

  if (!visible) return null;

  const toggleOption = (index: number) => {
    setSelectedIndices(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleStarClick = (star: number) => {
    setRating(star);
  };

  const handleSubmit = () => {
    onSubmit(selectedIndices, rating);
  };

  const previewText =
    selectedIndices.length > 0
      ? options[selectedIndices[0]]
      : 'No option selected';

  return (
    <div className="rate-modal-overlay" onClick={onClose}>
      <div className="rate-modal" onClick={e => e.stopPropagation()}>
        <div className="rate-modal-header">
          <h2>Rate Your Experience</h2>
          <div className="rate-close-icon" onClick={onClose}>
            <i className="fas fa-times"></i>
          </div>
        </div>

        <div className="rate-selected-preview">“{previewText}”</div>

        <div className="rate-options-list">
          {options.map((text, index) => (
            <div
              key={index}
              className="rate-option-row"
              onClick={() => toggleOption(index)}
            >
              <span className="rate-option-text">{text}</span>
              <span
                className={`rate-option-checkbox ${
                  selectedIndices.includes(index) ? 'checked' : ''
                }`}
              >
                {selectedIndices.includes(index) && (
                  <i className="fas fa-check"></i>
                )}
              </span>
            </div>
          ))}
        </div>

        <button className="rate-submit-btn" onClick={handleSubmit}>
          Submit Review
        </button>

        <div className="rate-rating-footer">
          <div className="rate-stars-container">
            {[1, 2, 3, 4, 5].map(star => (
              <i
                key={star}
                className={`fas fa-star ${
                  star <= rating ? 'rate-star-filled' : 'rate-star-empty'
                }`}
                onClick={() => handleStarClick(star)}
              ></i>
            ))}
            <span className="rate-rating-number">{rating}/5</span>
          </div>
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
          z-index: 2000;
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        .rate-modal {
          background: linear-gradient(135deg, #0f0f0f 0%, #0a0a0a 100%);
          width: 100%;
          max-width: 400px;
          border-radius: 32px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 175, 55, 0.3);
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

        .rate-selected-preview {
          padding: 16px 24px 12px 24px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #d4af37;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          margin-bottom: 8px;
          line-height: 1.5;
          font-style: italic;
          background: rgba(212, 175, 55, 0.05);
        }

        .rate-options-list {
          padding: 8px 20px;
          overflow-y: auto;
          flex: 1 1 auto;
          max-height: 320px;
        }

        .rate-options-list::-webkit-scrollbar {
          width: 4px;
        }
        
        .rate-options-list::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        
        .rate-options-list::-webkit-scrollbar-thumb {
          background: #d4af37;
          border-radius: 10px;
        }

        .rate-option-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 12px 8px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
          cursor: pointer;
          transition: all 0.2s;
          border-radius: 12px;
        }

        .rate-option-row:hover {
          background: rgba(212, 175, 55, 0.08);
          padding-left: 12px;
        }

        .rate-option-text {
          font-size: 0.85rem;
          line-height: 1.5;
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

        .rate-option-checkbox.checked i {
          color: #0a0a0a;
          font-size: 12px;
        }

        .rate-submit-btn {
          background: linear-gradient(135deg, #d4af37 0%, #b8960f 100%);
          border: none;
          border-radius: 30px;
          padding: 14px 20px;
          margin: 16px 24px 12px 24px;
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

        .rate-submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(212, 175, 55, 0.5);
          background: linear-gradient(135deg, #e0b84d 0%, #c9a227 100%);
        }

        .rate-submit-btn:active {
          transform: translateY(1px);
        }

        .rate-rating-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px 24px 24px 24px;
          border-top: 1px solid rgba(212, 175, 55, 0.2);
          background: rgba(10, 10, 10, 0.4);
        }

        .rate-stars-container {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .rate-star-filled {
          color: #d4af37;
          font-size: 1.6rem;
          cursor: pointer;
          transition: all 0.2s;
          filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.3));
        }

        .rate-star-empty {
          color: rgba(255, 255, 255, 0.2);
          font-size: 1.6rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .rate-star-filled:hover, .rate-star-empty:hover {
          transform: scale(1.1);
        }

        .rate-rating-number {
          font-size: 1.2rem;
          font-weight: 700;
          color: #d4af37;
          margin-left: 12px;
          letter-spacing: 0.5px;
        }

        /* Animation for modal */
        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .rate-modal {
          animation: modalSlideUp 0.3s ease;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .rate-modal-header h2 {
            font-size: 1.3rem;
          }
          
          .rate-star-filled, .rate-star-empty {
            font-size: 1.3rem;
          }
          
          .rate-rating-number {
            font-size: 1rem;
          }
          
          .rate-submit-btn {
            padding: 12px 18px;
            font-size: 0.9rem;
            margin: 12px 20px 8px 20px;
          }
          
          .rate-rating-footer {
            padding: 12px 20px 20px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default RateModal;