import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import actions from "src/modules/record/list/recordListActions";
import selectors from "src/modules/record/list/recordListSelectors";
import recordFormActions from "src/modules/record/form/recordFormActions";
import LoadingModal from "src/shared/LoadingModal";
import Dates from "src/view/shared/utils/Dates";
import Nodata from "src/view/shared/Nodata";
import { i18n } from "../../../i18n";
import SubHeader from "src/view/shared/Header/SubHeader";

function Portfolio() {
  const [active, setActive] = useState("completed");
  const dispatch = useDispatch();
  const records = useSelector(selectors.selectRows);
  const loading = useSelector(selectors.selectLoading);
  const selectHasRows = useSelector(selectors.selectHasRows);

  useEffect(() => {
    const filter = { status: active };
    dispatch(actions.doFetch(filter, filter));
  }, [dispatch, active]);

  const submitStatus = (id) => {
    const data = { status: "completed" };
    dispatch(recordFormActions.doChangeStatus(id, data));
  };

  const calculateProfit = (price, commission) => {
    const p = parseFloat(price) || 0;
    const c = parseFloat(commission) || 0;
    const total = (p * c) / 100;
    return total.toFixed(3);
  };

  const renderRecords = () => (
    <>
      {records.map((item, index) => {
        const productType = item?.product?.type;

        const displayAmount =
          item?.price ?? item?.product?.amount ?? 0;

        const displayCommission =
          item?.commission ??
          (productType !== "prizes" ? item?.product?.commission : 0);

        const estimatedReturn =
          productType === "prizes"
            ? item?.product?.amount ?? 0
            : calculateProfit(displayAmount, displayCommission);

        return (
          <div className="single__product" key={`${item.id}-${index}`}>
            <div className="order__time">
              <div>
                {i18n("pages.portfolio.orderTime")}:{" "}
                {Dates.currentDate(item?.date)}
              </div>
              <div>
                {i18n("pages.portfolio.orderNumber")}: {item.number}
              </div>
            </div>

            <div className={`badge__ ${item?.status}`}>
              <label>
                {i18n(`pages.portfolio.status.${item?.status}`)}
              </label>
            </div>

            <div className="product__image">
              <div className="image__">
                {item?.product && (
                  <img
                    src={
                      item?.product?.image ||
                      item?.product?.photo?.[0]?.downloadUrl ||
                      "https://via.placeholder.com/70x70/d4af37/0a0a0a?text=Car"
                    }
                    alt={item?.title || item?.product?.title}
                    loading="lazy"
                  />
                )}
              </div>
              <div className="product__detail">
                <div className="detail__name">{item?.product?.title}</div>
                <div className="detail__price">
                  <div>{displayAmount} $</div>
                  <div>{i18n("pages.portfolio.quantity")}</div>
                </div>
              </div>
            </div>

            <div className="bottom__cadre">
              <div className="cadre__detail">
                <div>{i18n("pages.portfolio.totalOrderAmount")}</div>
                <div>{displayAmount} $</div>
              </div>

              <div className="cadre__detail">
                <div>{i18n("pages.portfolio.commission")}</div>
                <div>
                  {displayCommission}
                  {productType !== "prizes" && !item?.commission && "%"}
                </div>
              </div>

              <div className="cadre__detail">
                <div>{i18n("pages.portfolio.estimatedReturn")}</div>
                <div>{estimatedReturn} $</div>
              </div>

              <div className="order__pages">
                {item?.status === "pending" && (
                  <button
                    className="submit_staus"
                    onClick={() => submitStatus(item.id)}
                  >
                    {i18n("pages.portfolio.submit")}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );

  return (
    <>
      <SubHeader title={i18n('entities.order.label')} path="/grap" />
      <div className="portfolio-page">
        <div className="portfolio-card">
          <div className="order__list">
            <div className="list__actions">
              <div
                onClick={() => setActive("completed")}
                className={active === "completed" ? "active__order" : ""}
              >
                <span>{i18n("pages.portfolio.completed")}</span>
              </div>
              <div
                onClick={() => setActive("pending")}
                className={active === "pending" ? "active__order" : ""}
              >
                <span>{i18n("pages.portfolio.pending")}</span>
              </div>
            </div>
          </div>

          <div className="list__product">
            {loading && <LoadingModal />}
            {!loading && records && renderRecords()}
          </div>

          {!selectHasRows && <Nodata />}
        </div>

        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            background: linear-gradient(135deg, #0a0a0a 0%, #0f0f0f 50%, #0a0a0a 100%);
            font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          .portfolio-page {
            min-height: 100vh;
            background: linear-gradient(135deg, #0a0a0a 0%, #0f0f0f 50%, #0a0a0a 100%);
            padding: 20px 0px;
          }

          .portfolio-card {
            max-width: 700px;
            margin: 0 auto;
            background: rgba(15, 15, 15, 0.85);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(212, 175, 55, 0.25);
            border-radius: 32px;
            padding: 24px 20px;
            transition: all 0.3s ease;
          }

          .portfolio-card:hover {
            border-color: rgba(212, 175, 55, 0.5);
            box-shadow: 0 12px 32px rgba(212, 175, 55, 0.1);
          }

          /* Tabs */
          .order__list {
            margin-bottom: 28px;
          }

          .list__actions {
            display: flex;
            gap: 10px;
            background: rgba(10, 10, 10, 0.6);
            padding: 6px;
            border-radius: 60px;
            border: 1px solid rgba(212, 175, 55, 0.2);
          }

          .list__actions > div {
            flex: 1;
            text-align: center;
            padding: 10px 6px;
            border-radius: 60px;
            font-size: 15px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            letter-spacing: 0.3px;
          }

          .list__actions > div.active__order {
            background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
            color: #0a0a0a;
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
          }

          /* Product card */
          .single__product {
            padding: 20px 0;
            border-bottom: 1px solid rgba(212, 175, 55, 0.15);
            transition: all 0.2s;
          }

          .single__product:last-child {
            border-bottom: none;
          }

          .order__time {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.55);
            margin-bottom: 12px;
            font-weight: 500;
          }

          .badge__ {
            margin-bottom: 14px;
          }

          .badge__ label {
            display: inline-block;
            padding: 5px 14px;
            border-radius: 30px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.8);
            border: 1px solid rgba(212, 175, 55, 0.3);
          }

          .badge__.completed label {
            background: rgba(46, 125, 50, 0.2);
            color: #81c784;
            border-color: rgba(129, 199, 132, 0.4);
          }

          .badge__.pending label {
            background: rgba(212, 175, 55, 0.15);
            color: #d4af37;
            border-color: rgba(212, 175, 55, 0.5);
          }

          .badge__.frozen label {
            background: rgba(244, 67, 54, 0.2);
            color: #ef9a9a;
            border-color: rgba(244, 67, 54, 0.4);
          }

          .product__image {
            display: flex;
            gap: 16px;
            margin-bottom: 18px;
          }

          .image__ {
            width: 80px;
            height: 80px;
            border-radius: 20px;
            overflow: hidden;
            background: rgba(20, 20, 20, 0.8);
            border: 1px solid rgba(212, 175, 55, 0.3);
            flex-shrink: 0;
            transition: transform 0.2s;
          }

          .image__ img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .product__detail {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .detail__name {
            font-size: 16px;
            font-weight: 700;
            color: white;
            margin-bottom: 6px;
            letter-spacing: -0.2px;
          }

          .detail__price {
            display: flex;
            gap: 20px;
            font-size: 13px;
            color: rgba(255, 255, 255, 0.6);
            font-weight: 500;
          }

          .bottom__cadre {
            background: rgba(10, 10, 10, 0.6);
            border-radius: 24px;
            padding: 14px 16px;
            border: 1px solid rgba(212, 175, 55, 0.2);
          }

          .cadre__detail {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            padding: 8px 0;
            color: rgba(255, 255, 255, 0.9);
          }

          .cadre__detail:not(:last-child) {
            border-bottom: 1px solid rgba(212, 175, 55, 0.1);
          }

          .cadre__detail div:first-child {
            color: rgba(255, 255, 255, 0.55);
            font-weight: 500;
          }

          .cadre__detail div:last-child {
            font-weight: 700;
            color: #d4af37;
          }

          .order__pages {
            margin-top: 16px;
            display: flex;
            justify-content: flex-end;
          }

          .submit_staus {
            background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
            border: none;
            border-radius: 40px;
            padding: 10px 28px;
            color: #0a0a0a;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
          }

          .submit_staus:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(212, 175, 55, 0.4);
            background: linear-gradient(135deg, #e0b84d 0%, #c9a227 100%);
          }

          .submit_staus:active {
            transform: translateY(1px);
          }

          /* Nodata styling */
          .nodata-container {
            text-align: center;
            padding: 40px 20px;
            color: rgba(255, 255, 255, 0.5);
            font-size: 15px;
            font-weight: 500;
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

          /* Responsive */
          @media (max-width: 600px) {
            .portfolio-page {
              padding: 12px;
            }
            .portfolio-card {
              padding: 18px 14px;
            }
            .image__ {
              width: 65px;
              height: 65px;
            }
            .detail__name {
              font-size: 14px;
            }
            .cadre__detail {
              font-size: 12px;
            }
            .submit_staus {
              padding: 8px 20px;
              font-size: 13px;
            }
          }
        `}</style>
      </div>
    </>
  );
}

export default Portfolio;