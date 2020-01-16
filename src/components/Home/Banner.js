import React from 'react';
import { FormattedMessage } from 'react-intl';

const Banner = ({ token }) => {
  if (token) {
    return null;
  }
  return (
    <div className="banner">
      <div className="container">
        <h1 className="logo-font">
          <FormattedMessage
            id="banner.title"
            defaultMessage="Portail Web des Employés" />
        </h1>
        <p>
          <FormattedMessage
            id="banner.text"
            defaultMessage="Le portail web a été créé pour explorer Node.JS" />
        </p>
      </div>
    </div>
  );
};

export default Banner;
