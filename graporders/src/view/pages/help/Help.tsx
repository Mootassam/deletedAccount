import React, { useState } from 'react';
import SubHeader from 'src/view/shared/Header/SubHeader';
import { i18n, i18nHtml } from '../../../i18n';

function HelpCenter() {
  // State to track open sections (all closed initially)
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Accordion sections sourced from i18n
  const sections = [
    {
      title: i18n('pages.help.accordion.specialOrders.title'),
      content: i18nHtml('pages.help.accordion.specialOrders.content'),
    },
    {
      title: i18n('pages.help.accordion.platformRegulations.title'),
      content: i18nHtml('pages.help.accordion.platformRegulations.content'),
    },
    {
      title: i18n('pages.help.accordion.deposits.title'),
      content: i18nHtml('pages.help.accordion.deposits.content'),
    },
    {
      title: i18n('pages.help.accordion.withdrawals.title'),
      content: i18nHtml('pages.help.accordion.withdrawals.content'),
    },
    {
      title: i18n('pages.help.accordion.luxuryOrders.title'),
      content: i18nHtml('pages.help.accordion.luxuryOrders.content'),
    },
  ];

  return (
    <div className="help-center">
      <SubHeader title={i18n('pages.help.title')} path="/profile" />

      <div className="help-center__container">
        <div className="accordion">
          {sections.map((section, index) => (
            <div key={index} className="accordion-item">
              <div
                className={`accordion-header ${openSections[index] ? 'open' : ''}`}
                onClick={() => toggleSection(index)}
              >
                <span className="accordion-title">{section.title}</span>
                <i className={`fas fa-chevron-${openSections[index] ? 'up' : 'down'} accordion-icon`}></i>
              </div>
              {openSections[index] && (
                <div className="accordion-content">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="help-center__footer">
          {i18n('pages.help.footer')}
        </p>
      </div>

      {/* Updated luxury car theme styles */}
      <style>{`
        .help-center {
          background: #0a0a0a;
          min-height: 100vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #ffffff;
        }

        .help-center__container {
          max-width: 700px;
          margin: 0 auto;
          padding: 1.5rem 1rem;
        }

        .accordion {
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0,0,0,0.5);
        }

        .accordion-item {
          border-bottom: 1px solid rgba(212,175,55,0.1);
        }
        .accordion-item:last-child {
          border-bottom: none;
        }

        .accordion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          background: transparent;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s;
        }
        .accordion-header:hover {
          background: rgba(212,175,55,0.05);
        }
        .accordion-header.open {
          background: rgba(212,175,55,0.02);
          border-bottom: 1px solid rgba(212,175,55,0.2);
        }

        .accordion-title {
          font-size: 15px;
          font-weight: 500;
          color: #ffffff;
        }

        .accordion-icon {
          color: #d4af37;
          font-size: 14px;
          width: 20px;
          text-align: center;
        }

        .accordion-content {
          padding: 1.25rem;
          background: rgba(10,10,10,0.8);
          color: rgba(255,255,255,0.9);
          line-height: 1.6;
          font-size: 14px;
          border-top: 1px solid rgba(212,175,55,0.1);
        }

        .accordion-content p {
          margin: 0 0 1rem 0;
        }
        .accordion-content p:last-child {
          margin-bottom: 0;
        }
        .accordion-content strong {
          color: #d4af37;
          font-weight: 600;
        }

        .help-center__footer {
          text-align: center;
          margin-top: 2rem;
          font-size: 14px;
          color: #d4af37;
          opacity: 0.8;
        }

        @media (max-width: 480px) {
          .help-center__container {
            padding: 1rem;
          }
          .accordion-header {
            padding: 0.85rem 1rem;
          }
          .accordion-title {
            font-size: 14px;
          }
          .accordion-content {
            padding: 1rem;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}

export default HelpCenter;