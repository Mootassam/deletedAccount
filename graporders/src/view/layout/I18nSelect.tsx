import React from 'react';
import { getLanguages, getLanguageCode, i18n } from '../../i18n';
import actions from 'src/modules/layout/layoutActions';

function I18nSelect() {
  const doChangeLanguage = (language) => {
    actions.doChangeLanguage(language);
  };

  return (
    <div className="i18n-container">
      <div className="language-header">
        <i className="fa-solid fa-language"></i>
        <h2>{i18n('pages.language.selectLanguage')}</h2>
        <p>{i18n('pages.language.choosePreferred')}</p>
      </div>

      <div className="languages-grid">
        {getLanguages().map((language) => (
          <div
            key={language.id}
            onClick={() => doChangeLanguage(language.id)}
            className={`language-card ${
              getLanguageCode() === language.id ? 'active' : ''
            }`}
          >
            <div className="language-flag">
              <img src={language.flag} alt={language.label} />
            </div>
            <div className="language-info">
              <span className="language-name">{language.label}</span>
              <span className="language-native">
                {language.nativeName || language.label}
              </span>
            </div>
            {getLanguageCode() === language.id && (
              <div className="selected-indicator">
                <i className="fa-solid fa-check"></i>
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        .i18n-container {
          max-width: 440px;
          margin: 0 auto;
          padding: 0px 16px 30px;
          background: #0a0a0a;
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #ffffff;
        }

        .language-header {
          text-align: center;
          margin-bottom: 24px;
          padding: 10px 0;
        }

        .language-header i {
          font-size: 42px;
          color: #d4af37;
          margin-bottom: 12px;
          display: block;
        }

        .language-header h2 {
          font-size: 22px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 6px 0;
        }

        .language-header p {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          margin: 0;
        }

        .languages-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .language-card {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }

        .language-card:hover {
          border-color: #d4af37;
          background: rgba(212,175,55,0.05);
          transform: translateY(-2px);
        }

        .language-card.active {
          background: rgba(212,175,55,0.15);
          border-color: #d4af37;
          box-shadow: 0 8px 20px rgba(212,175,55,0.2);
        }

        .language-flag {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          overflow: hidden;
          margin-right: 14px;
          border: 2px solid rgba(212,175,55,0.3);
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          flex-shrink: 0;
          background: #1a1a1a;
        }

        .language-card.active .language-flag {
          border-color: #d4af37;
        }

        .language-flag img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .language-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .language-name {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
        }

        .language-native {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          font-weight: 400;
        }

        .language-card.active .language-name,
        .language-card.active .language-native {
          color: #ffffff;
        }

        .selected-indicator {
          width: 24px;
          height: 24px;
          background: #d4af37;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 12px;
          flex-shrink: 0;
        }

        .selected-indicator i {
          font-size: 12px;
          color: #0a0a0a;
        }

        /* Loading animation for language change */
        .language-card.loading {
          pointer-events: none;
          opacity: 0.7;
        }

        .language-card.loading::after {
          content: '';
          position: absolute;
          top: 50%;
          right: 20px;
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid #d4af37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: translateY(-50%) rotate(0deg); }
          100% { transform: translateY(-50%) rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 480px) {
          .i18n-container {
            padding: 16px 12px;
          }
          
          .language-header {
            margin-bottom: 20px;
          }
          
          .language-header i {
            font-size: 36px;
          }
          
          .language-header h2 {
            font-size: 20px;
          }
          
          .language-card {
            padding: 10px 14px;
          }
          
          .language-flag {
            width: 36px;
            height: 36px;
            margin-right: 12px;
          }
          
          .language-name {
            font-size: 15px;
          }
          
          .language-native {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}

export default I18nSelect;