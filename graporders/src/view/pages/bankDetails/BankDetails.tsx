import React, { useCallback, useEffect, useState } from "react";
import SubHeader from "src/view/shared/Header/SubHeader";
import authSelectors from "src/modules/auth/authSelectors";
import yupFormSchemas from "src/modules/shared/yup/yupFormSchemas";
import * as yup from "yup";
import { i18n } from "../../../i18n";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import InputFormItem from "src/shared/form/InputFormItem";
import actions from "src/modules/user/form/userFormActions";
import authActions from "src/modules/auth/authActions";

const schema = yup.object().shape({
  accountHolder: yupFormSchemas.string(i18n("entities.transaction.fields.accountHolder"), {
    required: true,
  }),
  ibanNumber: yupFormSchemas.string(i18n("entities.transaction.fields.ibanNumber"), {
    required: true,
  }),
  bankName: yupFormSchemas.string(i18n("entities.transaction.fields.bankName"), {
    required: true,
  }),
  ifscCode: yupFormSchemas.string(i18n("entities.transaction.fields.ifscCode"), {
    required: true,
  })
});

function Withdraw() {
  const currentUser = useSelector(authSelectors.selectCurrentUser);
  const dispatch = useDispatch();

  const refreshItems = useCallback(async () => {
    await dispatch(authActions.doRefreshCurrentUser());
  }, [dispatch]);

  const onSubmit = async ({ accountHolder, ibanNumber, bankName, ifscCode }) => {
    const values = {
      accountHolder,
      ibanNumber,
      bankName,
      ifscCode,
    };
    await dispatch(actions.doUpdateBank(values));
    await refreshItems();
  };

  const [initialValues] = useState({
    accountHolder: currentUser?.accountHolder || "",
    ibanNumber: currentUser?.ibanNumber || "",
    bankName: currentUser?.bankName || "",
    ifscCode: currentUser?.ifscCode || "",
  });

  const form = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues: initialValues,
  });

  return (
    <div>
      <SubHeader title={i18n('pages.bankDetails.title')} path="/profile" />

      <style>{`
        .bank-details-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 20px 16px;
          background: #0a0a0a;
          color: #ffffff;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-height: 100vh;
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

        /* Style for InputFormItem – we pass className="bank-input" */
        .bank-input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 16px;
          font-size: 15px;
          color: #ffffff;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .bank-input:focus {
          outline: none;
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.2);
        }

        .bank-input::placeholder {
          color: rgba(255,255,255,0.4);
          font-weight: 300;
        }

        .submit-button {
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

        .submit-button:hover {
          transform: scale(1.02);
          background: linear-gradient(145deg, #e0b84d, #c9a227);
          box-shadow: 0 14px 30px rgba(212,175,55,0.5);
        }

        .submit-button:active {
          transform: scale(0.98);
          box-shadow: 0 6px 16px rgba(212,175,55,0.4);
        }

        .submit-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .note-text {
          display: block;
          margin-top: 16px;
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          text-align: center;
        }

        /* Override any global InputFormItem background if needed */
        .bank-input {
          background-color: rgba(255,255,255,0.02) !important;
        }
      `}</style>

      <div className="bank-details-container">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Account Holder */}
            <div className="form-group">
              <div className="label__form">
                <span className="required-asterisk">*</span>
                <span>{i18n('entities.transaction.fields.accountHolder')}</span>
              </div>
              <InputFormItem
                type="text"
                name="accountHolder"
                placeholder={i18n("entities.transaction.fields.accountHolder")}
                className="bank-input"
              />
            </div>

            {/* IBAN Number */}
            <div className="form-group">
              <div className="label__form">
                <span className="required-asterisk">*</span>
                <span>{i18n('entities.transaction.fields.ibanNumber')}</span>
              </div>
              <InputFormItem
                type="text"
                name="ibanNumber"
                placeholder={i18n("entities.transaction.fields.ibanNumber")}
                className="bank-input"
              />
            </div>

            {/* Bank Name */}
            <div className="form-group">
              <div className="label__form">
                <span className="required-asterisk">*</span>
                <span>{i18n('entities.transaction.fields.bankName')}</span>
              </div>
              <InputFormItem
                type="text"
                name="bankName"
                placeholder={i18n("entities.transaction.fields.bankName")}
                className="bank-input"
              />
            </div>

            {/* IFSC Code */}
            <div className="form-group">
              <div className="label__form">
                <span className="required-asterisk">*</span>
                <span>{i18n('entities.transaction.fields.ifscCode')}</span>
              </div>
              <InputFormItem
                type="text"
                name="ifscCode"
                placeholder={i18n("entities.transaction.fields.ifscCode")}
                className="bank-input"
              />
            </div>

            {/* Submit Button */}
            <button
              className="submit-button"
              type="submit"
              // disabled={!withdrawEnabled} // adjust as needed
            >
              {i18n('pages.withdraw.confirm')}
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default Withdraw;