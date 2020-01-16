import React from 'react';
import { connect } from 'react-redux';
import { CHANGE_TAB } from '../../constants/actionTypes';
import { FormattedMessage } from 'react-intl';

const mapDispatchToProps = dispatch => ({
  onTabClick: (tab, pager, payload) => dispatch({ type: CHANGE_TAB, tab, pager, payload })
});

const MainView = props => {
  return (
    <div className="col-md-11">
      <br />
      <br />
      <h1 className="text-xs-center">
        <FormattedMessage
          id="MainView.text"
          defaultMessage=" " />
      </h1>
      <br />
    </div>
  );
};

export default connect(mapDispatchToProps)(MainView);
