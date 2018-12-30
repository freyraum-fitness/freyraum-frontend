'use strict';
import React, {Component} from 'react';
import connect from 'react-redux/es/connect/connect';

class OnlyIf extends Component {

  render() {
    const {isTrue, children} = this.props;
    if (isTrue) {
      return children;
    }
    return null;
  }
}

export default OnlyIf;