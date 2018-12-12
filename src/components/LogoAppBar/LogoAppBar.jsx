'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import connect from 'react-redux/es/connect/connect';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowBack from '@material-ui/icons/ArrowBack';
import ExitToApp from '@material-ui/icons/ExitToApp';
import './style.less';

class LogoAppBar extends Component {

  menuButton = () =>
      <IconButton className='menu'>
      <img src='/logo.png' width={42} />
      </IconButton>;

  backButton = () => this.props.withBackButton
    ? <IconButton className='back-button' color='inherit' onClick={this.props.history.goBack}>
        <ArrowBack/>
      </IconButton>
    : undefined;

  title = () =>
    <Typography type='title' color='inherit' className='title'>
      <span className='frey'>FREY</span>
      <span className='raum'>RAUM</span>
    </Typography>;

  loginButton = () => !this.props.currentUser
    ? <Button className='login-button' color='inherit'>
        login
      </Button>
    : <IconButton className='login-button' color='inherit'>
        <ExitToApp/>
      </IconButton>;

  render() {
    const {children} = this.props;
    return (
      <AppBar className='fullscreen-appbar' style={{position: 'absolute'}}>
        <Toolbar className='fullscreen-toolbar'>
          <div className='menu-button-container'>
            {this.menuButton()}
            {this.backButton()}
          </div>
          {this.title()}
          <div className='grow'/>
          {this.loginButton()}
        </Toolbar>
        {children}
      </AppBar>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.profile.user
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    // no actions needed so far
  }, dispatch),
  dispatch
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(LogoAppBar);