import { i18n } from "../../../i18n";
import { Link } from "react-router-dom";

function Error500Page() {
  return (
    <div className="error-page-container">
      <div className="error-card">
        <div className="error-icon-wrapper">
          <i className="fa-solid fa-server error-icon"></i>
        </div>

        <h1 className="error-title">500 — Internal Server Error</h1>
        <p className="error-description">
          {i18n("errors.500") || "Something went wrong on our server. Please try again later."}
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
          background: radial-gradient(circle at 10% 30%, rgba(10, 132, 255, 0.03) 0%, transparent 30%),
                      radial-gradient(circle at 90% 70%, rgba(10, 132, 255, 0.03) 0%, transparent 30%),
                      #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        .error-card {
          max-width: 520px;
          width: 100%;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 48px;
          padding: 48px 40px;
          box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.15),
                      0 0 0 1px rgba(10, 132, 255, 0.1) inset,
                      0 0 40px rgba(10, 132, 255, 0.1);
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.5);
          animation: fadeScale 0.4s ease;
        }

        @keyframes fadeScale {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }

        .error-icon-wrapper {
          width: 120px;
          height: 120px;
          margin: 0 auto 24px;
          background: linear-gradient(135deg, #0a84ff 0%, #6ab0ff 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 15px 30px -8px rgba(10, 132, 255, 0.4);
        }

        .error-icon {
          font-size: 56px;
          color: white;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }

        .error-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1c1c1e;
          margin: 0 0 16px;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }

        .error-description {
          font-size: 1.2rem;
          color: #5e5e60;
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
          box-shadow: 0 8px 16px -6px rgba(0, 0, 0, 0.1);
        }

        .error-button.primary {
          background: #0a84ff;
          color: white;
        }

        .error-button.primary:hover {
          background: #0077e6;
          transform: translateY(-2px);
          box-shadow: 0 15px 25px -10px rgba(10, 132, 255, 0.5);
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
      `}</style>
    </div>
  );
}

export default Error500Page;