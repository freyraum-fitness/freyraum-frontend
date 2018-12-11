'use strict';
import React, {Component} from 'react';
import connect from 'react-redux/es/connect/connect';

class SignedIn extends Component {

  render() {
    const {currentUser, children} = this.props;
    if (currentUser) {
      return null;
    }
    return children;
  }
}

const mapStateToProps = state => ({
  currentUser: state.profile.user,
});

export default connect(mapStateToProps)(SignedIn);