import React from 'react'
import SubHeader from 'src/view/shared/Header/SubHeader'
import { Link } from 'react-router-dom'
import { i18n } from '../../../i18n'

function BindAccount() {
  return (
    <>
      <SubHeader title={i18n('pages.bindAccount.title')} path="/profile" />
      
      <style>{`
        .bind-container {
          min-height: 100vh;
          padding: 16px;
          background: #0a0a0a;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #ffffff;
        }
        .bind-title {
          font-size: 16px;
          font-weight: 600;
          color: #d4af37;
          margin-bottom: 16px;
          letter-spacing: 0.5px;
          border-bottom: 1px solid rgba(212,175,55,0.2);
          padding-bottom: 6px;
        }
        .bind-card {
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
        .bind-card:hover {
          transform: translateY(-2px);
          border-color: #d4af37;
        }
        .bind-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .bind-icon-circle {
          background: rgba(212,175,55,0.15);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(212,175,55,0.4);
        }
        .bind-icon-circle i {
          font-size: 20px;
          color: #d4af37;
        }
        .bind-label {
          font-size: 14px;
          font-weight: 500;
          color: #ffffff;
        }
        .bind-badge {
          background: linear-gradient(145deg, #d4af37, #b8960f);
          color: #0a0a0a;
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 40px;
          margin-left: 6px;
          letter-spacing: 0.3px;
        }
        .bind-arrow {
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
        .bind-arrow:hover {
          background: rgba(212,175,55,0.2);
          border-color: #d4af37;
        }
        .bind-arrow i {
          font-size: 16px;
          color: #d4af37;
        }
        .bind-subtitle {
          font-size: 16px;
          font-weight: 600;
          color: #d4af37;
          margin: 24px 0 16px 0;
          border-bottom: 1px solid rgba(212,175,55,0.2);
          padding-bottom: 6px;
        }
        .remove__blue {
          text-decoration: none;
          display: block;
        }
      `}</style>

      <div className="bind-container">
        <h1 className="bind-title">{i18n('pages.bindAccount.currentBankTitle')}</h1>
        <Link to="/bank_details" className="remove__blue">
          <div className="bind-card">
            <div className="bind-left">
              <div className="bind-icon-circle">
                <i className="fas fa-university"></i>
              </div>
              <span className="bind-label">{i18n('pages.bindAccount.bank')}</span>
            </div>
            <div className="bind-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>
          </div>
        </Link>

        <h2 className="bind-subtitle">{i18n('pages.bindAccount.cryptoTitle')}</h2>
        
        <Link to="/wallet" className="remove__blue">
          <div className="bind-card">
            <div className="bind-left">
              <div className="bind-icon-circle">
                <i className="fas fa-wallet"></i>
              </div>
              <span className="bind-label">{i18n('pages.bindAccount.cryptoLabel')}</span>
              <span className="bind-badge">{i18n('pages.bindAccount.popular')}</span>
            </div>
            <div className="bind-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>
          </div>
        </Link>
      </div>
    </>
  )
}

export default BindAccount