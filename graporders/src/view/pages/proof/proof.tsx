import React, { useState, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { i18n } from "../../../i18n";
import yupFormSchemas from "src/modules/shared/yup/yupFormSchemas";
import InputFormItem from "src/shared/form/InputFormItem";
import ImagesFormItem from "src/shared/form/ImagesFormItems";
import * as yup from "yup";
// import actions from "src/modules/kyc/form/kycFormActions";
import { yupResolver } from "@hookform/resolvers/yup";
import authSelectors from "src/modules/auth/authSelectors";
import transactionEnumerators from "src/modules/transaction/transactionEnumerators";
import Storage from "src/security/storage";

// Dynamic schema function
const createSchema = (documentType) =>
  yup.object().shape({
    user: yupFormSchemas.relationToOne(i18n("entities.vip.fields.title"), {}),
    Documenttype: yupFormSchemas.string(i18n("pages.proof.fields.documentType")),
    realname: yupFormSchemas.string(i18n("pages.proof.fields.fullName"), { required: true }),
    idnumer: yupFormSchemas.string(i18n("pages.proof.fields.documentNumber"), { required: true }),
    address: yupFormSchemas.string(i18n("pages.proof.fields.address"), { required: true }),
    front: yupFormSchemas.images(i18n("pages.proof.fields.frontSide"), { required: true }),
    back:
      documentType === "passport"
        ? yupFormSchemas.images(i18n("pages.proof.fields.backSide"))
        : yupFormSchemas.images(i18n("pages.proof.fields.backSide"), { required: true }),

    status: yupFormSchemas.enumerator(
      i18n("entities.transaction.fields.status"),
      { options: transactionEnumerators.status }
    ),
  });

function Proof() {
  const [document, setDocument] = useState("passport");
  const currentUser = useSelector(authSelectors.selectCurrentUser);
  const dispatch = useDispatch();

  // Use useMemo to recompute schema only when document changes
  const schema = useMemo(() => createSchema(document), [document]);

  const form = useForm({
    resolver: yupResolver(schema),
    mode: "all",
    defaultValues: {
      user: currentUser || [],
      Documenttype: document,
      realname: "",
      idnumer: "",
      address: "",
      front: [],
      back: [],
      status: "pending",
    },
  });

  const onSubmit = (values) => {
    const data = { ...values, user: currentUser, Documenttype: document };
    if (document === "passport") data.back = [];
    // dispatch(actions.doCreate(data));
  };

  const handleDocumentChange = (type) => {
    setDocument(type);
    if (type === "passport") form.setValue("back", []);
  };

  const documentTypeOptions = [
    { value: "passport", label: i18n("pages.proof.documentTypes.passport"), icon: "fas fa-passport" },
    { value: "idCard", label: i18n("pages.proof.documentTypes.idCard"), icon: "fas fa-id-card" },
    { value: "driversLicense", label: i18n("pages.proof.documentTypes.driversLicense"), icon: "fas fa-id-card-alt" },
  ];

  return (
    <div className="proof-container">
      {/* Header Section - Dark Theme */}
      <div className="header">
        <div className="nav-bar">
          <Link to="/profile" className="back-arrow">
            <i className="fas fa-arrow-left" />
          </Link>
          <div className="page-title">{i18n("pages.proof.title")}</div>
        </div>
      </div>

      {/* Content Card - Dark Glass */}
      <div className="content-card">
        <div className="instructions">
          <i className="fas fa-info-circle"></i>
          {i18n("pages.proof.instructions")}
        </div>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Document Info */}
            <div className="form-section">
              <div className="section-title">
                {i18n("pages.proof.sections.documentInfo")}
              </div>

              <div className="document-type-section">
                <div className="input-label">
                  {i18n("pages.proof.fields.documentType")} <span className="required">*</span>
                </div>
                <div className="document-type-options">
                  {documentTypeOptions.map((item) => (
                    <div
                      key={item.value}
                      className={`document-option ${item.value === document ? "selected" : ""}`}
                      onClick={() => handleDocumentChange(item.value)}
                    >
                      <i className={`${item.icon} document-icon`} />
                      <span className="document-text">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <InputFormItem
                  className="bank-input"  // Changed to match Bank Card input
                  name="realname"
                  label={i18n("pages.proof.fields.fullName")}
                  placeholder={i18n("pages.proof.placeholders.fullName")}
                />
              </div>

              <div className="input-group">
                <InputFormItem
                  className="bank-input"  // Changed to match Bank Card input
                  name="idnumer"
                  label={i18n("pages.proof.fields.documentNumber")}
                  placeholder={i18n("pages.proof.placeholders.documentNumber")}
                />
              </div>

              <div className="input-group">
                <InputFormItem
                  className="bank-input"  // Changed to match Bank Card input
                  name="address"
                  label={i18n("pages.proof.fields.address")}
                  placeholder={i18n("pages.proof.placeholders.address")}
                />
              </div>
            </div>

            {/* Upload Section */}
            <div className="form-section">
              <div className="section-title">
                {i18n("pages.proof.sections.documentUpload")}
              </div>

              <div className="upload-section">
                <ImagesFormItem
                  name="front"
                  label={i18n("pages.proof.fields.frontSide")}
                  storage={Storage.values.categoryPhoto}
                  text={i18n("pages.proof.uploadTexts.frontSide")}
                  max={2}
                />
              </div>

              {document !== "passport" && (
                <div className="upload-section">
                  <ImagesFormItem
                    name="back"
                    label={i18n("pages.proof.fields.backSide")}
                    storage={Storage.values.categoryPhoto}
                    text={i18n("pages.proof.uploadTexts.backSide")}
                    max={2}
                  />
                </div>
              )}
            </div>

            {/* Security Note */}
            <div className="security-note">
              <div className="security-header">
                <i className="fas fa-shield-alt" /> {i18n("pages.proof.security.title")}
              </div>
              <div className="security-text">
                {i18n("pages.proof.security.text")}
              </div>
            </div>

            <button type="submit" className="submit-button">
              {i18n("pages.proof.buttons.validateDocuments")}
            </button>
          </form>
        </FormProvider>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        body {
          background-color: #0a0a0a;
          color: #ffffff;
          line-height: 1.6;
          overflow-x: hidden;
        }

        .proof-container {
          margin: 0 auto;
          position: relative;
          min-height: 100vh;
          background: #0a0a0a;
        }

        /* Header Section - Dark Theme */
        .header {
          min-height: 60px;
          position: relative;
          padding: 20px;
          background: #0a0a0a;
          border-bottom: 1px solid rgba(212, 175, 55, 0.3);
        }

        .nav-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .back-arrow {
          color: #d4af37;
          font-size: 20px;
          font-weight: 300;
          text-decoration: none;
          transition: opacity 0.3s ease;
        }

        .back-arrow:hover {
          opacity: 0.8;
        }

        .page-title {
          color: #d4af37;
          font-size: 18px;
          font-weight: 600;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        /* Content Card - Dark Glass */
        .content-card {
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(8px);
          min-height: calc(100vh - 60px);
        }

        .instructions {
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 20px;
          padding: 16px;
          font-size: 14px;
          color: rgba(255,255,255,0.9);
          margin-bottom: 25px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          line-height: 1.5;
        }

        .instructions i {
          font-size: 18px;
          color: #d4af37;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .form-section {
          margin-bottom: 30px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #d4af37;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(212,175,55,0.2);
        }

        .document-type-section {
          margin-bottom: 20px;
        }

        .input-label {
          display: block;
          font-size: 14px;
          color: rgba(255,255,255,0.8);
          margin-bottom: 10px;
          font-weight: 500;
        }

        .required {
          color: #d4af37;
        }

        .document-type-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .document-option {
          display: flex;
          align-items: center;
          padding: 14px 16px;
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
          background: rgba(255,255,255,0.02);
        }

        .document-option:hover {
          border-color: #d4af37;
          background: rgba(212,175,55,0.1);
        }

        .document-option.selected {
          border-color: #d4af37;
          background: rgba(212,175,55,0.15);
          box-shadow: 0 0 0 2px rgba(212,175,55,0.2);
        }

        .document-icon {
          font-size: 18px;
          color: #d4af37;
          margin-right: 12px;
          width: 24px;
          text-align: center;
        }

        .document-text {
          font-size: 15px;
          font-weight: 500;
          color: #ffffff;
        }

        .document-option.selected .document-text {
          color: #d4af37;
          font-weight: 600;
        }

        .input-group {
          margin-bottom: 12px;
        }

        /* Input styling - exactly matching Bank Card input */
        .bank-input {
          width: 100%;
          padding: 12px 16px;
          font-size: 15px;
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 16px;
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

        .bank-input label {
          display: block;
          font-size: 14px;
          color: rgba(255,255,255,0.8);
          margin-bottom: 6px;
          font-weight: 500;
        }

        /* Upload section styling */
        .upload-section {
          margin-bottom: 20px;
        }

        /* Security Note */
        .security-note {
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 20px;
          padding: 18px;
          margin-bottom: 25px;
        }

        .security-header {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          font-weight: 600;
          color: #d4af37;
          margin-bottom: 8px;
        }

        .security-header i {
          font-size: 20px;
        }

        .security-text {
          font-size: 14px;
          color: rgba(255,255,255,0.8);
          line-height: 1.5;
        }

        /* Submit Button */
        .submit-button {
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
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: 0 10px 22px rgba(212,175,55,0.3);
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

        /* Image upload component styling override (for antd) */
        .ant-upload.ant-upload-select {
          width: 100% !important;
          background: rgba(255,255,255,0.02) !important;
          border: 1px dashed rgba(212,175,55,0.3) !important;
          border-radius: 20px !important;
          color: rgba(255,255,255,0.8) !important;
          transition: border-color 0.2s;
        }

        .ant-upload.ant-upload-select:hover {
          border-color: #d4af37 !important;
        }

        .ant-upload-list-item {
          margin-top: 8px !important;
          color: #ffffff !important;
        }

        /* Responsive adjustments */
        @media (max-width: 380px) {
          .header {
            padding: 16px;
            min-height: 50px;
          }
          .page-title {
            font-size: 16px;
          }
          .content-card {
            padding: 20px 16px 30px;
          }
          .instructions {
            font-size: 13px;
            padding: 14px;
          }
          .section-title {
            font-size: 16px;
          }
          .document-option {
            padding: 12px 14px;
          }
          .document-text {
            font-size: 14px;
          }
          .bank-input {
            padding: 10px 14px;
            font-size: 14px;
          }
          .submit-button {
            padding: 12px;
            font-size: 15px;
          }
        }

        @media (min-width: 768px) {
          .content-card {
            padding: 30px 25px 50px;
          }

          .document-type-options {
            flex-direction: row;
            gap: 12px;
          }

          .document-option {
            flex: 1;
            flex-direction: column;
            text-align: center;
            padding: 16px 10px;
          }

          .document-icon {
            margin-right: 0;
            margin-bottom: 8px;
          }
        }
      `}</style>
    </div>
  );
}

export default Proof;