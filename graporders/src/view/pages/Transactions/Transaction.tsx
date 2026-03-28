import React, { useEffect, useState } from "react";
import SubHeader from "src/view/shared/Header/SubHeader";
import action from 'src/modules/transaction/list/transactionListActions';
import selector from 'src/modules/transaction/list/transactionListSelectors';
import { useDispatch, useSelector } from 'react-redux';
import Dates from "src/view/shared/utils/Dates";
import LoadingModal from "src/shared/LoadingModal";
import Nodata from "src/view/shared/Nodata";
import { i18n } from "../../../i18n";

function Transaction() {
  const [active, setActive] = useState("withdraw");
  const dispatch = useDispatch();
  const loading = useSelector(selector.selectLoading);
  const selectHasRows = useSelector(selector.selectHasRows);

  const fetchAll = () => {
    const values = {
      type: active
    };
    dispatch(action.doFetchByUser(values, values));
  };

  useEffect(() => {
    fetchAll();
  }, [dispatch, active]);

  const record = useSelector(selector.selectRows);

  const deposit = () => {
    setActive("deposit");
    const values = {
      type: 'deposit'
    };
    dispatch(action.doFetchByUser(values));
  };

  const withdraw = () => {
    setActive("withdraw");
    const values = {
      type: 'withdraw'
    };
    dispatch(action.doFetchByUser(values, values));
  };

  const allTransactions = () => {
    setActive("");
    const values = {
      type: ''
    };
    dispatch(action.doFetchByUser(values, values));
  };

  const getTransactionIcon = (type, status) => {
    if (type === 'deposit') {
      return status === 'success'
        ? "fa-solid fa-circle-arrow-down text-success"
        : status === 'pending'
          ? "fa-solid fa-clock text-warning"
          : "fa-solid fa-circle-xmark text-danger";
    } else {
      return status === 'success'
        ? "fa-solid fa-circle-arrow-up text-success"
        : status === 'pending'
          ? "fa-solid fa-clock text-warning"
          : "fa-solid fa-circle-xmark text-danger";
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      success: {
        class: 'status-completed',
        text: i18n('pages.transaction.status.completed')
      },
      pending: {
        class: 'status-pending',
        text: i18n('pages.transaction.status.processing')
      },
      canceled: {
        class: 'status-canceled',
        text: i18n('pages.transaction.status.canceled')
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <div className={`status-badge ${config.class}`}>
        {config.text}
      </div>
    );
  };

  const getAmountDisplay = (item) => {
    const sign = item.type === 'deposit' ? '+' : '-';
    const amountClass = item.status === 'canceled' || item.status === 'failed'
      ? 'amount-canceled'
      : item.status === 'pending'
        ? 'amount-pending'
        : item.type === 'deposit'
          ? 'amount-deposit'
          : 'amount-withdraw';

    const amountText = item.status === 'canceled' || item.status === 'failed'
      ? i18n('pages.transaction.amount.canceled', item?.amount)
      : item.type === 'deposit'
        ? i18n('pages.transaction.amount.deposit', item?.amount)
        : i18n('pages.transaction.amount.withdraw', item?.amount);

    return (
      <div className={`transaction-amount ${amountClass}`}>
        {amountText}
      </div>
    );
  };

  const getTransactionTypeText = (type) => {
    return type === 'deposit'
      ? i18n('pages.transaction.types.deposit')
      : i18n('pages.transaction.types.withdrawal');
  };

  const all = (item) => {
    return (
      <div className="transaction-item">
        <div className="transaction-icon">
          <i className={getTransactionIcon(item.type, item.status)}></i>
        </div>

        <div className="transaction-content">
          <div className="transaction-header">
            <div className="transaction-type">
              {getTransactionTypeText(item.type)}
            </div>
            {getStatusBadge(item.status)}
          </div>

          <div className="transaction-details">
            <div className="transaction-date">
              <i className="fa-regular fa-clock"></i> &nbsp;
              {Dates.Date(item?.createdAt)}
            </div>
          </div>
        </div>

        <div className="transaction-amount-section">
          {getAmountDisplay(item)}
        </div>
      </div>
    );
  };

  return (
    <div className="transaction-page-container">
      <SubHeader title={i18n('pages.transaction.title')} path="/profile" />

      {/* Filter Tabs */}
      <div className="transaction-filter-section">
        <div className="filter-tabs">
          <div
            className={`filter-tab ${active === "" ? 'filter-tab-active' : ''}`}
            onClick={allTransactions}
          >
            <i className="fa-solid fa-list"></i>
            <span>{i18n('pages.transaction.filters.all')}</span>
          </div>
          <div
            onClick={withdraw}
            className={`filter-tab ${active === "withdraw" ? 'filter-tab-active' : ''}`}
          >
            <i className="fa-solid fa-arrow-up"></i>
            <span>{i18n('pages.transaction.filters.withdraw')}</span>
          </div>
          <div
            onClick={deposit}
            className={`filter-tab ${active === "deposit" ? 'filter-tab-active' : ''}`}
          >
            <i className="fa-solid fa-arrow-down"></i>
            <span>{i18n('pages.transaction.filters.deposit')}</span>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="transaction-list-container">
        {loading && <LoadingModal />}

        {!loading && record && record.length > 0 && (
          <div className="transaction-list-header">
            <h3 className="recent">{i18n('pages.transaction.recentTransactions')}</h3>
            <div className="transaction-count">
              {i18n('pages.transaction.transactionCount', record.length)}
            </div>
          </div>
        )}

        {!loading && record && record.map((item, index) => (
          <div key={index}>
            {all(item)}
          </div>
        ))}

        {!loading && !selectHasRows && <Nodata />}
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background-color: #0a0a0a;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .transaction-page-container {
          background: #0a0a0a;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 8px 20px;
        }

        /* Filter tabs – dark, gold accents */
        .transaction-filter-section {
          width: 100%;
          margin-top: 16px;
          margin-bottom: 8px;
        }

        .filter-tabs {
          display: flex;
          gap: 8px;
          background: rgba(255,255,255,0.02);
          padding: 8px;
          border-radius: 40px;
          border: 1px solid rgba(212,175,55,0.2);
          backdrop-filter: blur(8px);
        }

        .filter-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 4px;
          border-radius: 30px;
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.7);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          border: 1px solid transparent;
        }

        .filter-tab i {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
        }

        .filter-tab-active {
          background: #d4af37;
          color: #0a0a0a;
          border-color: #d4af37;
        }

        .filter-tab-active i {
          color: #0a0a0a;
        }

        .filter-tab:hover:not(.filter-tab-active) {
          background: rgba(212,175,55,0.1);
          border-color: rgba(212,175,55,0.3);
        }

        /* Transaction list container – glass card */
        .transaction-list-container {
          width: 100%;
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 28px;
          padding: 20px 16px;
          box-shadow: 0 8px 28px rgba(0,0,0,0.5);
        }

        .transaction-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding: 0 4px;
        }

        .recent {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: 0.3px;
        }

        .transaction-count {
          font-size: 13px;
          color: #d4af37;
          background: rgba(212,175,55,0.1);
          padding: 4px 10px;
          border-radius: 30px;
          border: 1px solid rgba(212,175,55,0.3);
        }

        /* Transaction item */
        .transaction-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(212,175,55,0.1);
        }

        .transaction-item:last-child {
          border-bottom: none;
        }

        .transaction-icon {
          width: 48px;
          height: 48px;
          background: rgba(212,175,55,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          color: #d4af37;
          border: 1px solid rgba(212,175,55,0.3);
        }

        .transaction-content {
          flex: 1;
        }

        .transaction-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }

        .transaction-type {
          font-size: 16px;
          font-weight: 500;
          color: #ffffff;
        }

        .status-badge {
          font-size: 11px;
          font-weight: 500;
          padding: 4px 12px;
          border-radius: 40px;
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.8);
          border: 1px solid rgba(212,175,55,0.3);
        }

        .status-completed {
          background: rgba(46, 125, 50, 0.2);
          color: #81c784;
          border-color: #81c784;
        }

        .status-pending {
          background: rgba(255, 152, 0, 0.2);
          color: #ffb74d;
          border-color: #ffb74d;
        }

        .status-canceled {
          background: rgba(198, 40, 40, 0.2);
          color: #ef5350;
          border-color: #ef5350;
        }

        .transaction-details {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: rgba(255,255,255,0.5);
        }

        .transaction-details i {
          font-size: 12px;
          color: #d4af37;
        }

        .transaction-amount-section {
          text-align: right;
        }

        .transaction-amount {
          font-size: 16px;
          font-weight: 600;
          white-space: nowrap;
        }

        .amount-deposit {
          color: #81c784;
        }

        .amount-withdraw {
          color: #ef5350;
        }

        .amount-pending {
          color: #ffb74d;
        }

        .amount-canceled {
          color: rgba(255,255,255,0.3);
          text-decoration: line-through;
        }

        /* Icon color helpers (override default if needed) */
        .text-success { color: #81c784 !important; }
        .text-warning { color: #ffb74d !important; }
        .text-danger { color: #ef5350 !important; }

        /* Loading and No data */
        .loading-modal {
          display: flex;
          justify-content: center;
          padding: 30px;
          color: #d4af37;
        }

        .nodata-container {
          padding: 30px 0;
          text-align: center;
          color: rgba(255,255,255,0.5);
          font-size: 14px;
        }

        /* Responsive */
        @media (max-width: 400px) {
          .filter-tab {
            font-size: 13px;
            padding: 8px 2px;
          }
          .transaction-icon {
            width: 42px;
            height: 42px;
            font-size: 20px;
          }
          .transaction-type {
            font-size: 15px;
          }
          .transaction-amount {
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
}

export default Transaction;