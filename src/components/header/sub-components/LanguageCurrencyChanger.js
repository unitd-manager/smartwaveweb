import PropTypes from "prop-types";
import React from "react";
//import { changeLanguage } from "redux-multilanguage";
import { getUser } from "../../../common/user";

const LanguageCurrencyChanger = ({
  currency,
  setCurrency,
  currentLanguageCode,
  dispatch
}) => {
  // const changeLanguageTrigger = e => {
  //   const languageCode = e.target.value;
  //   dispatch(changeLanguage(languageCode));
  // };
const user=getUser();
  // const setCurrencyTrigger = e => {
  //   const currencyName = e.target.value;
  //   setCurrency(currencyName);
  // };

  return (
    <div className="language-currency-wrap" >
      <div className="same-language-currency email-section">
        <span>
          <i className="fa fa-envelope"></i> Email : support@smartwaveintl.com
        </span>
    
      </div>

      <div className="same-language-currency">
        <p><i className="fa fa-phone"></i> Call Us +91 89258 51195/96</p>
      </div>
     {user&& <div className="same-language-currency welcome-section">
        <p><i className="fa fa-user"></i> Welcome, {user.first_name}</p>
      </div>}
      <style jsx="true">{`
  .language-currency-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: nowrap;
    color: #fff;
    width: 100%;
  }

  .language-currency-wrap .same-language-currency,
  .language-currency-wrap .same-language-currency p,
  .language-currency-wrap .same-language-currency span {
    color: #fff;
    margin: 0;
    font-size: 13px;
    white-space: nowrap;
  }

  .language-currency-wrap i {
    color: #fff;
    margin-right: 8px;
  }

  /* Email-specific hover: icon and text become pure white */
  .language-currency-wrap .email-section {
    color: rgba(255,255,255,0.9);
  }

  /* Make the email icon pure white by default; text slightly dimmer */
  .language-currency-wrap .email-section span i {
  
    color: #ffffff;
  }

  .language-currency-wrap .email-section span {
    color: rgba(255,255,255,0.9);
  }

  /* Hover: ensure text stays pure white */
  .language-currency-wrap .email-section:hover,
  .language-currency-wrap .email-section:hover span {
    color: #ffffff;
  }

  .language-currency-wrap .same-language-currency + .same-language-currency {
    border-left: none;
    padding-left: 12px;
    margin-left: 12px;
  }

  .welcome-section {
    margin-left: auto;
  }
`}</style>
    </div>
    
  );
};

LanguageCurrencyChanger.propTypes = {
  setCurrency: PropTypes.func,
  currency: PropTypes.object,
  currentLanguageCode: PropTypes.string,
  dispatch: PropTypes.func
};

export default LanguageCurrencyChanger;
