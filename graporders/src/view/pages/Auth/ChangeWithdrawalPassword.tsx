import React, { useState } from "react";
import SubHeader from "src/view/shared/Header/SubHeader";
import yupFormSchemas from "src/modules/shared/yup/yupFormSchemas";
import * as yup from "yup";
import { i18n } from "../../../i18n";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import actions from 'src/modules/user/form/userFormActions';
import InputFormItem from "src/shared/form/InputFormItem";
import selectors from "src/modules/auth/authSelectors";
import ButtonIcon from "src/shared/ButtonIcon";

const schema = yup.object().shape({
  oldPassword: yupFormSchemas.string(i18n("user.fields.oldPassword"), {
    required: true,
  }),
  newPassword: yupFormSchemas.string(i18n("user.fields.newPassword"), {
    required: true,
  }),
  newPasswordConfirmation: yupFormSchemas
    .string(i18n("user.fields.newPasswordConfirmation"), {
      required: true,
    })
    .oneOf(
      [yup.ref("newPassword"), null],
      i18n("auth.passwordChange.mustMatch")
    ),
});

function ChangeWithdrawalPassword() {
  const dispatch = useDispatch();
  const [initialValues] = useState(() => ({
    oldPassword: "",
    newPassword: "",
    newPasswordConfirmation: "",
  }));

  const form = useForm({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: initialValues,
  });

  const saveLoading = useSelector(selectors.selectLoadingPasswordChange);

  const onSubmit = (values) => {
    dispatch(actions.doUpdateWithdrawPassword(values));
  };

  return (
    <div>
      <SubHeader title={i18n('pages.changePassword.withdrawPassword')} path="/profile" />

      <style>{`
        .change-password-container {
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

        .label__form .required-asterisk {
          color: #d4af37;
          margin-right: 4px;
        }

        /* Bank input styling - exactly matching Withdraw page */
        .bank-input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 16px;
          font-size: 15px;
          background: rgba(255,255,255,0.02);
          color: #ffffff;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }

        .bank-input:focus {
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.2);
        }

        .bank-input::placeholder {
          color: rgba(255,255,255,0.4);
          font-size: 14px;
        }

        /* Submit Button - gold gradient */
        .change-password-button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(145deg, #d4af37, #b8960f);
          color: #0a0a0a;
          border: none;
          border-radius: 40px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 16px;
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 10px 22px rgba(212,175,55,0.3);
        }

        .change-password-button:hover {
          transform: scale(1.02);
          background: linear-gradient(145deg, #e0b84d, #c9a227);
          box-shadow: 0 14px 30px rgba(212,175,55,0.5);
        }

        .change-password-button:active {
          transform: scale(0.98);
          box-shadow: 0 6px 16px rgba(212,175,55,0.4);
        }

        .change-password-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        /* Note text */
        .note-text {
          display: block;
          margin-top: 20px;
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          text-align: center;
        }

        .note-text b {
          color: #d4af37;
          font-weight: 600;
        }

        /* Responsive adjustments */
        @media (max-width: 380px) {
          .change-password-container {
            padding: 16px 12px;
          }
          .bank-input {
            padding: 10px 14px;
            font-size: 14px;
          }
          .change-password-button {
            padding: 12px;
            font-size: 15px;
          }
        }
      `}</style>

      <div className="change-password-container">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Old Password */}
            <div className="form-group">
              <div className="label__form">
                <span className="required-asterisk">*</span>
                <span>{i18n('pages.changePassword.oldPassword')}</span>
              </div>
              <InputFormItem
                type="password"
                name="oldPassword"
                autoComplete="old-password"
                className="bank-input"
              />
            </div>

            {/* New Password */}
            <div className="form-group">
              <div className="label__form">
                <span className="required-asterisk">*</span>
                <span>{i18n('pages.changePassword.newPassword')}</span>
              </div>
              <InputFormItem
                type="password"
                name="newPassword"
                autoComplete="new-password"
                className="bank-input"
              />
            </div>

            {/* Confirm New Password */}
            <div className="form-group">
              <div className="label__form">
                <span className="required-asterisk">*</span>
                <span>{i18n('pages.changePassword.confirmPassword')}</span>
              </div>
              <InputFormItem
                type="password"
                name="newPasswordConfirmation"
                autoComplete="new-password"
                className="bank-input"
              />
            </div>

            {/* Submit Button */}
            <button
              className="change-password-button"
              disabled={saveLoading}
              type="submit"
            >
              <ButtonIcon loading={saveLoading} iconClass="far fa-save" />
              {i18n('pages.changePassword.submit')}
            </button>

            {/* Note */}
            <span className="note-text">
              <b>Note:</b> {i18n('pages.changePassword.note')}
            </span>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

export default ChangeWithdrawalPassword;