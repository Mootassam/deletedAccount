import { i18n } from "../../../i18n";
import { Link } from "react-router-dom";

function Error403Page() {
  return (
    <div className="error-page-container">
      <div className="error-card">
        <div className="error-icon-wrapper">
          <i className="fa-solid fa-car-lock error-icon"></i>
        </div>

        <h1 className="error-title">403 — Access Forbidden</h1>
        <p className="error-description">
          {i18n("errors.403") || "You don't have permission to access this page."}
        </p>

        <div className="error-actions">
          <Link to="/" className="error-link">
            <button className="error-button primary" type="button">
              <i className="fa-solid fa-house"></i>
              {i18n("errors.backToHome") || "Back to Home"}
            </button>
          </Link>
        </div>
      </div>

      <style>{`
        .error-page-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(135deg, #0a0a0a 0%, #0f0f0f 50%, #0a0a0a 100%);
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .error-card {
          max-width: 520px;
          width: 100%;
          background: rgba(15, 15, 15, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 48px;
          padding: 48px 40px;
          box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(212, 175, 55, 0.2) inset;
          text-align: center;
          border: 1px solid rgba(212, 175, 55, 0.25);
          animation: fadeScale 0.4s ease;
          transition: all 0.3s ease;
        }

        .error-card:hover {
          border-color: rgba(212, 175, 55, 0.5);
          box-shadow: 0 32px 64px -20px rgba(212, 175, 55, 0.2);
        }

        @keyframes fadeScale {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }

        .error-icon-wrapper {
          width: 120px;
          height: 120px;
          margin: 0 auto 24px;
          background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 15px 30px -8px rgba(212, 175, 55, 0.4);
          transition: transform 0.2s;
        }

        .error-icon-wrapper:hover {
          transform: scale(1.02);
        }

        .error-icon {
          font-size: 56px;
          color: #0a0a0a;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
        }

        .error-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          margin: 0 0 16px;
          letter-spacing: -0.5px;
          line-height: 1.2;
          background: linear-gradient(135deg, #ffffff 0%, #d4af37 80%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .error-description {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 32px;
          line-height: 1.6;
        }

        .error-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .error-link {
          text-decoration: none;
          display: inline-block;
        }

        .error-button {
          border: none;
          border-radius: 50px;
          padding: 14px 28px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 16px -6px rgba(0, 0, 0, 0.3);
        }

        .error-button.primary {
          background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
          color: #0a0a0a;
        }

        .error-button.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 25px -10px rgba(212, 175, 55, 0.5);
          background: linear-gradient(135deg, #e0b84d 0%, #c9a227 100%);
        }

        .error-button:active {
          transform: translateY(0);
        }

        @media (max-width: 640px) {
          .error-card {
            padding: 36px 24px;
            border-radius: 36px;
          }

          .error-icon-wrapper {
            width: 100px;
            height: 100px;
          }

          .error-icon {
            font-size: 48px;
          }

          .error-title {
            font-size: 2rem;
          }

          .error-description {
            font-size: 1rem;
          }

          .error-actions {
            flex-direction: column;
            gap: 12px;
          }

          .error-button {
            width: 100%;
            justify-content: center;
          }
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #1a1a1a;
        }

        ::-webkit-scrollbar-thumb {
          background: #d4af37;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #e0b84d;
        }
      `}</style>
    </div>
  );
}

export default Error403Page;