import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import authSelectors from "src/modules/auth/authSelectors";
import actions from "src/modules/user/form/userFormActions";
import selectors from "src/modules/user/form/userFormSelectors";
import { i18n } from "../../../i18n";

function InvitePage() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showNotAllowedModal, setShowNotAllowedModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const list = useSelector(selectors.selectList);
  const fetching = useSelector(selectors.selectFetchinigLoading);
  const currentUser = useSelector(authSelectors.selectCurrentUser);

  // Check if referral system is enabled for this user
  const isReferralEnabled = currentUser?.refsystem || false;

  useEffect(() => {
    dispatch(actions.getAllUserReference());
  }, [dispatch]);

  const handleInviteClick = () => {
    if (isReferralEnabled) {
      setShowModal(true);
    } else {
      setShowNotAllowedModal(true);
    }
  };

  const handleCopyRefCode = () => {
    navigator.clipboard.writeText(currentUser?.refcode || '');
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleShare = (platform) => {
    const refCode = currentUser?.refcode || '';
    const shareText = `Join me on this platform! Use my referral code: ${refCode}`;
    const shareUrl = window.location.origin;
    
    let shareLink = '';
    
    switch(platform) {
      case 'telegram':
        shareLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      default:
        return;
    }
    
    window.open(shareLink, '_blank', 'width=600,height=400');
  };

  const members = [
    { id: '138060', recharge: '0', withdraw: '0' },
    { id: '138480', recharge: '0', withdraw: '0' },
    { id: '138851', recharge: '0', withdraw: '0' },
    { id: '138852', recharge: '0', withdraw: '0' },
    { id: '138853', recharge: '0', withdraw: '0' },
    { id: '138854', recharge: '0', withdraw: '0' },
  ];

  if (fetching) {
    return (
      <div className="invite-page loading-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>{i18n('table.loading')}</p>
        </div>
        <style>{`
          .loading-page {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .loading-spinner {
            text-align: center;
            color: white;
            z-index: 10;
          }
          
          .spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
            margin: 0 auto 20px;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="invite-page">
      {/* Abstract decorative circles */}
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>
      <div className="circle circle-3"></div>

      <div className="content">
        {/* Section 1: Team amount (on gradient) */}
        <div className="team-section">
          <h2 className="team-title">{i18n('pages.invitation.teamAmount')}</h2>

          <div className="stats-row">
            <div className="stat-item">
              <div className="stat-number">{list?.totalDailyInvitations || 0}</div>
              <div className="stat-label">{i18n('pages.invitation.stats.dailyInvitations')}</div>
            </div>
            <div className="stat-item with-divider">
              <div className="stat-number">{list?.totalMonthlyInvitations || 0}</div>
              <div className="stat-label">{i18n('pages.invitation.stats.monthlyInvitations')}</div>
            </div>
            <div className="stat-item with-divider">
              <div className="stat-number">${list?.totalMonthlyIncome || 0}</div>
              <div className="stat-label">{i18n('pages.invitation.stats.monthlyIncome')}</div>
            </div>
          </div>

          <button className="rules-button" onClick={handleInviteClick}>
            {i18n('pages.invitation.rulesButton')}
          </button>
        </div>

        {/* Section 2: New agent in (light card) */}
        <div className="table-card">
          <h3 className="table-title">{i18n('pages.invitation.newAgents')}</h3>

          <div className="table">
            <div className="table-header">
              <div className="table-cell">{i18n('pages.invitation.table.memberId')}</div>
              <div className="table-cell">{i18n('pages.invitation.table.recharge')}</div>
              <div className="table-cell">{i18n('pages.invitation.table.withdraw')}</div>
            </div>

            {list?.referrals && list.referrals.length > 0 && list.referrals.map((member) => (
              <div className="table-row" key={member.id || member.memberId}>
                <div className="table-cell">{member.memberId || member.id}</div>
                <div className="table-cell">${member.recharge}</div>
                <div className="table-cell">${member.withdraw}</div>
              </div>
            ))}
          </div>

          <div className="no-more-data">{i18n('pages.invitation.noMoreData')}</div>
        </div>
      </div>

      {/* Referral Modal (shown when referral is enabled) */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            
            {/* Company Logo */}
            <div className="logo-container">
              <div className="company-logo">
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="30" cy="30" r="28" stroke="url(#gradient)" strokeWidth="2" fill="url(#logoGradient)"/>
                  <path d="M20 25L30 35L40 25" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="30" cy="30" r="6" fill="white" opacity="0.8"/>
                  <defs>
                    <linearGradient id="gradient" x1="2" y1="2" x2="58" y2="58" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#FF6AC1"/>
                      <stop offset="0.5" stopColor="#7A4EF0"/>
                      <stop offset="1" stopColor="#3D9EFF"/>
                    </linearGradient>
                    <linearGradient id="logoGradient" x1="2" y1="2" x2="58" y2="58" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#2b1a5c"/>
                      <stop offset="1" stopColor="#1d3b6f"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h3 className="modal-title">{i18n('pages.invitation.modal.title')}</h3>
            </div>
            
            <div className="ref-code-section">
              <p className="ref-code-label">{i18n('pages.invitation.modal.referralCodeLabel')}</p>
              <div className="ref-code-box">
                <span className="ref-code">{currentUser?.refcode || 'REF123456'}</span>
                <button className="copy-button" onClick={handleCopyRefCode}>
                  {copySuccess ? '✓' : i18n('pages.invitation.modal.copy')}
                </button>
              </div>
            </div>

            <div className="share-section">
              <p className="share-label">{i18n('pages.invitation.modal.shareLabel')}</p>
              <div className="share-buttons">
                <button className="share-btn telegram" onClick={() => handleShare('telegram')} title="Share on Telegram">
                  <svg className="share-icon" viewBox="0 0 24 24" width="24" height="24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.966 9.274c-.146.658-.537.818-1.088.509l-3-2.213-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.053-.333-.373-.121l-6.871 4.326-2.96-.924c-.644-.2-.656-.644.135-.953l11.57-4.458c.537-.194 1.006.128.832.941z" fill="currentColor"/>
                  </svg>
                </button>
                <button className="share-btn whatsapp" onClick={() => handleShare('whatsapp')} title="Share on WhatsApp">
                  <svg className="share-icon" viewBox="0 0 24 24" width="24" height="24">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.137.56 4.146 1.54 5.894L.056 23.944l6.132-1.446C7.804 23.418 9.844 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.855 0-3.617-.512-5.13-1.406l-.368-.22-3.642.86.874-3.512-.243-.396C2.574 16.47 2 14.3 2 12 2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm5.126-7.502c-.281-.141-1.663-.82-1.92-.914-.258-.094-.446-.141-.634.141-.188.281-.73.914-.895 1.102-.165.188-.33.211-.611.07-.281-.14-1.187-.437-2.26-1.394-.835-.746-1.4-1.667-1.564-1.949-.164-.281-.018-.433.123-.573.129-.129.281-.33.422-.496.141-.165.188-.281.282-.469.094-.188.047-.352-.023-.493-.07-.141-.634-1.526-.87-2.09-.228-.543-.46-.469-.634-.477-.164-.008-.352-.008-.54-.008-.188 0-.493.07-.751.352-.258.281-.985.963-.985 2.348 0 1.385 1.008 2.723 1.148 2.91.141.188 1.984 3.03 4.807 4.25 2.823 1.22 2.823.813 3.332.762.51-.05 1.645-.672 1.877-1.32.232-.649.232-1.204.164-1.32-.07-.117-.258-.188-.54-.33z" fill="currentColor"/>
                  </svg>
                </button>
                <button className="share-btn facebook" onClick={() => handleShare('facebook')} title="Share on Facebook">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg" alt="" className="share-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Not Allowed Modal (shown when referral is disabled) */}
      {showNotAllowedModal && (
        <div className="modal-overlay" onClick={() => setShowNotAllowedModal(false)}>
          <div className="modal-content not-allowed-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowNotAllowedModal(false)}>×</button>
            
            <div className="not-allowed-icon">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="36" stroke="#FF6AC1" strokeWidth="3" fill="url(#notAllowedGradient)"/>
                <path d="M27 27L53 53M53 27L27 53" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="notAllowedGradient" x1="4" y1="4" x2="76" y2="76" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2b1a5c"/>
                    <stop offset="1" stopColor="#1d3b6f"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            <h3 className="not-allowed-title">{i18n('pages.invitation.notAllowed.title')}</h3>
            
            <p className="not-allowed-message">
              {i18n('pages.invitation.notAllowed.message')}
            </p>
            
            <p className="not-allowed-submessage">
              {i18n('pages.invitation.notAllowed.submessage')}
            </p>

            <div className="not-allowed-actions">
              <button className="contact-support-btn" onClick={() => window.location.href = '/support'}>
                {i18n('pages.invitation.notAllowed.contactSupport')}
              </button>
              <button className="got-it-btn" onClick={() => setShowNotAllowedModal(false)}>
                {i18n('pages.invitation.notAllowed.gotIt')}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .invite-page {
          position: relative;
          min-height: 100vh;
          background: linear-gradient(145deg, #f9fafc 0%, #f0f3f7 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 16px;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        /* Abstract circles - just changing colors */
        .circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.2;
          z-index: 0;
        }

        .circle-1 {
          width: 300px;
          height: 300px;
          background: #0A84FF;
          top: -100px;
          left: -100px;
        }

        .circle-2 {
          width: 400px;
          height: 400px;
          background: #5856D6;
          bottom: -150px;
          right: -150px;
        }

        .circle-3 {
          width: 350px;
          height: 350px;
          background: #34C759;
          top: 30%;
          left: 20%;
        }

        .content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 400px;
        }

        /* Team section - only changing button color */
        .team-section {
          color: #1c1c1e;
          margin-bottom: 32px;
        }

        .team-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 28px;
          text-align: center;
          letter-spacing: -0.3px;
        }

        .stats-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 36px;
        }

        .stat-item {
          flex: 1;
          text-align: center;
          position: relative;
        }

        .stat-item.with-divider::before {
          content: '';
          position: absolute;
          left: 0;
          top: 10%;
          height: 80%;
          width: 1px;
          background: rgba(0, 0, 0, 0.1);
        }

        .stat-number {
          font-size: 32px;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 6px;
          color: #1c1c1e;
        }

        .stat-label {
          font-size: 12px;
          font-weight: 400;
          opacity: 0.7;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          color: #5e5e60;
        }

        .rules-button {
          display: block;
          width: 100%;
          background: #0A84FF;
          border: none;
          border-radius: 60px;
          padding: 14px 16px;
          font-size: 15px;
          font-weight: 500;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 8px 16px -6px rgba(10, 132, 255, 0.3);
          text-align: center;
        }

        .rules-button:hover {
          background: #0071e3;
        }

        /* Table card - only changing background to white */
        .table-card {
          background: #ffffff;
          border-radius: 32px;
          padding: 24px 16px;
          box-shadow: 0 10px 18px -8px rgba(0, 0, 0, 0.08);
        }

        .table-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a2639;
          margin-bottom: 16px;
          padding-left: 4px;
        }

        .table {
          width: 100%;
        }

        .table-header {
          display: flex;
          padding: 12px 0 8px 0;
          border-bottom: 1px solid #dce3ec;
          font-size: 13px;
          font-weight: 600;
          color: #4a5c72;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .table-row {
          display: flex;
          padding: 12px 0;
          border-bottom: 1px solid #e6ecf5;
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .table-cell {
          flex: 1;
          font-size: 14px;
          color: #1e2f41;
          position: relative;
        }

        .table-cell:not(:first-child) {
          text-align: center;
        }

        .table-cell:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0;
          top: 10%;
          height: 80%;
          width: 1px;
          background: #dce3ec;
        }

        .no-more-data {
          text-align: center;
          font-size: 13px;
          color: #a0b2c4;
          margin-top: 24px;
          font-weight: 400;
        }

        /* Modal Styles - only changing button colors */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        .modal-content {
          background: white;
          border-radius: 32px;
          padding: 32px 24px;
          max-width: 400px;
          width: 90%;
          position: relative;
          animation: slideUp 0.3s ease;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
        }

        .not-allowed-modal {
          text-align: center;
          max-width: 360px;
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #999;
          transition: color 0.2s;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          z-index: 2;
        }

        .modal-close:hover {
          color: #333;
          background: #f0f0f0;
        }

        .logo-container {
          text-align: center;
          margin-bottom: 24px;
        }

        .company-logo {
          margin-bottom: 16px;
          display: inline-block;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }

        .modal-title {
          font-size: 24px;
          font-weight: 600;
          color: #1a2639;
          margin: 0;
        }

        .ref-code-section {
          margin-bottom: 28px;
        }

        .ref-code-label {
          font-size: 14px;
          color: #4a5c72;
          margin-bottom: 8px;
          text-align: center;
        }

        .ref-code-box {
          display: flex;
          gap: 8px;
          background: linear-gradient(145deg, #f0f4fa 0%, #e8edf5 100%);
          border-radius: 16px;
          padding: 4px;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .ref-code {
          flex: 1;
          padding: 16px 20px;
          font-size: 20px;
          font-weight: 700;
          color: #1a2639;
          background: white;
          border-radius: 12px;
          text-align: center;
          letter-spacing: 2px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .copy-button {
          background: #0A84FF;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 0 24px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          min-width: 80px;
          box-shadow: 0 4px 12px rgba(10, 132, 255, 0.3);
        }

        .copy-button:hover {
          background: #0071e3;
        }

        .share-section {
          text-align: center;
        }

        .share-label {
          font-size: 14px;
          color: #4a5c72;
          margin-bottom: 16px;
        }

        .share-buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
        }

        .share-btn {
          width: 56px;
          height: 56px;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .share-btn:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .share-btn:active {
          transform: translateY(0) scale(0.95);
        }

        .share-icon {
          width: 28px;
          height: 28px;
        }

        .share-btn.telegram {
          background: #0088cc;
          color: white;
        }

        .share-btn.telegram:hover {
          background: #0099ff;
        }

        .share-btn.whatsapp {
          background: #25D366;
          color: white;
        }

        .share-btn.whatsapp:hover {
          background: #34e97a;
        }

        .share-btn.facebook {
          background: #1877f2;
          color: white;
        }

        .share-btn.facebook:hover {
          background: #2a86ff;
        }

        /* Not Allowed Modal Specific Styles - only changing button colors */
        .not-allowed-icon {
          margin: 16px 0 24px;
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .not-allowed-title {
          font-size: 24px;
          font-weight: 700;
          color: #2b1a5c;
          margin-bottom: 16px;
        }

        .not-allowed-message {
          font-size: 18px;
          font-weight: 500;
          color: #1a2639;
          margin-bottom: 12px;
        }

        .not-allowed-submessage {
          font-size: 14px;
          color: #6b7f94;
          line-height: 1.5;
          margin-bottom: 24px;
          padding: 0 8px;
        }

        .not-allowed-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .contact-support-btn {
          background: #0A84FF;
          color: white;
          border: none;
          border-radius: 30px;
          padding: 12px 24px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          flex: 1;
          max-width: 160px;
          box-shadow: 0 4px 12px rgba(10, 132, 255, 0.3);
        }

        .contact-support-btn:hover {
          background: #0071e3;
        }

        .got-it-btn {
          background: transparent;
          color: #4a5c72;
          border: 2px solid #e0e7f0;
          border-radius: 30px;
          padding: 12px 24px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          flex: 1;
          max-width: 160px;
        }

        .got-it-btn:hover {
          background: #f0f4fa;
          border-color: #4a5c72;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
          .share-buttons {
            gap: 12px;
          }
          
          .share-btn {
            width: 48px;
            height: 48px;
          }
          
          .share-icon {
            width: 24px;
            height: 24px;
          }

          .not-allowed-actions {
            flex-direction: column;
            align-items: center;
          }

          .contact-support-btn,
          .got-it-btn {
            max-width: 100%;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default InvitePage;
