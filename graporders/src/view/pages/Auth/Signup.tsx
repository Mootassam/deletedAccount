import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

import actions from "src/modules/auth/authActions";
import selectors from "src/modules/auth/authSelectors";
import yupFormSchemas from "src/modules/shared/yup/yupFormSchemas";
import { i18n } from "../../../i18n";
import InputFormItem from "src/shared/form/InputFormItem";
import ButtonIcon from "src/shared/ButtonIcon";

const schema = yup.object().shape({
  email: yupFormSchemas.string(i18n("user.fields.username"), {
    required: true,
  }),
  password: yupFormSchemas.string(i18n("user.fields.password"), {
    required: true,
  }),
  newPasswordConfirmation: yupFormSchemas
    .string(i18n("user.fields.newPasswordConfirmation"), {
      required: true,
    })
    .oneOf([yup.ref("password")], i18n("auth.passwordChange.mustMatch")),
  phoneNumber: yupFormSchemas.string(i18n("user.fields.phoneNumber"), {
    required: true,
  }),
  withdrawPassword: yupFormSchemas.string(
    i18n("user.fields.withdrawPassword"),
    { required: true }
  ),
  invitationcode: yupFormSchemas.string(i18n("user.fields.invitationcode"), {
    required: true,
  }),
  rememberMe: yupFormSchemas.boolean(i18n("user.fields.rememberMe")),
});

function Signup() {
  const dispatch = useDispatch();
  const loading = useSelector(selectors.selectLoading);
  const externalErrorMessage = useSelector(selectors.selectErrorMessage);

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const [initialValues] = useState({
    email: "",
    password: "",
    phoneNumber: "",
    withdrawPassword: "",
    invitationcode: "",
    rememberMe: true,
  });

  // Fetch countries + IP country detection
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,flags,idd,cca2"
        );

        const countriesData = response.data
          .filter((c) => c.idd?.root)
          .map((country) => {
            let dialCode = country.idd.root;
            const rootOnlyCountries = ['US', 'CA', 'RU', 'KZ', 'AU'];
            if (rootOnlyCountries.includes(country.cca2)) {
              dialCode = country.idd.root;
            } else if (country.idd.suffixes && country.idd.suffixes.length > 0) {
              dialCode = country.idd.root + (country.idd.suffixes[0] || "");
            }
            return {
              value: dialCode,
              label: country.name.common,
              code: country.cca2,
              flag: country.flags.svg,
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label));

        setCountries(countriesData);

        try {
          const ipResponse = await axios.get("https://ip2c.org/s");
          const countryCode = ipResponse.data.split(";")[1];
          const defaultCountry = countriesData.find(
            (c) => c.code === countryCode
          );
          setSelectedCountry(defaultCountry || countriesData[0]);
        } catch {
          setSelectedCountry(countriesData[0]);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
    dispatch(actions.doClearErrorMessage());
  }, [dispatch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current?.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.value.includes(searchTerm) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const form = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues: initialValues,
  });

  const onSubmit = ({
    email,
    password,
    phoneNumber,
    withdrawPassword,
    invitationcode,
  }) => {
    const fullPhoneNumber = `${selectedCountry?.value || "+1"}${phoneNumber}`;
    dispatch(
      actions.doRegisterEmailAndPassword(
        email,
        password,
        fullPhoneNumber,
        withdrawPassword,
        invitationcode
      )
    );
  };

  return (
    <div className="auth__page">
      <div className="auth__card">
        <div className="auth__header">
          <div className="auth__icon">
            <i className="fas fa-car"></i> {/* replaced hotel with car */}
          </div>
          <h1 className="auth__title">{i18n('pages.auth.signup.createAccount')}</h1>
          <p className="auth__description">
            {i18n('pages.auth.signup.signupForAccount')}
          </p>
        </div>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="auth__form">
              {/* Email */}
              <div className="form__group">
                <InputFormItem
                  type="text"
                  name="email"
                  placeholder={i18n("user.fields.username")}
                  className="auth__input"
                  externalErrorMessage={externalErrorMessage}
                />
              </div>

              {/* Phone Number with Country Selector */}
              <div className="form__group phone-input-wrapper">
                <div
                  className={`phone-input-container ${dropdownOpen ? 'dropdown-open' : ''}`}
                  ref={dropdownRef}
                >
                  <div className="phone-input-inner">
                    {/* Country Selector */}
                    <div
                      className="country-selector"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      {selectedCountry && (
                        <div className="country-selected">
                          <img
                            src={selectedCountry.flag}
                            alt={selectedCountry.label}
                            className="country-flag"
                          />
                          <span className="country-code">{selectedCountry.value}</span>
                          <span className="dropdown-arrow">▾</span>
                        </div>
                      )}
                    </div>

                    {/* Phone Number Input */}
                    <div className="phone-number-input">
                      <InputFormItem
                        type="tel"
                        name="phoneNumber"
                        placeholder={i18n('pages.auth.signup.phonePlaceholder')}
                        className="auth__input phone-input"
                      />
                    </div>
                  </div>

                  {/* Country Dropdown */}
                  {dropdownOpen && (
                    <div className="country-dropdown">
                      <div className="dropdown-search">
                        <input
                          type="text"
                          placeholder={i18n('pages.auth.signup.searchCountries')}
                          className="search-input"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div className="dropdown-list">
                        {filteredCountries.map((country) => (
                          <div
                            key={country.code}
                            className={`country-option ${selectedCountry?.code === country.code ? "selected" : ""}`}
                            onClick={() => {
                              setSelectedCountry(country);
                              setDropdownOpen(false);
                              setSearchTerm("");
                            }}
                          >
                            <img
                              src={country.flag}
                              alt={country.label}
                              className="country-flag"
                            />
                            <span className="country-name">{country.label}</span>
                            <span className="country-dial-code">{country.value}</span>
                          </div>
                        ))}
                        {filteredCountries.length === 0 && (
                          <div className="no-results">
                            {i18n('pages.auth.signup.noCountriesFound')}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Withdraw Password */}
              <div className="form__group">
                <InputFormItem
                  type="password"
                  name="withdrawPassword"
                  placeholder={i18n("user.fields.withdrawPassword")}
                  className="auth__input"
                />
              </div>

              {/* Password */}
              <div className="form__group">
                <InputFormItem
                  type="password"
                  name="password"
                  placeholder={i18n("user.fields.password")}
                  className="auth__input"
                />
              </div>

              {/* Confirm Password */}
              <div className="form__group">
                <InputFormItem
                  type="password"
                  name="newPasswordConfirmation"
                  autoComplete="new-password"
                  placeholder={i18n("user.fields.confirmPassword")}
                  className="auth__input"
                />
              </div>

              {/* Invitation Code */}
              <div className="form__group">
                <InputFormItem
                  type="text"
                  name="invitationcode"
                  placeholder={i18n("user.fields.invitationcode")}
                  className="auth__input"
                />
              </div>
            </div>

            <div className="auth__bottom">
              <button className="auth__button" disabled={loading} type="submit">
                <ButtonIcon loading={loading} />
                <span>{i18n('pages.auth.signup.signupButton')}</span>
                <i className="fas fa-arrow-right"></i>
              </button>

              <div className="signup-text">
                <span>{i18n('pages.auth.signup.alreadyHaveAccount')}</span>
                <Link to="/auth/signin" className="signup-link">
                  {i18n('auth.signin')}
                </Link>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        body {
          background-color: #0a0a0a;
        }

        .auth__page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0a url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&auto=format&fit=crop') center/cover no-repeat fixed;
          padding: 0px;
          position: relative;
        }

        .auth__page::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(3px);
          z-index: 1;
        }

        .auth__card {
          width: 100%;
          max-width: 480px;
          background: rgba(10, 10, 10, 0.7);
          backdrop-filter: blur(16px);
          padding: 32px 24px 36px;
          z-index: 10;
          box-shadow: 0 12px 40px rgba(212, 175, 55, 0.05);
          border-radius: 24px;
        }

        .auth__header {
          text-align: center;
          margin-bottom: 32px;
        }

        .auth__icon {
          font-size: 42px;
          background: rgba(212, 175, 55, 0.15);
          width: 74px;
          height: 74px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          box-shadow: 0 8px 16px rgba(212, 175, 55, 0.3);
          color: #d4af37;
          border: 1px solid rgba(212, 175, 55, 0.5);
        }

        .auth__title {
          font-size: 26px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 4px;
          letter-spacing: 0.5px;
        }

        .auth__description {
          font-size: 14px;
          color: #d4af37;
          opacity: 0.9;
          letter-spacing: 0.3px;
        }

        .auth__form {
          margin-bottom: 20px;
        }

        .form__group {
          margin-bottom: 16px;
        }

        .auth__input {
          width: 100%;
          padding: 12px 18px;
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 30px;
          font-size: 15px;
          background: rgba(255, 255, 255, 0.05) !important;
          color: white;
          transition: border 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .auth__input:focus {
          outline: none;
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
          background: rgba(255, 255, 255, 0.1) !important;
        }

        .auth__input::placeholder {
          color: rgba(255, 255, 255, 0.5);
          font-weight: 300;
        }

        /* Phone input specific styles */
        .phone-input-wrapper {
          width: 100%;
        }

        .phone-input-container {
          position: relative;
          width: 100%;
        }

        .phone-input-inner {
          display: flex;
          align-items: stretch;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 30px;
          transition: border 0.2s, box-shadow 0.2s;
        }

        .phone-input-container:focus-within .phone-input-inner {
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
        }

        .country-selector {
          display: flex;
          align-items: center;
          padding-left: 12px;
          cursor: pointer;
          border-right: 1px solid rgba(212, 175, 55, 0.3);
          min-width: 100px;
        }

        .country-selected {
          display: flex;
          align-items: center;
          gap: 8px;
          color: white;
        }

        .country-flag {
          width: 24px;
          height: 18px;
          object-fit: cover;
          border-radius: 3px;
        }

        .country-code {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
        }

        .dropdown-arrow {
          color: #d4af37;
          font-size: 16px;
          margin-left: 4px;
        }

        .phone-number-input {
          flex: 1;
        }

        .phone-number-input .auth__input {
          border: none;
          border-radius: 0 30px 30px 0;
          background: transparent !important;
          padding-left: 8px;
        }

        .phone-number-input .auth__input:focus {
          box-shadow: none;
          background: transparent !important;
        }

        /* Country dropdown */
        .country-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: rgba(20, 20, 20, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 20px;
          z-index: 20;
          max-height: 320px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
        }

        .dropdown-search {
          padding: 12px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        }

        .search-input {
          width: 100%;
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 30px;
          color: white;
          font-size: 14px;
        }

        .search-input:focus {
          outline: none;
          border-color: #d4af37;
        }

        .search-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .dropdown-list {
          overflow-y: auto;
          max-height: 260px;
          padding: 8px 0;
        }

        .country-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          cursor: pointer;
          transition: background 0.15s;
          color: white;
        }

        .country-option:hover,
        .country-option.selected {
          background: rgba(212, 175, 55, 0.15);
        }

        .country-option .country-flag {
          width: 28px;
          height: 20px;
        }

        .country-name {
          flex: 1;
          font-size: 14px;
        }

        .country-dial-code {
          font-size: 13px;
          color: #d4af37;
          opacity: 0.8;
        }

        .no-results {
          padding: 16px;
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          font-style: italic;
        }

        .auth__bottom {
          text-align: center;
        }

        .auth__button {
          width: 100%;
          background: linear-gradient(145deg, #d4af37, #b8960f);
          border: none;
          border-radius: 34px;
          padding: 14px 18px;
          color: #0a0a0a;
          font-size: 17px;
          font-weight: 700;
          letter-spacing: 0.5px;
          cursor: pointer;
          box-shadow: 0 10px 22px rgba(212, 175, 55, 0.4);
          transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 20px;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .auth__button:hover {
          transform: scale(1.02);
          background: linear-gradient(145deg, #e0b84d, #c9a227);
          box-shadow: 0 14px 30px rgba(212, 175, 55, 0.6);
        }

        .auth__button:active {
          transform: scale(0.98);
          box-shadow: 0 6px 16px rgba(212, 175, 55, 0.5);
        }

        .auth__button i {
          font-size: 15px;
        }

        .signup-text {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.7);
        }

        .signup-link {
          color: #d4af37;
          font-weight: 600;
          text-decoration: none;
          margin-left: 4px;
          transition: color 0.2s;
        }

        .signup-link:hover {
          color: #e0b84d;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

export default Signup;