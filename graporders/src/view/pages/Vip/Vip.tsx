import { useEffect, useState, useCallback, memo } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Vipactions from "src/modules/vip/list/vipListActions";
import selector from "src/modules/vip/list/vipListSelectors";
import LoadingModal from "src/shared/LoadingModal";
import authSelectors from "src/modules/auth/authSelectors";
import { i18n } from "../../../i18n";

const VipContainer = styled.div`
  top: 0;
  width: 100%;
  height: auto;
  position: absolute;
  left: 0;
  min-height: 100vh;
  padding-bottom: 40px;
`;

interface VipItem {
  id: string;
  title: string;
  Entrylimit: string;
  levellimit: string;
  dailyorder: string;
  comisionrate: string;
  commissionmergedata?: string;
  tasksperday?: string;
  photo?: Array<{ downloadUrl: string }>;
  description?: string;
  benefits?: string[];
  price?: string;
  setperday: string;
}

function VipPage() {
  const dispatch = useDispatch();
  const history = useHistory();

  const vipRecords = useSelector(selector.selectRows);
  console.log("🚀 ~ VipPage ~ vipRecords:", vipRecords)
  const loading = useSelector(selector.selectLoading);
  const currentUser = useSelector(authSelectors.selectCurrentUser);

  const [selectedVip, setSelectedVip] = useState<VipItem | null>(null);
  const [showCurrentVipModal, setShowCurrentVipModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(Vipactions.doFetch());
  }, [dispatch]);

  const filteredVipRecords = (vipRecords || []).filter(
    (vip: VipItem) =>
      (vip.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vip.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = useCallback(
    (vip: VipItem) => {
      if (currentUser?.vip?.id === vip.id) {
        setSelectedVip(vip);
        setShowCurrentVipModal(true);
      } else {
        setSelectedVip(vip);
        setShowSupportModal(true);
      }
    },
    [currentUser]
  );

  const handleCloseModals = useCallback(() => {
    setShowCurrentVipModal(false);
    setShowSupportModal(false);
    setSelectedVip(null);
  }, []);

  const handleContactSupport = useCallback(() => {
    history.push("/support");
  }, [history]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const VipLevelCard = memo(({ vip }: { vip: VipItem }) => {
    const isCurrent = currentUser?.vip?.id === vip.id;
    const tasksPerDay = vip.dailyorder

      || vip.dailyorder

      || "0";

    return (
      <div
        className={`vip-level-card ${isCurrent ? "vip-level-active" : ""}`}
        onClick={() => handleCardClick(vip)}
      >
        <div className="vip-level-badge">
          {isCurrent ? (
            <div className="current-level-indicator">
              <i className="fa-solid fa-crown"></i>
              {i18n("pages.vip.currentLevel") || "Current Level"}
            </div>
          ) : (
            <div className="other-level-indicator">
              <i className="fa-solid fa-arrow-up"></i>
              {i18n("pages.vip.upgrade") || "Upgrade"}
            </div>
          )}
        </div>

        <div className="vip-level-content">
          <div className="vip-level-image">
            <img
              src={vip?.photo?.[0]?.downloadUrl || "/default-image.png"}
              alt={vip?.title || "VIP"}
              className="level-image"
              loading="lazy"
            />
          </div>

          <div className="vip-level-info">
            <h4 className="level-title">{vip?.title || i18n('pages.vip.level')}</h4>


            <span>
              {vip.levellimit && (
                <p style={{ fontSize:15}} >
                  USD {vip.levellimit}
                </p>
              )}
            </span>
            <br />


            {vip.description && (
              <p className="level-description">{vip.description}</p>
            )}

            <div className="level-features">


              <div className="feature-item">
                <i className="fa-solid fa-box feature-icon"></i>
                <span> {tasksPerDay} {i18n("pages.vip.setperday")}</span>
              </div>

              <div className="feature-item">
                <i className="fa-solid fa-calendar-alt feature-icon"></i>
                <span>{vip.setperday || "0"} {i18n("pages.vip.setperday")}</span>
              </div>
              <div className="feature-item">
                <i className="fa-solid fa-percentage feature-icon"></i>
                <span>{vip.comisionrate || "0"}% {i18n("pages.vip.commissionRate")}</span>
              </div>
              <div className="feature-item">
                <i className="fa-solid fa-percentage feature-icon"></i>
                <span>{vip.commissionmergedata || "0"}% {i18n("pages.vip.premiumCommission")}</span>
              </div>

            </div>



            {vip.price && (
              <div className="level-price">
                <i className="fa-solid fa-tag"></i>
                {vip.price}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  });

  VipLevelCard.displayName = "VipLevelCard";

  return (
    <VipContainer>
      <div className="vip-page-container">
        {/* Header with gold gradient */}
        <div className="vip-header">
          <Link to="/" className="back-button">
            <i className="fa-solid fa-arrow-left"></i>
            {i18n("pages.vip.backToHome") || "Back to Home"}
          </Link>

          <div className="vip-header-content">
            <h1 className="vip-title">
              <i className="fa-solid fa-crown" style={{ marginRight: "8px", color: "#d4af37" }}></i>
              {i18n("pages.vip.title") || "VIP Membership"}
            </h1>
            <p className="vip-subtitle">
              {i18n("pages.vip.subtitle") || "Choose your level"}
            </p>

            {currentUser?.vip && (
              <div className="current-vip-status">
                <div className="status-badge">
                  <i className="fa-solid fa-crown" style={{ color: "#d4af37" }}></i>
                  {i18n("pages.vip.currentlyOn") || "Currently on"}:{" "}
                  <span className="current-level-name">{currentUser.vip.title}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-container">
            <i className="fa-solid fa-search search-icon"></i>
            <input
              type="text"
              placeholder={
                i18n("pages.vip.searchPlaceholder") || "Search VIP levels..."
              }
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm("")}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            )}
          </div>
        </div>

        {/* VIP Levels Grid */}
        <div className="vip-content">
          {loading && <LoadingModal />}

          {!loading && filteredVipRecords.length === 0 && (
            <div className="no-results">
              <i className="fa-solid fa-crown" style={{ color: "#d4af37" }}></i>
              <h3>{i18n("pages.vip.noResults") || "No results found"}</h3>
              <p>
                {i18n("pages.vip.noResultsDesc") ||
                  "Try a different search term"}
              </p>
            </div>
          )}

          {!loading && filteredVipRecords.length > 0 && (
            <div className="vip-levels-grid">
              {filteredVipRecords.map((vip: VipItem, index: number) => (
                <VipLevelCard key={vip.id || index} vip={vip} />
              ))}
            </div>
          )}
        </div>

        {/* Modal for Current VIP */}
        {showCurrentVipModal && selectedVip && (
          <div className="modal-overlay" onClick={handleCloseModals}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header-section">
                <h3 className="modal-title">{selectedVip.title}</h3>
                <button className="modal-close" onClick={handleCloseModals}>
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
              <div className="modal-body-section">
                <div className="modal-icon">
                  <i
                    className="fa-solid fa-crown"
                    style={{ color: "#d4af37", fontSize: "40px" }}
                  ></i>
                </div>
                <p className="modal-message">
                  {i18n("pages.vip.modal.alreadyMember")}
                </p>
              </div>
              <div className="modal-actions">
                <button className="confirm-btn" onClick={handleCloseModals}>
                  {i18n("common.continue")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Contact Support */}
        {showSupportModal && selectedVip && (
          <div className="modal-overlay" onClick={handleCloseModals}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header-section">
                <h3 className="modal-title">{selectedVip.title}</h3>
                <button className="modal-close" onClick={handleCloseModals}>
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
              <div className="modal-body-section">
                <div className="modal-icon">
                  <i
                    className="fa-solid fa-headset"
                    style={{ color: "#d4af37", fontSize: "40px" }}
                  ></i>
                </div>
                <p className="modal-message">
                  {i18n("pages.vip.modal.contactSupportMessage")}
                </p>
              </div>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={handleCloseModals}>
                  {i18n("common.cancel")}
                </button>
                <button className="confirm-btn" onClick={handleContactSupport}>
                  {i18n("pages.vip.modal.contactSupport")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== LUXURY VIP THEME STYLES (Dark, Compact) ===== */}
        <style>{`
          .vip-page-container {
            max-width: 430px;
            margin: 0 auto;
            padding: 12px 16px 24px;
            background: #0a0a0a;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #ffffff;
            min-height: 100vh;
          }

          /* Header */
          .vip-header {
            margin-bottom: 16px;
          }

          .back-button {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            color: #d4af37;
            text-decoration: none;
            font-size: 13px;
            font-weight: 500;
            margin-bottom: 8px;
            transition: color 0.2s;
          }

          .back-button:hover {
            color: #e0b84d;
          }

          .vip-header-content {
            text-align: center;
          }

          .vip-title {
            font-size: 1.8rem;
            font-weight: 600;
            background: linear-gradient(135deg, #d4af37, #b8960f);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 0 0 4px;
            letter-spacing: 0.5px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .vip-subtitle {
            font-size: 13px;
            color: rgba(255,255,255,0.5);
            margin: 0 0 12px;
          }

          .current-vip-status {
            display: inline-flex;
            background: rgba(212,175,55,0.1);
            border-radius: 40px;
            padding: 4px 14px;
            border: 1px solid rgba(212,175,55,0.3);
          }

          .status-badge {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #d4af37;
            font-weight: 500;
            font-size: 12px;
          }

          .current-level-name {
            color: #ffffff;
            font-weight: 600;
          }

          /* Search */
          .search-section {
            margin-bottom: 20px;
          }

          .search-container {
            position: relative;
            max-width: 360px;
            margin: 0 auto;
          }

          .search-icon {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: #d4af37;
            font-size: 14px;
          }

          .search-input {
            width: 100%;
            padding: 10px 16px 10px 42px;
            border: 1px solid rgba(212,175,55,0.3);
            border-radius: 30px;
            background: rgba(255,255,255,0.02);
            font-size: 14px;
            color: #ffffff;
            transition: border-color 0.2s;
          }

          .search-input:focus {
            outline: none;
            border-color: #d4af37;
          }

          .search-input::placeholder {
            color: rgba(255,255,255,0.4);
          }

          .clear-search {
            position: absolute;
            right: 14px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #d4af37;
            cursor: pointer;
            font-size: 14px;
            padding: 4px;
          }

          /* VIP Levels Grid */
          .vip-levels-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 16px;
          }

          /* VIP Card – Dark Glass */
          .vip-level-card {
            background: rgba(255,255,255,0.02);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(212,175,55,0.2);
            border-radius: 24px;
            padding: 16px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.5);
            position: relative;
            cursor: pointer;
            transition: transform 0.2s, border-color 0.2s;
          }

          .vip-level-card:hover {
            transform: translateY(-2px);
            border-color: #d4af37;
          }

          .vip-level-active {
            border: 2px solid #d4af37;
            background: rgba(212,175,55,0.05);
          }

          .vip-level-badge {
            margin-bottom: 10px;
          }

          .current-level-indicator,
          .other-level-indicator {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 11px;
            font-weight: 600;
            padding: 4px 12px;
            border-radius: 30px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }

          .current-level-indicator {
            background: rgba(212,175,55,0.2);
            color: #d4af37;
            border: 1px solid #d4af37;
          }

          .other-level-indicator {
            background: rgba(255,255,255,0.05);
            color: rgba(255,255,255,0.8);
            border: 1px solid rgba(212,175,55,0.3);
          }

          .vip-level-content {
            display: flex;
            gap: 14px;
          }

          .vip-level-image {
            flex-shrink: 0;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            overflow: hidden;
            background: rgba(212,175,55,0.1);
            border: 2px solid #d4af37;
          }

          .level-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .vip-level-info {
            flex: 1;
          }

          .level-title {
            font-size: 16px;
            font-weight: 600;
            color: #ffffff;
            margin: 0 0 4px;
          }

          .level-description {
            font-size: 11px;
            color: rgba(255,255,255,0.6);
            margin: 0 0 8px;
            line-height: 1.4;
          }

          .level-features {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .feature-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            color: rgba(255,255,255,0.9);
          }

          .feature-icon {
            width: 16px;
            color: #d4af37;
            font-size: 12px;
          }

          .level-price {
            margin-top: 8px;
            font-size: 14px;
            font-weight: 600;
            color: #d4af37;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          /* No results */
          .no-results {
            text-align: center;
            padding: 40px 16px;
          }

          .no-results i {
            font-size: 48px;
            color: #d4af37;
            margin-bottom: 12px;
          }

          .no-results h3 {
            font-size: 18px;
            font-weight: 500;
            color: #ffffff;
            margin: 0 0 4px;
          }

          .no-results p {
            font-size: 13px;
            color: rgba(255,255,255,0.5);
          }

          /* Modal styles – Dark Gold */
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1100;
            padding: 16px;
          }

          .modal-content {
            background: #1a1a1a;
            max-width: 340px;
            width: 100%;
            border-radius: 28px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.7);
            border: 1px solid rgba(212,175,55,0.3);
            overflow: hidden;
          }

          .modal-header-section {
            padding: 18px 20px 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(212,175,55,0.2);
          }

          .modal-title {
            font-size: 18px;
            font-weight: 600;
            color: #d4af37;
            margin: 0;
          }

          .modal-close {
            background: rgba(212,175,55,0.1);
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #d4af37;
            cursor: pointer;
            transition: background 0.2s;
            font-size: 16px;
          }

          .modal-close:hover {
            background: rgba(212,175,55,0.2);
          }

          .modal-body-section {
            padding: 16px 20px 20px;
            text-align: center;
          }

          .modal-icon {
            margin: 0 0 12px;
          }

          .modal-message {
            font-size: 15px;
            color: #ffffff;
            margin: 0 0 8px;
            line-height: 1.5;
          }

          .modal-actions {
            display: flex;
            gap: 10px;
            padding: 16px 20px 20px;
            border-top: 1px solid rgba(212,175,55,0.2);
          }

          .cancel-btn,
          .confirm-btn {
            flex: 1;
            border: none;
            border-radius: 40px;
            padding: 12px 0;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }

          .cancel-btn {
            background: rgba(255,255,255,0.05);
            color: #d4af37;
            border: 1px solid rgba(212,175,55,0.3);
          }

          .cancel-btn:hover {
            background: rgba(212,175,55,0.1);
          }

          .confirm-btn {
            background: linear-gradient(145deg, #d4af37, #b8960f);
            color: #0a0a0a;
            box-shadow: 0 4px 12px rgba(212,175,55,0.3);
          }

          .confirm-btn:hover {
            background: linear-gradient(145deg, #e0b84d, #c9a227);
            transform: scale(1.02);
          }

          /* Responsive */
          @media (min-width: 480px) {
            .vip-levels-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </VipContainer>
  );
}

export default VipPage;