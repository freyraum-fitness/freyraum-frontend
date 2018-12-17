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
import Menu from '@material-ui/icons/Menu';
import './style.less';

class LogoAppBar extends Component {

  menuButton = () => <IconButton className='menu' color='inherit'>
    <Menu/>
  </IconButton>;

  backButton = () => this.props.withBackButton
    ? <IconButton className='back-button' color='inherit' onClick={this.props.history.goBack}>
        <ArrowBack/>
      </IconButton>
    : undefined;

  logo = () => <span className='title-logo'>
    <img src='/logo.png' width={36}/>
  </span>;

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
    return (
      <AppBar className='fullscreen-appbar' position='sticky'>
        <Toolbar className='fullscreen-toolbar'>
          <div className='menu-button-container'>
            {this.menuButton()}
            {this.backButton()}
          </div>
          {this.logo()}
          {this.title()}
          <div className='grow'/>
          {this.loginButton()}
        </Toolbar>
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