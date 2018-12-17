'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import connect from 'react-redux/es/connect/connect';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Menu from '@material-ui/icons/Menu';
import {openDrawer} from './../../model/drawer';
import {toLogoPage} from './../../utils/Routing';
import ConfirmButton from './../ConfirmButton';
import WeUseCookies from '../WeUseCookies';
import {logout} from '../../model/logout';
import './style.less';

class PageAppBar extends Component {

  menuButton = () => {
    const {actions} = this.props;
    return (
      <Tooltip title='Menü einblenden' enterDelay={500}>
        <IconButton color='inherit' className='menu' onClick={actions.openDrawer}>
          <Menu/>
        </IconButton>
      </Tooltip>
    );
  };

  logo = () => <span className='title-logo'>
    <img src='/logo.png' width={36}/>
  </span>;

  title = () => <Typography type='title' color='inherit' className='title'>
    <span className='frey'>FREY</span>
    <span className='raum'>RAUM</span>
  </Typography>;

  loginButton = () => {
    const {currentUser, actions, location, history} = this.props;
    if (currentUser) {
      return (
        <Tooltip title='Logout' enterDelay={500}>
          <ConfirmButton
            iconButton
            onClick={() => actions.logout(() => history.push('/'))}
            color='inherit'
            confirmTitle='Ausloggen'
            question='Möchtest Du Dich abmelden?'>
            <ExitToApp/>
          </ConfirmButton>
        </Tooltip>
      );
    }

    return (
      <Button color='inherit' onClick={() => toLogoPage(location, history, '/login')}>
        login
      </Button>
    );
  };

  render() {
    const {additionalActions, hideTitle} = this.props;
    return (
      <AppBar className='page-app-bar' position='sticky'>
        <WeUseCookies/>
        <Toolbar>
          {this.menuButton()}
          {this.logo()}
          {
            hideTitle
              ? undefined
              : this.title()
          }
          <div className='grow'/>
          {additionalActions}
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
    openDrawer: openDrawer,
    logout: logout,
  }, dispatch),
  dispatch
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(PageAppBar);