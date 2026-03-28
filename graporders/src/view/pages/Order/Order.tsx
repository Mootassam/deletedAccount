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
                      "https://via.placeholder.com/70x70/3b82f6/ffffff?text=Product"
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
                <div>
                  {displayAmount} $
                </div>
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
                <div>
                  {estimatedReturn} $
                </div>
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
          background-color: #EDF1F7;
          font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
        }

        .portfolio-page {
          min-height: 100vh;
          background-color: #EDF1F7;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 16px 0px;
        }

        .portfolio-card {
          width: 100%;
          background: white;
          border-radius: 28px;
          padding: 20px 16px;
          border: 1px solid #F0F4FA; /* subtle border instead of shadow */
        }

        /* Tabs */
        .order__list {
          margin-bottom: 20px;
        }

        .list__actions {
          display: flex;
          gap: 8px;
          background: #F2F5FA;
          padding: 6px;
          border-radius: 30px;
        }

        .list__actions > div {
          flex: 1;
          text-align: center;
          padding: 8px 4px;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 500;
          color: #4A5C6F;
          cursor: pointer;
          transition: all 0.15s;
        }

        .list__actions > div.active__order {
          background: rgb(68, 136, 247);
          color: white;
        }

        /* Product card */
        .single__product {
          padding: 16px 0;
          border-bottom: 1px solid #F0F4FA;
        }

        .single__product:last-child {
          border-bottom: none;
        }

        .order__time {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #6F7E91;
          margin-bottom: 10px;
        }

        .badge__ {
          margin-bottom: 12px;
        }

        .badge__ label {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 500;
          background: #F2F5FA;
          color: #4A5C6F;
        }

        .badge__.completed label {
          background: #E6F7E6;
          color: #2E7D32;
        }

        .badge__.pending label {
          background: #fd9302;
          color: #fff;
        }

          /* 🆕 NEW: frozen status badge */
  .badge__.frozen label {
    background: red;
    color: white;
  }
        .product__image {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .image__ {
          width: 70px;
          height: 70px;
          border-radius: 16px;
          overflow: hidden;
          background: #F2F5FA;
          flex-shrink: 0;
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
          font-size: 15px;
          font-weight: 600;
          color: #1F2A3E;
          margin-bottom: 4px;
        }

        .detail__price {
          display: flex;
          gap: 16px;
          font-size: 13px;
          color: #6F7E91;
        }

        .bottom__cadre {
          background: #F8FAFE;
          border-radius: 20px;
          padding: 12px;
        }

        .cadre__detail {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          padding: 6px 0;
          color: #2C3A4B;
        }

        .cadre__detail:not(:last-child) {
          border-bottom: 1px solid #EDF2F7;
        }

        .cadre__detail div:first-child {
          color: #6F7E91;
        }

        .cadre__detail div:last-child {
          font-weight: 500;
        }

        .order__pages {
          margin-top: 12px;
          display: flex;
          justify-content: flex-end;
        }

        .submit_staus {
          background: rgb(68, 136, 247);
          border: none;
          border-radius: 30px;
          padding: 8px 24px;
          color: white;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
        }

        .submit_staus:hover {
          background: #3a78d0;
        }

        /* Nodata */
        .nodata-container {
          text-align: center;
          padding: 30px 0;
          color: #9AA6B5;
          font-size: 14px;
        }
      `}</style>
    </div>
    </>
  );
}

export default Portfolio;
