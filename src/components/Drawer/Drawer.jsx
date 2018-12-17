'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import connect from 'react-redux/es/connect/connect';
import {bindActionCreators} from 'redux';
import withRouter from 'react-router-dom/withRouter';
import {withStyles} from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconHome from '@material-ui/icons/Home';
import IconLineChart from '@material-ui/icons/ShowChart';
import IconCalendar from '@material-ui/icons/DateRange';
import IconUser from '@material-ui/icons/Person';
import IconUserGroup from '@material-ui/icons/Group';
import IconSettings from '@material-ui/icons/Settings';
import IconInfo from '@material-ui/icons/Info';
import IconDocument from '@material-ui/icons/Assignment';
import IconSignIn from '@material-ui/icons/LockOpen';
import IconSignOut from '@material-ui/icons/ExitToApp';
import IconContact from '@material-ui/icons/ContactMail';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import MenuLink from './MenuLink';
import {closeDrawer, openDrawer} from '../../model/drawer';
import {logout} from '../../model/logout';
import {SignedIn, NotSignedIn} from '../Auth';
import {toLogoPage} from './../../utils/Routing';

const styles = theme => ({
  drawerPaper: {
    width: 260
  },
  drawer: {
    height: '100%',
    background: '#fafafa url("/logo_white_transparent.png") no-repeat',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }
});

class Drawer extends Component {
  
  drawerContent = () => {
    const {classes, actions, location, history} = this.props;
    const {closeDrawer, logout} = actions;
    return (
      <div className={classes.drawer}>
        <div className={classes.drawerHeader}>
          <IconButton onClick={closeDrawer}>
            <ChevronLeftIcon/>
          </IconButton>
        </div>
        <Divider/>
        <List>
          <MenuLink to='/' label='Home' icon={<IconHome/>} onClick={closeDrawer}/>
          <SignedIn>
          <MenuLink to='/statistics' label='Statistiken und PR' icon={<IconLineChart/>} onClick={closeDrawer}/>
          <MenuLink to='/courses' label='Alle Kurse' icon={<IconCalendar/>} onClick={closeDrawer}/>
          <SignedIn hasAnyRole={['TRAINER', 'ADMIN']}>
            <MenuLink to='/memberships' label='Mitgliedschaften' icon={<IconUserGroup/>} onClick={closeDrawer}/>
          </SignedIn>
          <MenuLink to='/profile' label='Profil' icon={<IconUser/>} onClick={closeDrawer}/>
          <MenuLink to='/settings' label='Einstellungen' icon={<IconSettings/>} onClick={closeDrawer}/>
          </SignedIn>
        </List>
        <Divider/>
        <List>
          <MenuLink to='/about' label='Über Freya + FreyRaum' icon={<IconInfo/>} onClick={closeDrawer}/>
          <MenuLink to='/courses-plan' label='Kurse im FreyRaum' icon={<IconCalendar/>} onClick={closeDrawer}/>
          <MenuLink to='/agb' label='AGB' icon={<IconDocument/>} onClick={closeDrawer}/>
          <MenuLink to='/impressum' label='Impressum' icon={<IconInfo/>} onClick={closeDrawer}/>
        </List>
        <Divider/>
        <List>
          <ListItem button onClick={() => {toLogoPage(location, history, '/contact'); closeDrawer()}}>
            <ListItemIcon>
              <IconContact/>
            </ListItemIcon>
            <ListItemText primary='Kontakt'/>
          </ListItem>
          <SignedIn>
            <MenuLink to='/' label='Logout' icon={<IconSignOut/>} onClick={() => {
              closeDrawer();
              logout(() => history.push('/'))
            }}/>
          </SignedIn>
          <NotSignedIn>
            <ListItem button onClick={() => {toLogoPage(location, history, '/login'); closeDrawer()}}>
              <ListItemIcon>
                <IconSignIn/>
              </ListItemIcon>
              <ListItemText primary='Login'/>
            </ListItem>
          </NotSignedIn>
        </List>
        {/* space to enable login/logout link on small devices (bug on ios) */}
        <div className='placeholder'/>
      </div>
    );
  };

  render() {
    const {classes, drawer, actions} = this.props;
    const {openDrawer, closeDrawer} = actions;

    return (
      <nav>
        <SwipeableDrawer
          variant='temporary'
          anchor='left'
          open={drawer.open}
          onOpen={openDrawer}
          onClose={closeDrawer}
          classes={{paper: classes.drawerPaper}}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}>
          {this.drawerContent()}
        </SwipeableDrawer>
      </nav>
    );
  }
}

const mapStateToProps = state => ({
  drawer: state.drawer,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    openDrawer: openDrawer,
    closeDrawer: closeDrawer,
    logout: logout,
  }, dispatch),
  dispatch
});

export default compose(
  withRouter,
  withStyles(styles, {withTheme: true}),
  connect(mapStateToProps, mapDispatchToProps)
)(Drawer);