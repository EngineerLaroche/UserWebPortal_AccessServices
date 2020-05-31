import React from "react";
import { FormattedMessage } from "react-intl";

const Banner = ({ token }) => {
  if (token) {
    return null;
  }
  return (
    <div>
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">
            <FormattedMessage id="banner.title" />
            <div class="aa">
              <FormattedMessage id="app.name" />
            </div>
          </h1>
          <p>
            <h6>
              <FormattedMessage id="dev.first" />
              <h7 class="aa">
                <FormattedMessage id="dev.name" />
              </h7>
              <FormattedMessage id="dev.second" />
            </h6>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
