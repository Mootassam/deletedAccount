import React from 'react';
import { Link } from 'react-router-dom';
import SubHeader from 'src/view/shared/Header/SubHeader';

function Deposit() {
  return (
    <>
      <SubHeader title="Deposit" path="/" />

      <style>{`
        .deposit-container {
          min-height: 100vh;
          padding: 16px;
          background: #0a0a0a;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #ffffff;
        }
        .deposit-title {
          font-size: 16px;
          font-weight: 600;
          color: #d4af37;
          margin-bottom: 16px;
          letter-spacing: 0.5px;
          border-bottom: 1px solid rgba(212,175,55,0.2);
          padding-bottom: 6px;
        }
        .deposit-card {
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 20px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 8px 20px rgba(0,0,0,0.5);
          max-width: 600px;
          width: 100%;
          margin-bottom: 14px;
          text-decoration: none;
          transition: transform 0.2s ease, border-color 0.2s;
        }
        .deposit-card:hover {
          transform: translateY(-2px);
          border-color: #d4af37;
        }
        .deposit-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .deposit-icon-circle {
          background: rgba(212,175,55,0.15);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(212,175,55,0.4);
        }
        .deposit-icon-circle i {
          font-size: 20px;
          color: #d4af37;
        }
        .deposit-label {
          font-size: 14px;
          font-weight: 500;
          color: #ffffff;
        }
        .deposit-badge {
          background: linear-gradient(145deg, #d4af37, #b8960f);
          color: #0a0a0a;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 40px;
          margin-left: 6px;
          letter-spacing: 0.3px;
        }
        .deposit-arrow {
          background: rgba(212,175,55,0.1);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(212,175,55,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
        }
        .deposit-arrow:hover {
          background: rgba(212,175,55,0.2);
          border-color: #d4af37;
        }
        .deposit-arrow i {
          font-size: 16px;
          color: #d4af37;
        }
        .remove__blue {
          text-decoration: none;
          display: block;
        }
      `}</style>

      <div className="deposit-container">
        <h1 className="deposit-title">Choose Deposit Method</h1>

        {/* Visa / Mastercard Option */}
        <Link to="/card" className="remove__blue">
          <div className="deposit-card">
            <div className="deposit-left">
              <div className="deposit-icon-circle">
                <i className="fas fa-credit-card"></i>
              </div>
              <span className="deposit-label">Visa / Mastercard</span>
            </div>
            <div className="deposit-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>
          </div>
        </Link>

        {/* Crypto Currency Option */}
        <Link to="/support" className="remove__blue">
          <div className="deposit-card">
            <div className="deposit-left">
              <div className="deposit-icon-circle">
                <i className="fab fa-bitcoin"></i> {/* or fas fa-coins */}
              </div>
              <span className="deposit-label">Crypto Currency</span>
              <span className="deposit-badge">Popular</span>
            </div>
            <div className="deposit-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}

export default Deposit;