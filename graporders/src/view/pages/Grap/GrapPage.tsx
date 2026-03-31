import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import authSelectors from "src/modules/auth/authSelectors";
import actions from "src/modules/product/list/productListActions";
import selector from "src/modules/product/list/productListSelectors";
import LoadingModal from "src/shared/LoadingModal";
import Dates from "src/view/shared/utils/Dates";
import recordActions from "src/modules/record/form/recordFormActions";
import recordListAction from "src/modules/record/list/recordListActions";
import recordSelector from "src/modules/record/list/recordListSelectors";
import GrapModal from "./GrapModal";
import productListActions from "src/modules/product/list/productListActions";
import PrizeModal from "./PrizeModal";
import { i18n } from "../../../i18n";
import Message from "src/view/shared/message";
import authActions from "src/modules/auth/authActions";

const Grappage = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const currentUser = useSelector(authSelectors.selectCurrentUser);
  const items = useSelector(selector.selectRows);
  const loading = useSelector(selector.selectLoading);
  const Modal = useSelector(selector.showModal);
  const [number] = useState(Dates.Number());
  const totalperday = useSelector(recordSelector.selectTotalPerday);

  useEffect(() => {
    dispatch(recordListAction.doCount());
    dispatch(recordListAction.doCountDay());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser.balance <= 0) {
      Message.error(i18n('pages.grab.errors.insufficientBalance'));
    }
    if (currentUser.tasksDone >= currentUser.vip.dailyorder) {
      Message.success(i18n('pages.grab.messages.completedTasks'));
    }
  }, [currentUser.balance, currentUser.tasksDone, currentUser.vip?.dailyorder]);

  const rollAll = async () => {
    if (currentUser.balance <= 0) {
      Message.error(i18n('pages.grab.errors.insufficientBalance'));
      return;
    }
    if (currentUser.tasksDone >= currentUser.vip.dailyorder) {
      Message.success(i18n('pages.grab.messages.completedTasks'));
      return;
    }
    await dispatch(actions.doFetch());
  };

  const hideModal = () => {
    dispatch(productListActions.doCloseModal());
    dispatch(authActions.doRefreshCurrentUser());
  };

  const submit = async () => {
    const values = {
      number: number,
      product: items?.id,
      price: items.amount,
      commission: items?.commission,
      status: items?.type === "combo" ? "pending" : "completed",
      user: currentUser.id,
    };
    await dispatch(recordActions.doCreate(values));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    rollAll();
  };

  const goToRecords = () => {
    history.push("/order");
  };

  return (
    <>
      <div className="luxury-grab">
        {/* Hero Section with GIF */}
        <div className="hero-section">
          <div className="hero-gif"></div>
          <div className="hero-overlay">
            <div className="hero-content">
              <h1 className="hero-title">Find Your Dream Car</h1>
              <p className="hero-subtitle">Experience the thrill of luxury driving</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-container">
          {/* Stats Dashboard */}
          <div className="stats-dashboard">
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <i className="fas fa-coins"></i>
              </div>
              <div className="stat-info">
                <span className="stat-label">Balance</span>
                <span className="stat-value">${currentUser.balance?.toFixed(2) || "0.00"}</span>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <i className="fas fa-trophy"></i>
              </div>
              <div className="stat-info">
                <span className="stat-label">Today's Earnings</span>
                <span className="stat-value">${totalperday || "0"}</span>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <i className="fas fa-tasks"></i>
              </div>
              <div className="stat-info">
                <span className="stat-label">Tasks Completed</span>
                <span className="stat-value">{currentUser.tasksDone || 0}/{currentUser.vip?.dailyorder || 0}</span>
              </div>
            </div>
            
            <div className="stat-item">
              <div className="stat-icon-wrapper">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-info">
                <span className="stat-label">On Hold</span>
                <span className="stat-value">${currentUser.freezeblance?.toFixed(2) || "0.00"}</span>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button className="search-main-button" onClick={handleSearch}>
            {loading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <>
                <i className="fas fa-search"></i>
                <span>Search Available Cars</span>
                <i className="fas fa-arrow-right"></i>
              </>
            )}
          </button>

          {/* Rating & Reviews */}
          <div className="rating-section">
            <div className="rating-stars">
              <div className="stars-group">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star-half-alt"></i>
              </div>
              <span className="rating-number">4.9</span>
            </div>
            <div className="review-info">
              <span className="review-count">2,847 verified reviews</span>
              <button className="view-reviews" onClick={goToRecords}>
                View all <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>

          {/* Featured Benefits */}
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className="benefit-text">
                <h4>Full Insurance</h4>
                <p>Comprehensive coverage included</p>
              </div>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-headset"></i>
              </div>
              <div className="benefit-text">
                <h4>24/7 Support</h4>
                <p>Premium assistance anytime</p>
              </div>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <i className="fas fa-exchange-alt"></i>
              </div>
              <div className="benefit-text">
                <h4>Free Cancellation</h4>
                <p>Up to 24 hours before</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {loading && <LoadingModal />}
      {Modal && !loading && items?.type === "prizes" && (
        <PrizeModal items={items} number={number} hideModal={hideModal} submit={submit} />
      )}
      {Modal && !loading && items?.type !== "prizes" && (
        <GrapModal items={items} number={number} hideModal={hideModal} submit={submit} />
      )}

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background-color: #0a0a0a;
        }

        .luxury-grab {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #0f0f0f 50%, #0a0a0a 100%);
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          position: relative;
        }

        /* Hero Section with GIF */
        .hero-section {
          position: relative;
          height: 400px;
          overflow: hidden;
          isolation: isolate;
        }

        .hero-gif {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('/images/grap/search.gif');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transform: scale(1.05);
          transition: transform 0.3s ease;
        }

        .hero-section:hover .hero-gif {
          transform: scale(1.08);
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.3) 100%);
          z-index: 1;
        }

        .hero-content {
          position: absolute;
          bottom: 50px;
          left: 28px;
          right: 28px;
          color: white;
          z-index: 2;
          animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-title {
          font-size: 40px;
          font-weight: 800;
          font-family: 'Playfair Display', serif;
          margin-bottom: 12px;
          background: linear-gradient(135deg, #ffffff 0%, #d4af37 80%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
        }

        .hero-subtitle {
          font-size: 17px;
          opacity: 0.95;
          font-weight: 400;
          letter-spacing: 0.3px;
          color: rgba(255, 255, 255, 0.9);
        }

        /* Main Container */
        .main-container {
          padding: 28px 20px 48px 20px;
          margin-top: -50px;
          position: relative;
          z-index: 3;
          background: linear-gradient(to bottom, transparent 0%, #0a0a0a 30px);
        }

        /* Stats Dashboard */
        .stats-dashboard {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-bottom: 28px;
        }

        .stat-item {
          background: rgba(15, 15, 15, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(212, 175, 55, 0.25);
          border-radius: 24px;
          padding: 18px 14px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .stat-item:hover {
          border-color: #d4af37;
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(212, 175, 55, 0.15);
          background: rgba(20, 20, 20, 0.9);
        }

        .stat-icon-wrapper {
          width: 52px;
          height: 52px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.05));
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .stat-item:hover .stat-icon-wrapper {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.1));
          transform: scale(1.05);
        }

        .stat-icon-wrapper i {
          font-size: 26px;
          color: #d4af37;
          transition: transform 0.2s;
        }

        .stat-item:hover .stat-icon-wrapper i {
          transform: scale(1.1);
        }

        .stat-info {
          flex: 1;
        }

        .stat-label {
          display: block;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.65);
          margin-bottom: 6px;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          font-weight: 500;
        }

        .stat-value {
          display: block;
          font-size: 22px;
          font-weight: 800;
          color: white;
          line-height: 1.2;
          letter-spacing: -0.3px;
        }

        /* Main Search Button */
        .search-main-button {
          background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
          border: none;
          border-radius: 28px;
          padding: 18px 28px;
          width: 100%;
          color: #0a0a0a;
          font-size: 18px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 28px;
          box-shadow: 0 12px 28px rgba(212, 175, 55, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.25);
          position: relative;
          overflow: hidden;
        }

        .search-main-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }

        .search-main-button:hover::before {
          left: 100%;
        }

        .search-main-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 32px rgba(212, 175, 55, 0.4);
          background: linear-gradient(135deg, #e0b84d 0%, #c9a227 100%);
        }

        .search-main-button:active {
          transform: translateY(1px);
        }

        .search-main-button i {
          font-size: 20px;
          transition: transform 0.2s;
        }

        .search-main-button:hover i {
          transform: translateX(4px);
        }

        .search-main-button i:first-child {
          font-size: 22px;
        }

        .search-main-button:hover i:first-child {
          transform: translateX(-2px);
        }

        /* Rating Section */
        .rating-section {
          background: rgba(15, 15, 15, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 24px;
          padding: 20px 24px;
          margin-bottom: 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
        }

        .rating-section:hover {
          border-color: rgba(212, 175, 55, 0.4);
          background: rgba(20, 20, 20, 0.75);
        }

        .rating-stars {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .stars-group {
          display: flex;
          gap: 5px;
          color: #d4af37;
          font-size: 15px;
        }

        .rating-number {
          font-size: 28px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.5px;
        }

        .review-info {
          text-align: right;
        }

        .review-count {
          display: block;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 6px;
          font-weight: 500;
        }

        .view-reviews {
          background: transparent;
          border: none;
          color: #d4af37;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .view-reviews:hover {
          color: #e0b84d;
          gap: 8px;
        }

        .view-reviews i {
          font-size: 11px;
          transition: transform 0.2s;
        }

        .view-reviews:hover i {
          transform: translateX(3px);
        }

        /* Benefits Grid */
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }

        .benefit-card {
          background: rgba(15, 15, 15, 0.7);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 20px;
          padding: 18px 12px;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .benefit-card:hover {
          border-color: #d4af37;
          transform: translateY(-3px);
          background: rgba(20, 20, 20, 0.8);
          box-shadow: 0 8px 20px rgba(212, 175, 55, 0.15);
        }

        .benefit-icon {
          width: 54px;
          height: 54px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.05));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 14px auto;
          transition: all 0.3s ease;
        }

        .benefit-card:hover .benefit-icon {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(212, 175, 55, 0.1));
          transform: scale(1.1);
        }

        .benefit-icon i {
          font-size: 24px;
          color: #d4af37;
          transition: transform 0.2s;
        }

        .benefit-card:hover .benefit-icon i {
          transform: scale(1.1);
        }

        .benefit-text h4 {
          font-size: 15px;
          font-weight: 700;
          color: white;
          margin-bottom: 6px;
          letter-spacing: -0.2px;
        }

        .benefit-text p {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.4;
        }

        /* Loading Animation */
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .fa-spin {
          animation: spin 1s linear infinite;
        }

        /* Responsive Design */
        @media (max-width: 480px) {
          .hero-section {
            height: 340px;
          }
          
          .hero-title {
            font-size: 32px;
          }
          
          .hero-subtitle {
            font-size: 15px;
          }
          
          .hero-content {
            bottom: 35px;
            left: 20px;
            right: 20px;
          }
          
          .main-container {
            padding: 24px 16px 40px 16px;
            margin-top: -40px;
          }
          
          .stats-dashboard {
            gap: 10px;
            margin-bottom: 20px;
          }
          
          .stat-item {
            padding: 14px 12px;
            gap: 10px;
          }
          
          .stat-value {
            font-size: 18px;
          }
          
          .stat-icon-wrapper {
            width: 44px;
            height: 44px;
          }
          
          .stat-icon-wrapper i {
            font-size: 20px;
          }
          
          .search-main-button {
            padding: 14px 20px;
            font-size: 16px;
            margin-bottom: 20px;
          }
          
          .search-main-button i {
            font-size: 18px;
          }
          
          .rating-section {
            padding: 16px 18px;
            margin-bottom: 20px;
          }
          
          .rating-number {
            font-size: 24px;
          }
          
          .stars-group {
            font-size: 12px;
          }
          
          .benefits-grid {
            gap: 10px;
          }
          
          .benefit-card {
            padding: 14px 8px;
          }
          
          .benefit-icon {
            width: 46px;
            height: 46px;
            margin-bottom: 10px;
          }
          
          .benefit-icon i {
            font-size: 20px;
          }
          
          .benefit-text h4 {
            font-size: 13px;
          }
          
          .benefit-text p {
            font-size: 10px;
          }
        }

        /* Tablet Optimization */
        @media (min-width: 481px) and (max-width: 768px) {
          .hero-section {
            height: 420px;
          }
          
          .hero-title {
            font-size: 40px;
          }
          
          .main-container {
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          }
          
          .stats-dashboard {
            gap: 16px;
          }
          
          .benefits-grid {
            gap: 16px;
          }
        }

        /* Smooth Scroll */
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
    </>
  );
};

export default Grappage;