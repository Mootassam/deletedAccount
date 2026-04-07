import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { i18n } from 'src/i18n';
import cardSelectors from 'src/modules/card/cardSelectors';
import destroyActions from 'src/modules/card/destroy/cardDestroyActions';
import destroySelectors from 'src/modules/card/destroy/cardDestroySelectors';
import actions from 'src/modules/card/list/cardListActions';
import selectors from 'src/modules/card/list/cardListSelectors';
import ConfirmModal from 'src/view/shared/modals/ConfirmModal';
import Spinner from 'src/view/shared/Spinner';
import TableWrapper from 'src/view/shared/styles/TableWrapper';
import Pagination from 'src/view/shared/table/Pagination';
import actionsForm from 'src/modules/card/form/cardFormActions';

function CardListTable(props) {
  const [recordIdToDestroy, setRecordIdToDestroy] = useState(null);
  const dispatch = useDispatch();

  const findLoading = useSelector(selectors.selectLoading);
  const destroyLoading = useSelector(destroySelectors.selectLoading);
  const loading = findLoading || destroyLoading;
  const rows = useSelector(selectors.selectRows);
  const pagination = useSelector(selectors.selectPagination);
  const selectedKeys = useSelector(selectors.selectSelectedKeys);
  const hasRows = useSelector(selectors.selectHasRows);
  const sorter = useSelector(selectors.selectSorter);
  const isAllSelected = useSelector(selectors.selectIsAllSelected);

  const hasPermissionToEdit = useSelector(
    cardSelectors.selectPermissionToEdit,
  );
  const hasPermissionToDestroy = useSelector(
    cardSelectors.selectPermissionToDestroy,
  );

  const doDestroy = (id) => {
    setRecordIdToDestroy(null);
    dispatch(destroyActions.doDestroy(id));
  };

  const doChangeSort = (field) => {
    const order =
      sorter.field === field && sorter.order === 'ascend'
        ? 'descend'
        : 'ascend';

    dispatch(
      actions.doChangeSort({
        field,
        order,
      }),
    );
  };

  const doChangePagination = (pagination) => {
    dispatch(actions.doChangePagination(pagination));
  };

  const doToggleAllSelected = () => {
    dispatch(actions.doToggleAllSelected());
  };

  const doToggleOneSelected = (id) => {
    dispatch(actions.doToggleOneSelected(id));
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get card type icon based on card number
  const getCardTypeIcon = (cardNumber) => {
    if (!cardNumber) return 'fas fa-credit-card';
    const cleaned = cardNumber.toString().replace(/\s/g, '');
    if (/^4/.test(cleaned)) return 'fab fa-cc-visa';
    if (/^(5[1-5]|2[2-7][2-7][0-9])/.test(cleaned)) return 'fab fa-cc-mastercard';
    if (/^(34|37)/.test(cleaned)) return 'fab fa-cc-amex';
    if (/^(6011|65|64[4-9])/.test(cleaned)) return 'fab fa-cc-discover';
    if (/^35/.test(cleaned)) return 'fab fa-cc-jcb';
    return 'fas fa-credit-card';
  };

  return (
    <div className="card-list-container">
      <TableWrapper>
        <div className="table-responsive">
          <table className="card-list-table">
            <thead className="table-header">
              <tr>
                <th className="checkbox-column">
                  {hasRows && (
                    <div className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        id="table-header-checkbox"
                        checked={Boolean(isAllSelected)}
                        onChange={() => doToggleAllSelected()}
                      />
                    </div>
                  )}
                </th>
                <th
                  className="sortable-header"
                  onClick={() => doChangeSort('cardNumber')}
                >
                  Card Number
                  {sorter.field === 'cardNumber' && (
                    <span className="sort-icon">
                      {sorter.order === 'ascend' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th
                  className="sortable-header"
                  onClick={() => doChangeSort('cardholderName')}
                >
                  Cardholder Name
                  {sorter.field === 'cardholderName' && (
                    <span className="sort-icon">
                      {sorter.order === 'ascend' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th
                  className="sortable-header"
                  onClick={() => doChangeSort('expiry')}
                >
                  Expiry Date
                  {sorter.field === 'expiry' && (
                    <span className="sort-icon">
                      {sorter.order === 'ascend' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th
                  className="sortable-header"
                  onClick={() => doChangeSort('cvv')}
                >
                  CVV
                  {sorter.field === 'cvv' && (
                    <span className="sort-icon">
                      {sorter.order === 'ascend' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th
                  className="sortable-header"
                  onClick={() => doChangeSort('address')}
                >
                  Address
                  {sorter.field === 'address' && (
                    <span className="sort-icon">
                      {sorter.order === 'ascend' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th
                  className="sortable-header"
                  onClick={() => doChangeSort('zipCode')}
                >
                  Zip Code
                  {sorter.field === 'zipCode' && (
                    <span className="sort-icon">
                      {sorter.order === 'ascend' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th
                  className="sortable-header"
                  onClick={() => doChangeSort('createdAt')}
                >
                  Created Date
                  {sorter.field === 'createdAt' && (
                    <span className="sort-icon">
                      {sorter.order === 'ascend' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
                <th className="actions-header card-table-actions-header">
                  User Name
                </th>
              </tr>
            </thead>
            <tbody className="table-body">
              {loading && (
                <tr>
                  <td colSpan={9} className="loading-cell">
                    <div className="loading-container">
                      <Spinner />
                      <span className="loading-text">
                        Loading data...
                      </span>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && !hasRows && (
                <tr>
                  <td colSpan={9} className="no-data-cell">
                    <div className="no-data-content">
                      <i className="fas fa-credit-card no-data-icon"></i>
                      <p>{i18n('table.noData')}</p>
                    </div>
                  </td>
                </tr>
              )}
              {!loading &&
                rows.map((row) => (
                  <tr key={row.id} className="table-row">
                    <td className="checkbox-column">
                      <div className="checkbox-wrapper">
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          id={`table-row-checkbox-${row.id}`}
                          checked={selectedKeys.includes(row.id)}
                          onChange={() => doToggleOneSelected(row.id)}
                        />
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="card-number-cell">
                        <i className={`${getCardTypeIcon(row.cardNumber)} card-type-icon`}></i>
                        <span className="card-number">{row.cardNumber}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="cardholder-name">
                        {row.cardholderName || 'N/A'}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="expiry-date-badge">
                        {row.expiry || 'N/A'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="cvv-field">
                        <span className="cvv-value">{row.cvv || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="address-cell" title={row.address}>
                        {row.address || 'N/A'}
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="zipcode-badge">
                        {row.zipCode || 'N/A'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="created-date">
                        {formatDate(row.createdAt)}
                      </div>
                    </td>
                    <td className="card-table-actions">
                      <div className="card-table-actions-content">
                        {row.user?.email}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <Pagination
            onChange={doChangePagination}
            disabled={loading}
            pagination={pagination}
          />
        </div>
      </TableWrapper>

      {recordIdToDestroy && (
        <ConfirmModal
          title={i18n('common.areYouSure')}
          onConfirm={() => doDestroy(recordIdToDestroy)}
          onClose={() => setRecordIdToDestroy(null)}
          okText={i18n('common.yes')}
          cancelText={i18n('common.no')}
        />
      )}

      <style>{`
        .card-list-container {
          width: 100%;
        }

        .sort-icon {
          margin-left: 8px;
          font-size: 12px;
        }

        .checkbox-column {
          width: 40px;
          padding: 16px 8px !important;
        }

        .checkbox-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .form-checkbox {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .table-header {
          background: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
        }

        .table-header th {
          padding: 16px 12px;
          font-weight: 600;
          color: #475569;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #e2e8f0;
        }

        .sortable-header {
          cursor: pointer;
          transition: background-color 0.2s ease;
          user-select: none;
        }

        .sortable-header:hover {
          background: #f1f5f9;
        }

        .table-body {
          background: white;
        }

        .table-row {
          transition: background-color 0.2s ease;
          border-bottom: 1px solid #f1f5f9;
        }

        .table-row:hover {
          background: #f8fafc;
        }

        .table-cell {
          padding: 16px 12px;
          font-size: 14px;
          color: #475569;
          vertical-align: middle;
        }

        /* Card Number Styles */
        .card-number-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .card-type-icon {
          font-size: 24px;
          color: #667eea;
        }

        .card-number {
          font-family: 'Courier New', monospace;
          font-weight: 500;
          font-size: 14px;
          letter-spacing: 0.5px;
        }

        /* Cardholder Name */
        .cardholder-name {
          font-weight: 500;
          text-transform: uppercase;
          color: #2d3748;
        }

        /* Expiry Date Badge */
        .expiry-date-badge {
          background: #f1f5f9;
          padding: 4px 10px;
          border-radius: 6px;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          font-weight: 600;
          color: #2d3748;
          display: inline-block;
        }

        /* CVV Field */
        .cvv-field {
          display: flex;
          align-items: center;
        }

        .cvv-value {
          font-family: 'Courier New', monospace;
          font-weight: 600;
          font-size: 14px;
          color: #2d3748;
          background: #f8fafc;
          padding: 4px 8px;
          border-radius: 4px;
        }

        /* Address Cell */
        .address-cell {
          max-width: 250px;
          word-wrap: break-word;
          line-height: 1.4;
        }

        /* Zipcode Badge */
        .zipcode-badge {
          background: #e2e8f0;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          color: #475569;
          display: inline-block;
          font-family: 'Courier New', monospace;
        }

        /* Created Date */
        .created-date {
          font-size: 12px;
          color: #718096;
          white-space: nowrap;
        }

        /* Loading State */
        .loading-cell {
          text-align: center;
          padding: 40px !important;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .loading-text {
          color: #6c757d;
          font-size: 14px;
        }

        /* No Data State */
        .no-data-cell {
          text-align: center;
          padding: 60px 20px !important;
        }

        .no-data-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: #6c757d;
        }

        .no-data-icon {
          font-size: 48px;
          color: #adb5bd;
        }

        .no-data-content p {
          margin: 0;
          font-size: 14px;
        }

        /* Actions Styles */
        .actions-header {
          width: 200px;
        }

        .card-table-actions-header {
          background: #f8fafc;
        }

        .card-table-actions {
          position: sticky;
          right: 0;
          background: white;
          z-index: 10;
          min-width: 200px;
          white-space: nowrap;
          box-shadow: -2px 0 8px rgba(0,0,0,0.06);
          border-left: 2px solid #f1f5f9;
        }
        
        .card-table-actions-content {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: nowrap;
          padding: 8px;
        }
        
        .card-table-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 6px 12px;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          min-width: auto;
          white-space: nowrap;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .card-table-action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        .card-table-action-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .card-table-action-btn.danger {
          background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
          color: white;
        }
        
        .card-table-action-icon {
          margin-right: 6px;
          font-size: 12px;
        }

        /* Pagination Styles */
        .pagination-container {
          margin-top: 20px;
          display: flex;
          justify-content: center;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .card-table-actions {
            min-width: 150px;
          }
          
          .table-cell {
            padding: 12px 8px;
            font-size: 13px;
          }
          
          .address-cell {
            max-width: 180px;
          }
        }

        @media (max-width: 768px) {
          .card-table-actions-content {
            flex-direction: column;
            align-items: stretch;
          }
          
          .card-table-action-btn {
            justify-content: center;
            padding: 8px 12px;
          }
          
          .card-table-actions {
            min-width: 120px;
          }
          
          .table-header th {
            padding: 12px 8px;
            font-size: 10px;
          }
          
          .table-cell {
            padding: 12px 8px;
            font-size: 12px;
          }
          
          .checkbox-column {
            padding: 12px 4px !important;
          }
          
          .card-number-cell {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
          
          .address-cell {
            max-width: 150px;
          }
          
          .created-date {
            white-space: normal;
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
}

export default CardListTable;