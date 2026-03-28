import React from 'react';
import Spinner from 'src/view/shared/Spinner';
import TextViewItem from 'src/view/shared/view/TextViewItem';
import ViewWrapper from 'src/view/shared/styles/ViewWrapper';
import { i18n } from 'src/i18n';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function WalletViewItem(props) {
  const { user, loading } = props;

  if (loading || !user) {
    return <Spinner />;
  }

  return (
    <ViewWrapper>
      {/* Cryptocurrency Wallet Section */}
      <Row
        style={{
          paddingBottom: '10px',
          paddingTop: '20px',
          borderTop: '1px solid #e9e9e9',
          marginTop: '10px',
          backgroundColor: '#f0f8ff',
          padding: '15px',
          borderRadius: '8px 8px 0 0'
        }}
      >
        <Col sm={12}>
          <h5 style={{ color: '#0d6efd', marginBottom: '5px' }}>
            <i className="fa-brands fa-bitcoin" style={{ marginRight: '8px' }}></i>
            {i18n('Cryptocurrency Wallet Information')}
          </h5>
          <small style={{ color: '#666' }}>Digital asset wallet details</small>
        </Col>
      </Row>

      <Row style={{ paddingBottom: '10px', paddingTop: '15px', backgroundColor: '#f8f9fa' }}>
        <Col sm={4}>
          <TextViewItem
            label={i18n('Wallet Name')}
            value={user.walletname || 'Not set'}
          />
        </Col>
        <Col sm={4}>
          <TextViewItem
            label={i18n('Username Wallet')}
            value={user.usernamewallet || 'Not set'}
          />
        </Col>
        <Col sm={4}>
          <TextViewItem
            label={i18n('Preferred Coin')}
            value={user.preferredcoin ? user.preferredcoin.toUpperCase() : 'Not set'}
          />
        </Col>
      </Row>

      <Row style={{ paddingBottom: '20px', backgroundColor: '#f8f9fa' }}>
        <Col sm={6}>
          <TextViewItem
            label={i18n('TRC20 Address')}
            value={user.trc20 || 'Not set'}
          />
        </Col>
        <Col sm={6}>
          <TextViewItem
            label={i18n('ERC20 Address')}
            value={user.erc20 || 'Not set'}
          />
        </Col>
      </Row>

      {/* Bank Details Section */}
      <Row
        style={{
          paddingBottom: '10px',
          paddingTop: '20px',
          borderTop: '2px solid #e9e9e9',
          marginTop: '10px',
          backgroundColor: '#fff3cd',
          padding: '15px',
          borderRadius: '8px 8px 0 0'
        }}
      >
        <Col sm={12}>
          <h5 style={{ color: '#856404', marginBottom: '5px' }}>
            <i className="fa-solid fa-building-columns" style={{ marginRight: '8px' }}></i>
            {i18n('Bank Information')}
          </h5>
          <small style={{ color: '#666' }}>Traditional banking details</small>
        </Col>
      </Row>

      <Row style={{ paddingBottom: '10px', paddingTop: '15px', backgroundColor: '#fffaf0' }}>
        <Col sm={4}>
          <TextViewItem
            label={i18n('Account Holder')}
            value={user.accountHolder || 'Not set'}
          />
        </Col>
        <Col sm={4}>
          <TextViewItem
            label={i18n('IBAN Number')}
            value={user.ibanNumber || 'Not set'}
          />
        </Col>
        <Col sm={4}>
          <TextViewItem
            label={i18n('Bank Name')}
            value={user.bankName || 'Not set'}
          />
        </Col>
      </Row>

      <Row style={{ paddingBottom: '20px', backgroundColor: '#fffaf0' }}>
        <Col sm={4}>
          <TextViewItem
            label={i18n('IFSC Code')}
            value={user.ifscCode || 'Not set'}
          />
        </Col>
   
      
      </Row>

      {/* Balance Information Section */}
      <Row
        style={{
          paddingBottom: '10px',
          paddingTop: '20px',
          borderTop: '2px solid #e9e9e9',
          marginTop: '10px',
          backgroundColor: '#d4edda',
          padding: '15px',
          borderRadius: '8px 8px 0 0'
        }}
      >
        <Col sm={12}>
          <h5 style={{ color: '#155724', marginBottom: '5px' }}>
            <i className="fa-solid fa-wallet" style={{ marginRight: '8px' }}></i>
            {i18n('Balance Information')}
          </h5>
          <small style={{ color: '#666' }}>Current account balances</small>
        </Col>
      </Row>

      <Row style={{ paddingBottom: '20px', paddingTop: '15px', backgroundColor: '#f0fff4' }}>
        <Col sm={4}>
          <TextViewItem
            label={i18n('Total Balance')}
            value={`€${user.balance?.toFixed(2) || '0.00'}`}
          />
        </Col>
        <Col sm={4}>
          <TextViewItem
            label={i18n('Frozen Amount')}
            value={`€${user.freezeblance?.toFixed(2) || '0.00'}`}
          />
        </Col>
        <Col sm={4}>
          <TextViewItem
            label={i18n('Available Balance')}
            value={`€${((user.balance || 0) - (user.freezeblance || 0)).toFixed(2)}`}
          />
        </Col>
      </Row>

      {/* System Information Section */}
      <Row
        style={{
          paddingBottom: '10px',
          paddingTop: '20px',
          borderTop: '2px solid #e9e9e9',
          marginTop: '10px',
          backgroundColor: '#e2e3e5',
          padding: '15px',
          borderRadius: '8px 8px 0 0'
        }}
      >
        <Col sm={12}>
          <h5 style={{ color: '#383d41', marginBottom: '5px' }}>
            <i className="fa-solid fa-gear" style={{ marginRight: '8px' }}></i>
            {i18n('System Information')}
          </h5>
          <small style={{ color: '#666' }}>Account settings and status</small>
        </Col>
      </Row>

      <Row style={{ paddingBottom: '20px', paddingTop: '15px', backgroundColor: '#f8f9fa' }}>
        <Col sm={3}>
          <TextViewItem
            label={i18n('Member ID')}
            value={user.mnemberId || 'Not assigned'}
          />
        </Col>
        <Col sm={3}>
          <TextViewItem
            label={i18n('Referral Code')}
            value={user.refcode || 'Not set'}
          />
        </Col>
        <Col sm={3}>
          <TextViewItem
            label={i18n('Parent Code')}
            value={user.parentcode || 'No referrer'}
          />
        </Col>
        <Col sm={3}>
          <TextViewItem
            label={i18n('Invitation Code')}
            value={user.invitationcode || 'Not set'}
          />
        </Col>
      </Row>

      <Row style={{ paddingBottom: '20px', backgroundColor: '#f8f9fa' }}>
        <Col sm={3}>
          <TextViewItem
            label={i18n('VIP Status')}
            value={user.vip ? 'Active' : 'Inactive'}
          />
        </Col>
        <Col sm={3}>
          <TextViewItem
            label={i18n('Score')}
            value={user.score || '0'}
          />
        </Col>
        <Col sm={3}>
          <TextViewItem
            label={i18n('Tasks Completed')}
            value={user.tasksDone || '0'}
          />
        </Col>
        <Col sm={3}>
          <TextViewItem
            label={i18n('Grab Feature')}
            value={user.grab ? 'Enabled' : 'Disabled'}
          />
        </Col>
      </Row>

      <Row style={{ paddingBottom: '20px', backgroundColor: '#f8f9fa' }}>
        <Col sm={3}>
          <TextViewItem
            label={i18n('Withdraw Enabled')}
            value={user.withdraw ? 'Yes' : 'No'}
          />
        </Col>
        <Col sm={3}>
          <TextViewItem
            label={i18n('Min Balance Required')}
            value={`€${user.minbalance || '50'}`}
          />
        </Col>
        <Col sm={3}>
          <TextViewItem
            label={i18n('IP Address')}
            value={user.ipAddress || 'Not recorded'}
          />
        </Col>
        <Col sm={3}>
          <TextViewItem
            label={i18n('Country')}
            value={user.country || 'Not set'}
          />
        </Col>
      </Row>

      {/* Documents Section */}
      {user.passportPhoto && user.passportPhoto.length > 0 && (
        <>
          <Row
            style={{
              paddingBottom: '10px',
              paddingTop: '20px',
              borderTop: '2px solid #e9e9e9',
              marginTop: '10px',
              backgroundColor: '#cce5ff',
              padding: '15px',
              borderRadius: '8px 8px 0 0'
            }}
          >
            <Col sm={12}>
              <h5 style={{ color: '#004085', marginBottom: '5px' }}>
                <i className="fa-solid fa-file" style={{ marginRight: '8px' }}></i>
                {i18n('Documents')}
              </h5>
              <small style={{ color: '#666' }}>Uploaded verification documents</small>
            </Col>
          </Row>

          <Row style={{ paddingBottom: '20px', paddingTop: '15px', backgroundColor: '#f0f8ff' }}>
            <Col sm={6}>
              <TextViewItem
                label={i18n('Passport Photo')}
                value={`${user.passportPhoto.length} file(s) uploaded`}
              />
            </Col>
            <Col sm={6}>
              <TextViewItem
                label={i18n('Passport Document')}
                value={`${user.passportDocument?.length || 0} file(s) uploaded`}
              />
            </Col>
          </Row>
        </>
      )}


    </ViewWrapper>
  );
}

export default WalletViewItem;