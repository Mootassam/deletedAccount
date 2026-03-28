import React, { useState } from 'react';
import SubHeader from 'src/view/shared/Header/SubHeader';

function Card() {
  const [step, setStep] = useState('amount'); // 'amount' or 'card'
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiry: '',
    cvv: '',
    address: '',
    zipCode: '',
  });
  const [errors, setErrors] = useState({});

  // Detect card type from the first digits
  const getCardType = (cardNumber) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (!cleaned) return { type: 'card', icon: 'fas fa-credit-card', name: 'Card' };

    // Visa: starts with 4
    if (/^4/.test(cleaned)) {
      return { type: 'visa', icon: 'fab fa-cc-visa', name: 'Visa' };
    }
    // Mastercard: 51-55 or 2221-2720
    if (/^(5[1-5]|2[2-7][2-7][0-9])/.test(cleaned)) {
      return { type: 'mastercard', icon: 'fab fa-cc-mastercard', name: 'Mastercard' };
    }
    // American Express: 34 or 37
    if (/^(34|37)/.test(cleaned)) {
      return { type: 'amex', icon: 'fab fa-cc-amex', name: 'American Express' };
    }
    // Discover: 6011, 65, 644-649
    if (/^(6011|65|64[4-9])/.test(cleaned)) {
      return { type: 'discover', icon: 'fab fa-cc-discover', name: 'Discover' };
    }
    // Diners Club: 300-305, 36, 38
    if (/^(30[0-5]|36|38)/.test(cleaned)) {
      return { type: 'diners', icon: 'fab fa-cc-diners-club', name: 'Diners Club' };
    }
    // JCB: 35
    if (/^35/.test(cleaned)) {
      return { type: 'jcb', icon: 'fab fa-cc-jcb', name: 'JCB' };
    }
    return { type: 'card', icon: 'fas fa-credit-card', name: 'Card' };
  };

  const currentCard = getCardType(cardData.cardNumber);

  const handleAmountSubmit = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setAmountError('Please enter a valid amount (greater than 0)');
      return;
    }
    setAmountError('');
    setStep('card');
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    }
    if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(?=\d{2})/, '$1/').slice(0, 5);
    }
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardData((prev) => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateCardForm = () => {
    const newErrors = {};
    const { cardNumber, cardholderName, expiry, cvv, address, zipCode } = cardData;

    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (!cleanCardNumber.match(/^\d{16}$/)) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    if (!cardholderName.trim().match(/^[a-zA-Z\s]{3,}$/)) {
      newErrors.cardholderName = 'Enter the name as it appears on the card';
    }
    if (!expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
      newErrors.expiry = 'Use format MM/YY';
    } else {
      const [month, year] = expiry.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiry = 'Card has expired';
      }
    }
    if (!cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }
    if (!address.trim()) {
      newErrors.address = 'Street address is required';
    }
    if (!zipCode.trim()) {
      newErrors.zipCode = 'Zip/Postal code is required';
    } else if (!zipCode.match(/^[A-Za-z0-9\s-]{3,10}$/)) {
      newErrors.zipCode = 'Enter a valid zip/postal code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    if (validateCardForm()) {
      console.log('Payment details:', { amount, ...cardData });
      alert(`Processing payment of $${amount}... (demo)`);
    }
  };

  const handleBack = () => {
    setStep('amount');
    setAmountError('');
  };

  return (
    <>
      <SubHeader title="Card Details" path="/" />

      <style>{`
        .card-page-container {
          min-height: 100vh;
          padding: 16px;
          background: #0a0a0a;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }
        .card-form-card {
          max-width: 600px;
          width: 100%;
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.5);
        }
        .amount-display {
          background: rgba(212,175,55,0.1);
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 24px;
          text-align: center;
          border: 1px solid rgba(212,175,55,0.3);
        }
        .amount-display span {
          color: #d4af37;
          font-weight: bold;
          font-size: 24px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #d4af37;
          margin-bottom: 6px;
          letter-spacing: 0.5px;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .currency-symbol {
          position: absolute;
          left: 12px;
          color: #d4af37;
          font-weight: 500;
        }
        .form-input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(0,0,0,0.5);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 12px;
          color: #ffffff;
          font-size: 14px;
          transition: all 0.2s;
          outline: none;
        }
        .form-input.with-currency {
          padding-left: 32px;
        }
        .form-input:focus {
          border-color: #d4af37;
          box-shadow: 0 0 0 2px rgba(212,175,55,0.2);
        }
        .form-input.error {
          border-color: #ff4444;
        }
        .input-icon {
          position: absolute;
          right: 12px;
          font-size: 20px;
          color: #d4af37;
          pointer-events: none;
        }
        .error-message {
          color: #ff4444;
          font-size: 11px;
          margin-top: 4px;
          margin-left: 4px;
        }
        .row {
          display: flex;
          gap: 16px;
        }
        .row .form-group {
          flex: 1;
        }
        .submit-btn, .back-btn {
          width: 100%;
          padding: 14px;
          border-radius: 40px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          margin-top: 12px;
          border: none;
        }
        .submit-btn {
          background: linear-gradient(145deg, #d4af37, #b8960f);
          color: #0a0a0a;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(212,175,55,0.3);
        }
        .back-btn {
          background: transparent;
          border: 1px solid rgba(212,175,55,0.5);
          color: #d4af37;
          margin-top: 8px;
        }
        .back-btn:hover {
          background: rgba(212,175,55,0.1);
        }
        .card-preview {
          background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 24px;
          border: 1px solid rgba(212,175,55,0.3);
          position: relative;
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        .card-chip {
          width: 40px;
          height: 30px;
          background: linear-gradient(145deg, #d4af37, #b8960f);
          border-radius: 8px;
        }
        .card-type-icon {
          font-size: 36px;
          color: #d4af37;
        }
        .card-number-preview {
          font-size: 18px;
          letter-spacing: 2px;
          color: #ffffff;
          margin-bottom: 16px;
          font-family: monospace;
        }
        .card-details-preview {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #ccc;
        }
        @media (max-width: 480px) {
          .card-form-card {
            padding: 16px;
          }
          .row {
            flex-direction: column;
            gap: 0;
          }
        }
      `}</style>

      <div className="card-page-container">
        <div className="card-form-card">
          {step === 'amount' && (
            <form onSubmit={handleAmountSubmit}>
              <div className="form-group">
                <label className="form-label">Amount (USD)</label>
                <div className="input-wrapper">
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className={`form-input with-currency ${amountError ? 'error' : ''}`}
                  />
                </div>
                {amountError && <div className="error-message">{amountError}</div>}
              </div>
              <button type="submit" className="submit-btn">
                Pay with Card
              </button>
            </form>
          )}

          {step === 'card' && (
            <>
              <div className="amount-display">
                <span>${parseFloat(amount).toFixed(2)}</span>
              </div>

              {/* Card Preview */}
              <div className="card-preview">
                <div className="card-header">
                  <div className="card-chip"></div>
                  <div className="card-type-icon">
                    <i className={currentCard.icon}></i>
                  </div>
                </div>
                <div className="card-number-preview">
                  {cardData.cardNumber || '•••• •••• •••• ••••'}
                </div>
                <div className="card-details-preview">
                  <span>{cardData.cardholderName || 'CARDHOLDER NAME'}</span>
                  <span>{cardData.expiry || 'MM/YY'}</span>
                </div>
              </div>

              <form onSubmit={handleCardSubmit}>
                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleCardChange}
                      placeholder="1234 5678 9012 3456"
                      className={`form-input ${errors.cardNumber ? 'error' : ''}`}
                      maxLength="19"
                    />
                    <div className="input-icon">
                      <i className={currentCard.icon}></i>
                    </div>
                  </div>
                  {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardholderName"
                    value={cardData.cardholderName}
                    onChange={handleCardChange}
                    placeholder="JOHN DOE"
                    className={`form-input ${errors.cardholderName ? 'error' : ''}`}
                  />
                  {errors.cardholderName && <div className="error-message">{errors.cardholderName}</div>}
                </div>

                <div className="row">
                  <div className="form-group">
                    <label className="form-label">Expiry Date (MM/YY)</label>
                    <input
                      type="text"
                      name="expiry"
                      value={cardData.expiry}
                      onChange={handleCardChange}
                      placeholder="MM/YY"
                      className={`form-input ${errors.expiry ? 'error' : ''}`}
                      maxLength="5"
                    />
                    {errors.expiry && <div className="error-message">{errors.expiry}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={cardData.cvv}
                      onChange={handleCardChange}
                      placeholder="123"
                      className={`form-input ${errors.cvv ? 'error' : ''}`}
                      maxLength="4"
                    />
                    {errors.cvv && <div className="error-message">{errors.cvv}</div>}
                  </div>
                </div>

                {/* Address fields - now present */}
                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={cardData.address}
                    onChange={handleCardChange}
                    placeholder="123 Main St"
                    className={`form-input ${errors.address ? 'error' : ''}`}
                  />
                  {errors.address && <div className="error-message">{errors.address}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Zip / Postal Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={cardData.zipCode}
                    onChange={handleCardChange}
                    placeholder="12345"
                    className={`form-input ${errors.zipCode ? 'error' : ''}`}
                  />
                  {errors.zipCode && <div className="error-message">{errors.zipCode}</div>}
                </div>

                <button type="submit" className="submit-btn">
                  Confirm Payment
                </button>
                <button type="button" onClick={handleBack} className="back-btn">
                  ← Back to Amount
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Card;