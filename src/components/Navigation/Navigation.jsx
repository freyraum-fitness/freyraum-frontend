'use strict';
import React from 'react';
import compose from 'recompose/compose';
import {withRouter} from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';

class _NavIconButton extends React.Component {

  render() {
    const {to, history, children, color} = this.props;
    return <IconButton onClick={() => history.push(to)} color={color}>
      {children}
    </IconButton>;
  }

}

export const NavIconButton = compose(withRouter)(_NavIconButton);