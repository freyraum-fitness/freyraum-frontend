'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import {withRouter} from 'react-router-dom';
import IconHome from '@material-ui/icons/Home';
import IconLineChart from '@material-ui/icons/ShowChart';
import IconCalendar from '@material-ui/icons/DateRange';
import IconUser from '@material-ui/icons/Person';
import IconSettings from '@material-ui/icons/Settings';
import withStyles from '@material-ui/core/styles/withStyles';
import style from './style.js';

const routes = [
  '/home',
  '/statistics',
  '/courses',
  '/profile',
  '/settings',
];

class PageFooterNavigation extends Component {

  handleChange = (event, value) => {
    const {history, location} = this.props;
    let route;
    if (value < routes.length) {
      route = routes[value];
    }
    if (route !== location.pathname) {
      history.push(route);
    }
  };

  fromRoute() {
    const {location} = this.props;
    for (let i = 0; i < routes.length; i++) {
      if (routes[i] === location.pathname) {
        return i;
      }
    }
    return undefined;
  }

  render() {
    const {classes} = this.props;
    const value = this.fromRoute();
    return (
      <BottomNavigation
        value={value}
        onChange={this.handleChange}
        showLabels={true}
        className={classes.bottomNavigation}>
        <BottomNavigationAction className={classes.navIcon} label="Home" icon={<IconHome size={24}/>}/>
        <BottomNavigationAction className={classes.navIcon} label="Statsistik" icon={<IconLineChart size={24}/>}/>
        <BottomNavigationAction className={classes.navIcon} label="Kurse" icon={<IconCalendar size={24}/>}/>
        <BottomNavigationAction className={classes.navIcon} label="Profil" icon={<IconUser size={24}/>}/>
        <BottomNavigationAction className={classes.navIcon} label="Settings" icon={<IconSettings size={24}/>}/>
      </BottomNavigation>
    );
  }
}

export default compose(
  withStyles(style),
  withRouter
)(PageFooterNavigation);