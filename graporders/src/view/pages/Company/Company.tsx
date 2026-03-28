import React, { useEffect } from "react";
import SubHeader from "src/view/shared/Header/SubHeader";
import actions from 'src/modules/company/list/companyListActions'
import selectors from 'src/modules/company/list/companyListSelectors' 
import { useDispatch, useSelector } from "react-redux";
import LoadingModal from "src/shared/LoadingModal";
import { i18n } from "../../../i18n";

function Company() {
  const dispatch = useDispatch();

  const record = useSelector(selectors.selectRows); 
  const loading = useSelector(selectors.selectLoading);

  const doFetch = () => { 
    dispatch(actions.doFetch());
  };

  useEffect(() => {
    doFetch();
  }, [dispatch]);

  return (
    <div className="company-page">
      <SubHeader title={i18n('pages.actions.company')} path="/" />

      <div className="company-content">
        {loading && <LoadingModal />}
        {record && record[0]?.companydetails && (
          <div 
            className="company-details"
            dangerouslySetInnerHTML={{ __html: record[0]?.companydetails }}
          />
        )}
      </div>

      <style>{`
        .company-page {
          background: #0a0a0a;
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .company-content {
          max-width: 700px;
          margin: 0 auto;
          padding: 24px 16px;
        }

        .company-details {
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 24px;
          padding: 24px;
          color: rgba(255,255,255,0.9);
          line-height: 1.6;
          font-size: 15px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.5);
        }

        .company-details p {
          margin: 0 0 16px 0;
        }

        .company-details p:last-child {
          margin-bottom: 0;
        }

        .company-details h1,
        .company-details h2,
        .company-details h3,
        .company-details h4,
        .company-details h5,
        .company-details h6 {
          color: #d4af37;
          margin: 24px 0 16px 0;
          font-weight: 600;
        }

        .company-details a {
          color: #d4af37;
          text-decoration: underline;
          transition: color 0.2s;
        }

        .company-details a:hover {
          color: #e0b84d;
        }

        .company-details strong {
          color: #d4af37;
          font-weight: 600;
        }

        .company-details ul,
        .company-details ol {
          padding-left: 24px;
          margin: 16px 0;
        }

        .company-details li {
          margin: 8px 0;
        }

        .company-details blockquote {
          border-left: 3px solid #d4af37;
          padding-left: 16px;
          margin: 16px 0;
          color: rgba(255,255,255,0.7);
          font-style: italic;
        }

        @media (max-width: 480px) {
          .company-content {
            padding: 16px 12px;
          }
          .company-details {
            padding: 18px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}

export default Company;