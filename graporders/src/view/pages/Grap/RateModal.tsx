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
    'The rooms were clean, very comfortable, and the staff was amazing',
    'It was great. Service top notch as always',
    'The staff at this property are all great! They all go above and beyond to make your stay comfortable',
    'I had a wonderful experience here',
    'Food was great with many choices to choose from',
    'Excellent hotel with excellent location located at the city center',
    'Very central with comfort rooms with amazing aircon. Breakfast was delicious and the staff extremely helpful and friendly',
  ],
}) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([0]); // first option selected by default
  const [rating, setRating] = useState<number>(4); // default rating 4

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

  // Preview text: first selected option, or fallback
  const previewText =
    selectedIndices.length > 0
      ? options[selectedIndices[0]]
      : 'No option selected';

  return (
    <div className="rate-modal-overlay" onClick={onClose}>
      <div className="rate-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="rate-modal-header">
          <h2>Rate</h2>
          <div className="rate-close-icon" onClick={onClose}>
            <i className="fas fa-times"></i>
          </div>
        </div>

        {/* Preview */}
        <div className="rate-selected-preview">“{previewText}”</div>

        {/* Options list */}
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

        {/* Submit button */}
        <button className="rate-submit-btn" onClick={handleSubmit}>
          To be submitted
        </button>

        {/* Rating footer */}
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
          background-color: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 2000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
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
          font-size: 1.6rem;
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

        .rate-selected-preview {
          padding: 0 22px 12px 22px;
          font-size: 0.9rem;
          font-weight: 500;
          color: #f7931e;
          border-bottom: 1px solid #f0f0f0;
          margin-bottom: 4px;
          line-height: 1.4;
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
          color: white;
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
          transition: background 0.2s;
        }

        .rate-submit-btn:hover {
          background: #e5830e;
        }

        .rate-rating-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 22px 18px 22px;
          border-top: 1px solid #f0f0f0;
          background: #fafafc;
        }

        .rate-stars-container {
          display: flex;
          gap: 5px;
          align-items: center;
        }

        .rate-star-filled {
          color: #f7931e;
          font-size: 1.4rem;
          cursor: pointer;
        }

        .rate-star-empty {
          color: #d5d5d7;
          font-size: 1.4rem;
          cursor: pointer;
        }

        .rate-rating-number {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1c1c1e;
          margin-left: 10px;
        }

        .rate-options-list::-webkit-scrollbar {
          width: 4px;
        }
        .rate-options-list::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
};

export default RateModal;