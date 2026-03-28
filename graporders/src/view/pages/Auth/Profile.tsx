import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import authActions from "src/modules/auth/authActions";
import authSelectors from "src/modules/auth/authSelectors";
import actions from "src/modules/record/list/recordListActions";
import selectors from "src/modules/record/list/recordListSelectors";
import Message from "src/view/shared/message";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import yupFormSchemas from "src/modules/shared/yup/yupFormSchemas";
import { i18n } from "../../../i18n";
import ImagesFormItem from "src/shared/form/ImagesFormItems";
import Storage from "src/security/storage";
import SubHeader from "src/view/shared/Header/SubHeader";

const schema = yup.object().shape({
  avatars: yupFormSchemas.images(i18n("inputs.avatars"), {
    max: 1,
  }),
});

function Profile() {
  const dispatch = useDispatch();
  const history = useHistory();
  const totalperday = useSelector(selectors.selectTotalPerday);
  const currentUser = useSelector(authSelectors.selectCurrentUser);

  const [recharge, setRecharge] = useState(false);
  const [deposit, setDeposit] = useState(false);
  const [showReputation, setShowReputation] = useState(false);
  // NEW: state for verification modal
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const referenceCodeRef = useRef(null);

  useEffect(() => {
    const values = { status: "completed" };
    dispatch(actions.doCountDay());
    dispatch(actions.doFetch(values, values));
  }, [dispatch]);

  const doSignout = () => {
    dispatch(authActions.doSignout());
  };

  const [initialValues] = useState(() => {
    const record = currentUser || {};
    return {
      avatars: record.avatars || [],
    };
  });

  const form = useForm({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: initialValues,
  });

  const goto = (param) => {
    history.push(param);
  };

  const copyToClipboardCoupon = () => {
    const referenceCode = referenceCodeRef.current.innerText;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(referenceCode)
        .then(() => Message.success(i18n('pages.profile.copied')))
        .catch((error) => console.error("Error copying to clipboard:", error));
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = referenceCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      Message.success(i18n('pages.profile.copied'));
    }
  };

  // Helper to mask phone number
  const getMaskedPhone = () => {
    const phone = currentUser?.phone || "567***229";
    if (phone && phone.length > 6) {
      return phone.slice(0, 3) + "***" + phone.slice(-3);
    }
    return phone;
  };

  const userScore = currentUser?.score || 0;

  // Menu items – all icons replaced with Font Awesome car‑themed alternatives
  const menuItems = {
    main: [
      {
        icon: "fas fa-wallet",
        name: i18n('pages.profile.recharge'),
        action: () => goto("/deposit"),
      },

      {
        icon: "fas fa-arrow-up",
        name: i18n('pages.profile.withdraw'),
        action: () => goto("/withdraw"),
      },
      {
        icon: "fas fa-id-card",
        name: i18n('pages.profile.bindAccount'),
        action: () => goto("/bind-account"),
      },
      {
        icon: "fas fa-file-alt",
        name: i18n('pages.profile.details'),
        action: () => goto("/details"),
      },
    ],
    other: [
      {
        icon: "fas fa-globe",
        name: i18n('pages.profile.officialWebsite'),
        action: () => window.open("https://GoToMarketersers.com", "_blank"),
      },
      {
        icon: "fas fa-certificate",
        name: "MSB Certification",
        action: () => goto("/msb-certification"),
      },
      {
        icon: "fas fa-star",
        name: i18n('pages.profile.reputation.title'),
        action: () => setShowReputation(true),
      },
      {
        icon: "fas fa-calendar-alt",
        name: i18n('pages.activities.title'),
        action: () => goto("/activities"),
      },
      {
        icon: "fas fa-crown",
        name: i18n('pages.vip.title'),
        action: () => goto("/vip"),
      },
      {
        icon: "fas fa-headset",
        name: i18n('pages.profile.contactUs'),
        action: () => goto("/support"),
      },
      {
        icon: "fas fa-key",
        name: i18n('pages.profile.changeLoginPassword'),
        action: () => goto("/security"),
      },
      {
        icon: "fas fa-lock",
        name: i18n('pages.profile.changeWithdrawPassword'),
        action: () => goto("/change-withdrawal-password"),
      },
      {
        icon: "fas fa-language",
        name: i18n('pages.profile.languages'),
        action: () => goto("/language"),
      },
      {
        icon: "fas fa-question-circle",
        name: i18n('pages.help.title'),
        action: () => goto("/help"),
      },
      {
        icon: "fas fa-info-circle",
        name: i18n('pages.actions.company'),
        action: () => goto("/company"),
      },

      {
        icon: "fas fa-sign-out-alt",
        name: i18n('pages.profile.logout'),
        action: doSignout,
      },
    ],
  };

  return (
    <div className="profile-container">
      <SubHeader title={i18n('pages.profile.title')} path="/profile" />

      {/* User Info Section with car‑themed background */}
      <div className="user-info-section">
        <div className="user-avatar">
          <FormProvider {...form}>
            <form>
              <ImagesFormItem
                name="avatars"
                storage={Storage.values.userAvatarsProfiles}
                max={1}
              />
            </form>
          </FormProvider>
        </div>
        <div className="user-details">
          <div className="user-phone">{currentUser?.email || "131784"}</div>
          <div className="user-uid">{i18n('pages.profile.uid')}: {currentUser?.mnemberId || "131784"}</div>
          <div className="invitation-row">
            <span className="invitation-label">{i18n('pages.profile.invitationCode')}:</span>
            <span ref={referenceCodeRef} className="invitation-code">
              {currentUser.refsystem ? currentUser?.refcode || "64WS65" : "******"}
            </span>
            <i
              className="fa-regular fa-copy copy-icon"
              onClick={copyToClipboardCoupon}
            />
          </div>
        </div>
      </div>

      {/* ========== NEW: Verification Status Card ========== */}
      <div className="verification-card">
        <div className="verification-icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <div className="verification-content">
          <div className="verification-title">
            {i18n('pages.profile.verifiedStatus.notVerified')}
          </div>

        </div>
        <Link to="/" style={{ textDecoration: 'none' }} className="verification-button">


          {i18n('pages.profile.verifyButton')}
        </Link>
      </div>

      {/* Menu Sections */}
      <div className="menu-sections">
        {/* Main Function - Horizontal Tiles */}
        <div className="menu-section">
          <div className="section-title">{i18n('pages.profile.mainFunction')}</div>
          <div className="main-function-items">
            {menuItems.main.map((item, index) => (
              <div
                key={index}
                className="main-function-item"
                onClick={item.action}
              >
                <div className="main-icon-circle">
                  <i className={item.icon} />
                </div>
                <span className="main-item-label">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Other Function - Vertical List */}
        <div className="menu-section">
          <div className="section-title">{i18n('pages.profile.otherFunction')}</div>
          <div className="section-items">
            {menuItems.other.map((item, index) => (
              <div
                key={index}
                className="menu-item"
                onClick={item.action}
              >
                <div className="item-left">
                  <i className={item.icon}></i>
                  <span>{item.name}</span>
                </div>
                <i className="fa fa-arrow-right item-arrow"></i>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recharge Modal */}
      {recharge && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title">{i18n('pages.profile.rechargeModal.title')}</div>
              <i
                className="fa fa-close modal-close"
                onClick={() => setRecharge(false)}
              />
            </div>
            <p className="modal-text">
              {i18n('pages.profile.rechargeModal.text')}
            </p>
            <div
              className="modal-confirm"
              onClick={() => goto("/support")}
            >
              {i18n('pages.profile.confirm')}
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}


      {/* Reputation Modal */}
      {showReputation && (
        <div className="modal-overlay" onClick={() => setShowReputation(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{i18n('pages.profile.reputation.title')}</div>
              <i
                className="fa fa-close modal-close"
                onClick={() => setShowReputation(false)}
              />
            </div>
            <div className="reputation-score">
              {userScore}
            </div>
            <div className="progress-labels">
              <span>0</span>
              <span>80</span>
              <span>100</span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${Math.min(userScore, 100)}%` }}
              />
            </div>
            <p className="reputation-description">
              {i18n('pages.profile.reputation.description')}
            </p>
          </div>
        </div>
      )}

      {/* ========== NEW: Verification Modal ========== */}
      {showVerificationModal && (
        <div className="modal-overlay" onClick={() => setShowVerificationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{i18n('pages.profile.verificationModal.title')}</div>
              <i
                className="fa fa-close modal-close"
                onClick={() => setShowVerificationModal(false)}
              />
            </div>
            <p className="modal-text">
              {i18n('pages.profile.verificationModal.text')}
            </p>
            <div
              className="modal-confirm"
              onClick={() => {
                goto("/");
                setShowVerificationModal(false);
              }}
            >
              {i18n('pages.profile.verificationModal.continue')}
            </div>
          </div>
        </div>
      )}

      {/* Luxury Car Theme Styles */}
      <style>{`
        .profile-container {
          background: #0a0a0a;
          min-height: 100vh;
          color: #ffffff;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* User Info Section with subtle car pattern */
        .user-info-section {
          background: linear-gradient(145deg, #1a1a1a, #0a0a0a);
          border-bottom: 1px solid rgba(212, 175, 55, 0.3);
          min-height: 160px;
          width: 100%;
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 16px;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
        }

        .user-info-section::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.05"><path d="M20 40 L30 20 L45 25 L55 10 L70 20 L80 35 L70 50 L55 60 L40 55 L25 50 Z" fill="%23d4af37"/></svg>');
          background-size: 80px 80px;
          pointer-events: none;
          z-index: 1;
        }

        .user-avatar {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          overflow: hidden;
          background: #1e1e1e;
          border: 2px solid #d4af37;
          flex-shrink: 0;
          z-index: 2;
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
        }

        .user-avatar .images-form-item {
          width: 100%;
          height: 100%;
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(50%);
        }

        .user-details {
          flex: 1;
          z-index: 2;
        }

        .user-phone {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 4px;
          color: #ffffff;
          letter-spacing: 0.5px;
        }

        .user-uid {
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          margin-bottom: 8px;
        }

        .invitation-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          width: fit-content;
          background: rgba(212,175,55,0.1);
          padding: 4px 12px 4px 8px;
          border-radius: 40px;
          border: 1px solid rgba(212,175,55,0.3);
        }

        .invitation-label {
          color: rgba(255,255,255,0.8);
        }

        .invitation-code {
          font-family: monospace;
          font-weight: 600;
          letter-spacing: 0.5px;
          color: #d4af37;
        }

        .copy-icon {
          cursor: pointer;
          color: #d4af37;
          font-size: 14px;
          transition: opacity 0.2s;
        }

        .copy-icon:hover {
          opacity: 0.8;
        }

        /* ========== NEW: Verification Card Styles ========== */
        .verification-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(212, 175, 55, 0.1);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 20px;
          padding: 16px 18px;
          margin: 16px 16px 24px 16px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        }

        .verification-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d4af37;
          font-size: 24px;
          flex-shrink: 0;
        }

        .verification-content {
          flex: 1;
        }

        .verification-title {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 4px;
        }

        .verification-text {
          font-size: 13px;
          color: rgba(255,255,255,0.7);
          line-height: 1.4;
        }

        .verification-button {
          background: linear-gradient(145deg, #d4af37, #b8960f);
          border: none;
          border-radius: 30px;
          padding: 10px 18px;
          color: #0a0a0a;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.2s;
          white-space: nowrap;
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 4px 12px rgba(212,175,55,0.3);
        }

        .verification-button:hover {
          transform: scale(1.02);
          background: linear-gradient(145deg, #e0b84d, #c9a227);
          box-shadow: 0 6px 16px rgba(212,175,55,0.5);
        }

        .verification-button:active {
          transform: scale(0.98);
        }

        /* Menu Sections */
        .menu-sections {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding: 30px 16px 20px 16px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          letter-spacing: 0.5px;
          color: #d4af37;
          padding: 0 0 12px 0;
          margin-bottom: 16px;
          border-bottom: 1px solid rgba(212,175,55,0.2);
        }

        /* Main Function - Horizontal Tiles */
        .main-function-items {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: space-between;
        }

        .main-function-item {
          flex: 1 1 0;
          min-width: 70px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          border-radius: 20px;
          transition: background 0.2s, transform 0.1s;
        }

        .main-function-item:hover {
          background: rgba(212,175,55,0.1);
          border-color: #d4af37;
          transform: translateY(-2px);
        }

        .main-icon-circle {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(212,175,55,0.15);
          color: #d4af37;
          font-size: 24px;
          border: 1px solid rgba(212,175,55,0.4);
        }

        .main-item-label {
          font-size: 13px;
          font-weight: 500;
          text-align: center;
          color: rgba(255,255,255,0.9);
        }

        /* Other Function - Vertical List */
        .section-items {
          display: flex;
          flex-direction: column;
          background: rgba(255,255,255,0.02);
          border-radius: 24px;
          border: 1px solid rgba(212,175,55,0.2);
          overflow: hidden;
        }

        .menu-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px;
          cursor: pointer;
          transition: background 0.2s;
          border-bottom: 1px solid rgba(212,175,55,0.1);
          color: #ffffff;
        }

        .menu-item:last-child {
          border-bottom: none;
        }

        .menu-item:hover {
          background: rgba(212,175,55,0.05);
        }

        .item-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .item-left i {
          width: 24px;
          color: #d4af37;
          font-size: 18px;
          text-align: center;
        }

        .item-left span {
          font-size: 15px;
          color: #ffffff;
        }

        .item-arrow {
          color: rgba(212,175,55,0.6);
          font-size: 14px;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: #1a1a1a;
          color: #ffffff;
          border-radius: 28px;
          width: 90%;
          max-width: 340px;
          padding: 24px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.3);
          border: 1px solid rgba(212,175,55,0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 600;
          color: #d4af37;
        }

        .modal-close {
          cursor: pointer;
          font-size: 22px;
          color: rgba(255,255,255,0.6);
          transition: color 0.2s;
        }

        .modal-close:hover {
          color: #d4af37;
        }

        .modal-text {
          margin-bottom: 24px;
          line-height: 1.6;
          color: rgba(255,255,255,0.8);
        }

        .modal-confirm {
          background: #d4af37;
          color: #0a0a0a;
          text-align: center;
          padding: 14px;
          border-radius: 40px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          border: none;
        }

        .modal-confirm:hover {
          background: #e0b84d;
          transform: scale(1.02);
        }

        /* Reputation modal */
        .reputation-score {
          font-size: 28px;
          font-weight: bold;
          text-align: center;
          margin: 16px 0 8px;
          color: #d4af37;
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 4px;
          padding: 0 4px;
        }

        .progress-bar-container {
          height: 8px;
          background: #2a2a2a;
          border-radius: 4px;
          margin: 8px 0 16px;
          overflow: hidden;
          position: relative;
          border: 1px solid rgba(212,175,55,0.3);
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #d4af37, #f5d742);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-bar-container::after {
          content: '';
          position: absolute;
          top: 0;
          left: 80%;
          width: 2px;
          height: 100%;
          background: #d4af37;
          opacity: 0.5;
        }

        .reputation-description {
          font-size: 13px;
          line-height: 1.6;
          color: rgba(255,255,255,0.7);
          text-align: left;
          margin-top: 16px;
        }

        /* Responsive */
        @media (max-width: 400px) {
          .user-info-section {
            min-height: 140px;
            padding: 16px 12px;
          }
          .user-phone {
            font-size: 18px;
          }
          .invitation-row {
            font-size: 13px;
          }
          .main-icon-circle {
            width: 46px;
            height: 46px;
            font-size: 20px;
          }
          .main-item-label {
            font-size: 12px;
          }
          .menu-item {
            padding: 14px 16px;
          }
          .verification-card {
            padding: 14px 16px;
            margin: 12px 12px 20px 12px;
          }
          .verification-icon {
            width: 42px;
            height: 42px;
            font-size: 20px;
          }
          .verification-title {
            font-size: 15px;
          }
          .verification-text {
            font-size: 12px;
          }
          .verification-button {
            padding: 8px 14px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}

export default Profile;