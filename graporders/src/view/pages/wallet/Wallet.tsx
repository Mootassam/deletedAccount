import React, { useState } from "react";
import SubHeader from "src/view/shared/Header/SubHeader";
import yupFormSchemas from "src/modules/shared/yup/yupFormSchemas";
import * as yup from "yup";
import { i18n } from "../../../i18n";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import actions from "src/modules/auth/authActions";
import InputFormItem from "src/shared/form/InputFormItem";
import selector from "src/modules/auth/authSelectors";
import SelectFormItem from "src/shared/form/SelectFormItem";
import userEnumerators from "src/modules/user/userEnumerators";

const schema = yup.object().shape({
  preferredcoin: yupFormSchemas.enumerator(i18n("user.fields.status"), {
    options: userEnumerators.wallet,
    required: true,
  }),
  trc20: yupFormSchemas.string(i18n("user.fields.walletAddress"), {
    required: true,
  }),
  withdrawPassword: yupFormSchemas.string(
    i18n("user.fields.withdrawPassword"),
    {
      required: true,
    }
  ),
});

function Wallet() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selector.selectCurrentUser);

  const [initialValues] = useState(() => {
    return {
      trc20: currentUser.trc20,
      walletname: currentUser.walletname,
      usernamewallet: currentUser.usernamewallet,
      balance: currentUser?.balance,
      preferredcoin: currentUser?.preferredcoin
    };
  });
  
  const form = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues: initialValues,
  });
  
  const onSubmit = ({
    preferredcoin,
    withdrawPassword,
    trc20,
    walletname,
    usernamewallet,
  }) => {
    const values = {
      trc20: trc20,
      walletname: walletname,
      usernamewallet: usernamewallet,
      balance: currentUser?.balance,
      withdrawPassword: withdrawPassword,
      preferredcoin: preferredcoin
    };
    dispatch(actions.doUpdateProfileWallet(values));
  };
  
  return (
    <div>
      <SubHeader title={i18n('pages.wallet.title')} path="/profile" />

      <style>{`
        .wallet-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 20px 16px;
          background: #0a0a0a;
          color: #ffffff;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-height: 100vh;
        }

        .wallet-title {
          font-size: 18px;
          font-weight: 600;
          color: #d4af37;
          margin-bottom: 24px;
          letter-spacing: 0.5px;
          border-bottom: 1px solid rgba(212,175,55,0.2);
          padding-bottom: 8px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .label__form {
          display: flex;
          align-items: center;
          margin-bottom: 6px;
          font-size: 14px;
          color: rgba(255,255,255,0.8);
        }

        .required-asterisk {
          color: #d4af37;
          margin-right: 4px;
          font-size: 14px;
        }

        /* Input fields (text, password) */
        .wallet-input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 16px;
          font-size: 15px;
          color: #ffffff;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .wallet-input:focus {
          outline: none;
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.2);
        }

        .wallet-input::placeholder {
          color: rgba(255,255,255,0.4);
          font-weight: 300;
        }

        /* Select field styling */
        .wallet-select {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 16px;
          font-size: 15px;
          color: #ffffff;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23d4af37%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: 1rem;
          padding-right: 2.5rem;
        }

        .wallet-select:focus {
          outline: none;
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.2);
        }

        .wallet-select option {
          background: #1a1a1a;
          color: #ffffff;
        }

        /* Submit button */
        .wallet-submit {
          width: 100%;
          background: linear-gradient(145deg, #d4af37, #b8960f);
          border: none;
          border-radius: 40px;
          padding: 14px 18px;
          color: #0a0a0a;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.5px;
          cursor: pointer;
          box-shadow: 0 10px 22px rgba(212,175,55,0.3);
          transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
          margin-top: 16px;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .wallet-submit:hover {
          transform: scale(1.02);
          background: linear-gradient(145deg, #e0b84d, #c9a227);
          box-shadow: 0 14px 30px rgba(212,175,55,0.5);
        }

        .wallet-submit:active {
          transform: scale(0.98);
          box-shadow: 0 6px 16px rgba(212,175,55,0.4);
        }

        .wallet-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        /* Note text */
        .wallet-note {
          display: block;
          margin-top: 16px;
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          text-align: center;
        }

        .wallet-note b {
          color: #d4af37;
          font-weight: 600;
        }

        /* Override any global InputFormItem background */
        .wallet-input,
        .wallet-select {
          background-color: rgba(255,255,255,0.02) !important;
        }
      `}</style>

      <div className="wallet-container">
        <h3 className="wallet-title">{i18n('pages.wallet.withdrawalMethod')}</h3>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Username */}
            <div className="form-group">
              <div className="label__form">
                <span className="required-asterisk">*</span>
                <span>{i18n('pages.wallet.username')}</span>
              </div>
              <InputFormItem
                type="text"
                name="usernamewallet"
                placeholder={i18n("user.fields.username")}
                className="wallet-input"
              />
            </div>

            {/* Wallet Name */}
            <div className="form-group">
              <div className="label__form">
                <span className="required-asterisk">*</span>
                <span>{i18n('pages.wallet.walletName')}</span>
              </div>
              <InputFormItem
                type="text"
                name="walletname"
                placeholder={i18n("user.fields.walletName")}
                className="wallet-input"
              />
            </div>

            {/* Preferred Coin (Select) */}
            <div className="form-group">
              <div className="label__form">
                <span className="required-asterisk">*</span>
                <span>{i18n('pages.wallet.choosePreferredCoin')}:</span>
              </div>
              <SelectFormItem
                name="preferredcoin"
                options={userEnumerators.wallet.map((value) => ({
                  value,
                  label: i18n(`user.enumerators.status.${value}`),
                }))}
                required={true}
                className="wallet-select" // we need to ensure SelectFormItem accepts className and passes it to the select element
              />
            </div>

            {/* Wallet Address */}
            <div className="form-group">
              <div className="label__form">
                <span className="required-asterisk">*</span>
                <span>{i18n('pages.wallet.walletAddress')}</span>
              </div>
              <InputFormItem
                type="text"
                name="trc20"
                placeholder={i18n("user.fields.walletAddress")}
                className="wallet-input"
              />
            </div>

            {/* Withdraw Password */}
            <div className="form-group">
              <div className="label__form">
                <span className="required-asterisk">*</span>
                <span>{i18n('pages.wallet.withdrawPassword')}</span>
              </div>
              <InputFormItem
                type="password"
                name="withdrawPassword"
                placeholder={i18n("user.fields.withdrawPassword")}
                className="wallet-input"
              />
            </div>

            <button className="wallet-submit" type="submit">
              {i18n('pages.wallet.submit')}
            </button>
            <span className="wallet-note">
              <b>Note:</b> {i18n('pages.wallet.note')}
            </span>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default Wallet;