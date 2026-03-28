import React, { useEffect } from "react";
import "../styles/styles.css";
import { useSelector, useDispatch } from "react-redux";
import actions from "src/modules/category/list/categoryListActions";
import selector from "src/modules/category/list/categoryListSelectors";
import LoadingModal from "src/shared/LoadingModal";
import SubHeader from "src/view/shared/Header/SubHeader";
import { i18n } from "../../../i18n";

function Online() {
  const dispatch = useDispatch();

  const record = useSelector(selector.selectRows);
  const loading = useSelector(selector.selectLoading);

  useEffect(() => {
    dispatch(actions.doFetch());
    // eslint-disable-next-line
  }, [dispatch]);

  return (
    <div className="online-container">
      <SubHeader title={i18n('pages.online.title')} path="/" />

      <style>{`
        .online-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 0.75rem 1.5rem 0.75rem;
          background: #0a0a0a;
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #ffffff;
        }

        /* Description card - dark theme */
        .service-description-card {
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 20px;
          padding: 1rem;
          margin: 1rem 0;
        }

        .description-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .description-icon {
          font-size: 1.75rem;
          color: #d4af37;
        }

        .description-text {
          font-size: 12px;
          color: #e0e0e0;
          line-height: 1.5;
          margin: 0;
        }

        /* Agents list - grid layout */
        .support-agents-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          justify-content: center;
        }

        /* Agent card - dark theme with gold accents */
        .support-agent-card {
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 20px;
          padding: 1rem;
          transition: transform 0.2s ease, border-color 0.2s;
        }

        .support-agent-card:hover {
          transform: translateY(-2px);
          border-color: #d4af37;
        }

        .agent-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .agent-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #d4af37;
          margin: 0;
        }

        /* Platform badges - keep brand colors but adapt to dark theme */
        .platform-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: rgba(212,175,55,0.15);
          color: #d4af37;
          font-size: 1.1rem;
          border: 1px solid rgba(212,175,55,0.4);
        }

        .platform-badge.whatsApp {
          background-color: #25D366;
          color: #0a0a0a;
          border: none;
        }
        .platform-badge.telegram {
          background-color: #0088cc;
          color: #0a0a0a;
          border: none;
        }

        .agent-profile {
          position: relative;
          width: 90px;
          height: 90px;
          margin: 0 auto 0.75rem;
        }

        .agent-photo {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #d4af37;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }

        .status-indicator {
          position: absolute;
          bottom: 5px;
          right: 5px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-color: #4caf50;
          border: 2px solid #0a0a0a;
        }

        .agent-actions {
          margin-top: 0.75rem;
        }

        .contact-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: none;
          border-radius: 40px;
          font-size: 12px;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.2s, transform 0.1s;
          color: #ffffff;
        }

        .contact-button.whatsapp-button {
          background: linear-gradient(145deg, #25D366, #20b859);
        }
        .contact-button.whatsapp-button:hover {
          background: #20b859;
        }

        .contact-button.telegram-button {
          background: linear-gradient(145deg, #0088cc, #0077b3);
        }
        .contact-button.telegram-button:hover {
          background: #0077b3;
        }

        .button-icon {
          font-size: 14px;
        }

        .action-arrow {
          font-size: 10px;
          opacity: 0.8;
          margin-left: auto;
        }

        /* Responsive */
        @media (max-width: 640px) {
          .support-agents-list {
            grid-template-columns: 1fr;
          }
          .agent-profile {
            width: 80px;
            height: 80px;
          }
          .contact-button {
            font-size: 12px;
            padding: 0.5rem;
          }
        }
      `}</style>

      <div className="service-description-card">
        <div className="description-content">
          <i className="fa-solid fa-comments description-icon"></i>
          <p className="description-text">
            {i18n('pages.online.description')}
          </p>
        </div>
      </div>

      <div className="support-agents-list">
        {loading && <LoadingModal />}
        {!loading && record && record.map((item, index) => (
          <div className="support-agent-card" key={index}>
            <div className="agent-header">
              <h3 className="agent-title">{item?.name}</h3>
              <div className={`platform-badge ${item.type}`}>
                {item.type === "whatsApp" ? (
                  <i className="fa-brands fa-whatsapp"></i>
                ) : (
                  <i className="fa-brands fa-telegram"></i>
                )}
              </div>
            </div>

            <div className="agent-profile">
              <img
                src={item?.photo[0]?.downloadUrl}
                alt={`${item?.name}`}
                className="agent-photo"
              />
              <div className="status-indicator"></div>
            </div>

            <div className="agent-actions">
              {item.type === "whatsApp" ? (
                <a
                  href={`https://wa.me/${item.number}`}
                  className="contact-button whatsapp-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-whatsapp button-icon"></i>
                  <span>{i18n('pages.online.contactWhatsApp')}</span>
                  <i className="fa-solid fa-external-link action-arrow"></i>
                </a>
              ) : (
                <a
                  href={`https://t.me/${item.number}`}
                  className="contact-button telegram-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-telegram button-icon"></i>
                  <span>{i18n('pages.online.contactTelegram')}</span>
                  <i className="fa-solid fa-external-link action-arrow"></i>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Online;