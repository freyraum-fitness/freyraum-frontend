'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import connect from 'react-redux/es/connect/connect';
import {bindActionCreators} from 'redux';
import Redirect from 'react-router-dom/Redirect';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import withRouter from 'react-router-dom/withRouter';
import {CSSTransition as OriginalCSSTransition, TransitionGroup} from 'react-transition-group';
import Home from './pages/Home';
import ErrorPage from './pages/ErrorPage';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Statistics from './pages/Statistics';
import Profile from './pages/Profile';
import CoursesPlan from './pages/CoursesPlan';
import Settings from './pages/Settings';
import AccountPage from './pages/AccountPage';
import About from './pages/About';
import Agb from './pages/Agb';
import Advent from './pages/Advent';
import Impressum from './pages/Impressum';
import Memberships from './pages/Memberships';
import MembershipDetails from './pages/MembershipDetails';
import NewsDetails from './pages/NewsDetails';
import init from './model/init.js';
import {hideNotification} from './model/notification';
import CustomizedSnackbar from './components/CustomizedSnackbar';
import {viewPath} from "./utils/RamdaUtils";
import LoadingIndicator from "./components/LoadingIndicator";

const mapStateToProps = state => ({
  currentUser: state.profile.user,
  profilePending: state.profile.pending,
  notification: state.notification
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    hideNotification: hideNotification
  }, dispatch),
  dispatch
});


class CSSTransition extends OriginalCSSTransition {
  onEntered = () => {
    // Do not remove enter classes when active
  }
}

class _PrivateRoute extends Component {

  isAuthorized = () => {
    const {currentUser, hasAnyRole} = this.props;
    if (!currentUser) {
      return false;
    }

    if (!!hasAnyRole) {
      const roles = viewPath(['roles'], currentUser) || {};
      for (const role of hasAnyRole) {
        if (roles[role]) {
          return true;
        }
      }
      return false;
    }

    return true;
  };

  render() {
    const {component: Component, currentUser, ...rest} = this.props;
    return (
      <Route
        {...rest}
        render={props => {
          if (!currentUser) {
            return <Redirect
              to={{
                pathname: 'home/m/login',
                state: {from: props.location}
              }}
            />;
          }

          if (this.isAuthorized()) {
            return <Component {...props}/>;
          } else {
            return <Redirect
              to={{
                pathname: 'error/401',
                state: {from: props.location}
              }}
            />;
          }
        }}/>
    );
  }
}
const PrivateRoute = connect(mapStateToProps)(_PrivateRoute);

const reduceMatching = (pathname, matchPath) => {
  const idx = pathname.indexOf(matchPath);
  return idx !== -1 ? pathname.substring(0, idx + matchPath.length) : undefined;
};

const reducePath = pathname =>
  reduceMatching(pathname, '/m/')
    || reduceMatching(pathname, '/course/')
    || reduceMatching(pathname, '/news/')
    || reduceMatching(pathname, '/membership/');

const PREFIX = '@@scroll/';

class App extends Component {

  static locationVisited = {};

  constructor(props) {
    super(props);
    const {dispatch} = props;
    init(dispatch);
  };

  componentDidMount() {
    history.scrollRestoration = 'manual';
    window.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount() {
    history.scrollRestoration = 'auto';
    window.removeEventListener('scroll', this.onScroll);
  }

  componentWillReceiveProps(nextProps) {
    const {location, history: {action}} = nextProps;
    if (location !== this.props.location) {
      if (action === 'PUSH') {
        // new navigation - scroll to top
        this.scrollTo(0);
      } else {
        const pathname = App.getLocationPathname(location.pathname);
        if (App.locationVisited.hasOwnProperty(pathname)) {
          const scrollY = App.locationVisited[pathname];
          this.scrollTo(scrollY);
        }
      }
    }
  }

  static getLocationPathname(pathname) {
    return PREFIX + (pathname || '');
  }

  onScroll = () => {
    requestAnimationFrame(() => {
      App.locationVisited[App.getLocationPathname(this.props.location.pathname)] = window.scrollY;
    });
  };

  scrollTo = y => {
    requestAnimationFrame(() => {
      window.scrollTo(0, y);
    });
  };

  render() {
    if (this.props.profilePending && !this.props.currentUser) {
      return <div style={{height: '100vh'}}><LoadingIndicator/></div>;
    }
    const {notification, actions, location} = this.props;

    return (
      <div>
        <TransitionGroup>
          <CSSTransition
            timeout={850}
            classNames='animation'
            key={reducePath(location.pathname)}
            mountOnEnter
            unmountOnExit
          >
            <Switch location={location}>
              <Redirect from='/index' to='/home'/>
              <Redirect exact from='/' to='/home'/>

              {/* app pages */}
              <Route exact path='/home' component={Home}/>
              <PrivateRoute hasAnyRole={['USER', 'TRAINER']} exact path='/statistics' component={Statistics}/>
              <PrivateRoute hasAnyRole={['USER', 'TRAINER']} exact path='/courses'    component={Courses}/>
              <PrivateRoute hasAnyRole={['USER', 'TRAINER']} exact path='/profile'    component={Profile}/>
              <PrivateRoute hasAnyRole={['USER', 'TRAINER']} exact path='/settings'   component={Settings}/>
              <Route exact path='/courses-plan' component={CoursesPlan}/>
              <Route exact path='/about' component={About}/>
              <Route exact path='/agb' component={Agb}/>
              <Route exact path='/advent' component={Advent}/>
              <Route exact path='/impressum' component={Impressum}/>
              <PrivateRoute hasAnyRole={['ADMIN']} exact path='/memberships' component={Memberships}/>

              {/* modals */}
              <Route path='**/m/' component={AccountPage}/>
              <PrivateRoute hasAnyRole={['USER', 'TRAINER', 'ADMIN']} path='**/course/:id' component={CourseDetails}/>
              <Route path='**/news/:id' component={NewsDetails}/>
              <PrivateRoute hasAnyRole={['USER', 'TRAINER', 'ADMIN']} path='**/membership/:id' component={MembershipDetails}/>

              {/* error handling */}
              <Route path='/error/:errorCode' component={ErrorPage}/>
              {/* redirect everything to error/404 */}
              <Redirect to='/error/404' component={ErrorPage}/>

            </Switch>
          </CSSTransition>
        </TransitionGroup>

        <CustomizedSnackbar
          open={notification.show}
          variant={notification.variant}
          message={notification.message}
          onClose={actions.hideNotification}
          autoHideDuration={notification.autoHideDuration}/>
      </div>
    )
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(App);
