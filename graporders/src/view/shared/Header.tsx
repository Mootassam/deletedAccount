import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from 'react-router-dom';
import actions from 'src/modules/notification/list/notificationListActions';

function Header() {
  // let count = 1; // (commented out if unused)

  return (
    <div className="market__header">
      <div className="header-icons">
        <Link to="/profile">
          <div className="profile-containers">
            <div className="profile-icon">
              {/* Replaced user icon with bars (hamburger) icon */}
              <img className="togglea" src={`/icons/ic-cd.svg`} />
            </div>
          </div>
        </Link>
      </div>
      <img
        src="/images/logo/logo.webp"
        alt=""
        style={{ height: 30 }}
      />
      <div></div>

      <style>{`
        .market__header {
          padding: 5px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
        }

          .togglea{
          widht : 23px ;
          height:20px;
          }

        .header-icons {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .notification-container,
        .profile-containers {
          display: flex;
          align-items: center;
          justify-content: center;
        }

  

      `}</style>
    </div>
  );
}

export default Header;