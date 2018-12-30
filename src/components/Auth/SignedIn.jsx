'use strict';
import React, {Component} from 'react';
import connect from 'react-redux/es/connect/connect';
import {viewPath} from "../../utils/RamdaUtils";

class SignedIn extends Component {

  render() {
    const {currentUser, hasRole, hasAnyRole, children, alternative = null} = this.props;
    if (!currentUser) {
      return alternative;
    }
    if (!hasRole && !hasAnyRole) {
      return children;
    }
    // check roles
    const actual = viewPath(['currentUser', 'roles'], this.props) || {};
    if (!!hasRole) {
      return actual[hasRole] ? children : null;
    }
    if (!!hasAnyRole) {
      for (const role of hasAnyRole) {
        if (actual[role]) {
          return children
        }
      }
    }
    return alternative;
  }
}

const mapStateToProps = state => ({
  currentUser: state.profile.user,
});

export default connect(mapStateToProps)(SignedIn);