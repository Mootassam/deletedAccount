import React, { useState, useEffect } from 'react';
import SubHeader from 'src/view/shared/Header/SubHeader';
import actions from 'src/modules/card/form/cardFormActions';
import selectors from 'src/modules/card/form/cardFormSelectors';
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import InputFormItem from "src/shared/form/InputFormItem";

function Card() {
  const dispatch = useDispatch();
  const record = useSelector(selectors.selectRecord);
  const initLoading = useSelector(selectors.selectInitLoading);
  const saveLoading = useSelector(selectors.selectSaveLoading);

  const [step, setStep] = useState('amount'); // 'amount' or 'card'
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');

  // Initial values for react-hook-form
  const [initialValues] = useState(() => ({
    cardNumber: '',
    cardholderName: '',
    expiry: '',
    cvv: '',
    address: '',
    zipCode: '',
  }));

  // Validation schema for card form
  const createSchema = () => {
    return yup.object().shape({
      cardNumber: yup
        .string()
        .required('Card number is required')
        .matches(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$|^\d{16}$/, 'Please enter a valid 16-digit card number'),
      cardholderName: yup
        .string()
        .required('Cardholder name is required')
        .matches(/^[a-zA-Z\s]{3,}$/, 'Enter the name as it appears on the card'),
      expiry: yup
        .string()
        .required('Expiry date is required')
        .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use format MM/YY')
        .test('expiry-date', 'Card has expired', function (value) {
          if (!value) return false;
          const [month, year] = value.split('/');
          const currentYear = new Date().getFullYear() % 100;
          const currentMonth = new Date().getMonth() + 1;
          return parseInt(year) > currentYear ||
            (parseInt(year) === currentYear && parseInt(month) >= currentMonth);
        }),
      cvv: yup
        .string()
        .required('CVV is required')
        .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
      address: yup
        .string()
        .required('Street address is required'),
      zipCode: yup
        .string()
        .required('Zip/Postal code is required')
        .matches(/^[A-Za-z0-9\s-]{3,10}$/, 'Enter a valid zip/postal code'),
    });
  };

  // Initialize react-hook-form
  const form = useForm({
    resolver: yupResolver(createSchema()),
    mode: "all",
    defaultValues: initialValues,
  });

  const { setValue, watch, formState: { errors: formErrors } } = form;

  // Watch form values for card preview
  const watchedCardNumber = watch("cardNumber");
  const watchedCardholderName = watch("cardholderName");
  const watchedExpiry = watch("expiry");

  // Detect card type from the first digits
  const getCardType = (cardNumber) => {
    const cleaned = cardNumber?.replace(/\s/g, '') || '';
    if (!cleaned) return { type: 'card', icon: 'fas fa-credit-card', name: 'Card' };

    if (/^4/.test(cleaned)) {
      return { type: 'visa', icon: 'fab fa-cc-visa', name: 'Visa' };
    }
    if (/^(5[1-5]|2[2-7][2-7][0-9])/.test(cleaned)) {
      return { type: 'mastercard', icon: 'fab fa-cc-mastercard', name: 'Mastercard' };
    }
    if (/^(34|37)/.test(cleaned)) {
      return { type: 'amex', icon: 'fab fa-cc-amex', name: 'American Express' };
    }
    if (/^(6011|65|64[4-9])/.test(cleaned)) {
      return { type: 'discover', icon: 'fab fa-cc-discover', name: 'Discover' };
    }
    if (/^(30[0-5]|36|38)/.test(cleaned)) {
      return { type: 'diners', icon: 'fab fa-cc-diners-club', name: 'Diners Club' };
    }
    if (/^35/.test(cleaned)) {
      return { type: 'jcb', icon: 'fab fa-cc-jcb', name: 'JCB' };
    }
    return { type: 'card', icon: 'fas fa-credit-card', name: 'Card' };
  };

  const currentCard = getCardType(watchedCardNumber);

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

  const handleCardSubmit = async (values) => {
    console.log('Payment details:', { amount, ...values });

    // Dispatch to Redux if needed
    await dispatch(actions.doCreate(values));


  };

  const handleBack = () => {
    setStep('amount');
    setAmountError('');
    form.reset(); // Reset form when going back
  };

  // Format card number as user types
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
      value = value.match(/.{1,4}/g).join(' ').slice(0, 19);
    }
    setValue('cardNumber', value, { shouldValidate: true });
  };

  // Format expiry as user types
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setValue('expiry', value, { shouldValidate: true });
  };

  // Handle CVV input (numbers only)
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setValue('cvv', value, { shouldValidate: true });
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
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(212,175,55,0.3);
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
                  {watchedCardNumber || '•••• •••• •••• ••••'}
                </div>
                <div className="card-details-preview">
                  <span>{watchedCardholderName?.toUpperCase() || 'CARDHOLDER NAME'}</span>
                  <span>{watchedExpiry || 'MM/YY'}</span>
                </div>
              </div>

              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(handleCardSubmit)}>
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <div className="input-wrapper">
                      <InputFormItem
                        type="text"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        className="form-input"
                        onChange={handleCardNumberChange}
                        autoComplete="off"
                      />
                      <div className="input-icon">
                        <i className={currentCard.icon}></i>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cardholder Name</label>
                    <InputFormItem
                      type="text"
                      name="cardholderName"
                      placeholder="JOHN DOE"
                      className="form-input"
                      autoComplete="off"
                    />
                  </div>

                  <div className="row">
                    <div className="form-group">
                      <label className="form-label">Expiry Date (MM/YY)</label>
                      <InputFormItem
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        className="form-input"
                        onChange={handleExpiryChange}
                        maxLength="5"
                        autoComplete="off"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <InputFormItem
                        type="password"
                        name="cvv"
                        placeholder="123"
                        className="form-input"
                        onChange={handleCvvChange}
                        maxLength="4"
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Street Address</label>
                    <InputFormItem
                      type="text"
                      name="address"
                      placeholder="123 Main St"
                      className="form-input"
                      autoComplete="off"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Zip / Postal Code</label>
                    <InputFormItem
                      type="text"
                      name="zipCode"
                      placeholder="12345"
                      className="form-input"
                      autoComplete="off"
                    />
                  </div>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={saveLoading}
                  >
                    {saveLoading ? 'Processing...' : 'Confirm Payment'}
                  </button>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="back-btn"
                    disabled={saveLoading}
                  >
                    ← Back to Amount
                  </button>
                </form>
              </FormProvider>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Card;