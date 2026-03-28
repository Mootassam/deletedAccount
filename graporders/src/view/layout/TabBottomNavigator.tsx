import React from "react";
import { Link, useLocation } from "react-router-dom";
import { i18n } from "../../i18n";

function TabBottomNavigator() {
  const location = useLocation();

  const isActive = (pathname: string) => location.pathname === pathname;

  const tabs = [
    {
      icon: "fas fa-home",
      path: "/",
      name: i18n('pages.tabBottomNavigator.home'),
    },
    {
      icon: "fas fa-star",
      path: "/grap",      // adjust to your route
      name: i18n('pages.tabBottomNavigator.starting'),
    },
    {
      icon: "fas fa-user",
      path: "/profile",     // adjust to your route
      name: i18n('pages.tabBottomNavigator.profile'),
    },
  ];

  return (
    <>
      <style>{`
        .tabbottomNavigator {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-around;
          align-items: center;
          background: rgba(10, 10, 10, 0.8);
          backdrop-filter: blur(12px);
          border-top: 1px solid rgba(212, 175, 55, 0.3);
          padding: 8px 0 12px 0;
          z-index: 1000;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
        }

        .singleTab {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 4px 12px;
          border-radius: 30px;
          transition: background 0.2s;
        }

        .singleTab i {
          font-size: 22px;
          transition: color 0.2s, transform 0.1s;
        }

        .singleTab span {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.3px;
          transition: color 0.2s;
        }

        .singleTab:hover i {
          transform: scale(1.1);
        }

        /* active styles are applied via inline style on the Link */
        .tabbottomNavigator a {
          text-decoration: none;
          color: inherit; /* color controlled by inline style */
        }
      `}</style>

      <div className="tabbottomNavigator">
        {tabs.map((item, index) => {
          const active = isActive(item.path);
          return (
            <Link
              key={index}
              to={item.path}
              style={{
                color: active ? "#d4af37" : "rgba(255,255,255,0.6)",
              }}
            >
              <div className="singleTab">
                <i className={item.icon} />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export default TabBottomNavigator;