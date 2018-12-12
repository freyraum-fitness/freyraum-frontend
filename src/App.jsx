import React, {Component} from 'react';
import compose from 'recompose/compose';
import connect from 'react-redux/es/connect/connect';
import {bindActionCreators} from 'redux';
import {matchPath} from 'react-router';
import Redirect from 'react-router-dom/Redirect';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import withRouter from 'react-router-dom/withRouter';
import {CSSTransition as OriginalCSSTransition, TransitionGroup} from 'react-transition-group';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Statistics from './pages/Statistics';
import Profile from './pages/Profile';
import CoursesPlan from './pages/CoursesPlan';
import Settings from './pages/Settings';
import AccountPage from './pages/AccountPage';
import About from './pages/About';
import Agb from './pages/Agb';
import Impressum from './pages/Impressum';
import Memberships from './pages/Memberships';
import MembershipDetails from './pages/MembershipDetails';
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

  render() {
    const {component: Component, currentUser, ...rest} = this.props;
    return (
      <Route
        {...rest}
        render={props => !!currentUser
          ? <Component {...props}/>
          : <Redirect
              to={{
                pathname: 'home/m/login',
                state: {from: props.location}
              }}
            />
        }/>
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
    || reduceMatching(pathname, '/membership/');

class App extends Component {

  constructor(props) {
    super(props);
    const {dispatch} = props;
    init(dispatch);
  };

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    if (this.props.profilePending && !this.props.currentUser) {
      return <div style={{height: '100vh'}}><LoadingIndicator/></div>;
    }

    const {notification, actions, location} = this.props;
    const roles = viewPath(['currentUser', 'roles'], this.props) || {};
    const trainerOrAdmin = roles['TRAINER'] || roles['ADMIN'];

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
              <PrivateRoute exact path='/statistics' component={Statistics}/>
              <PrivateRoute exact path='/courses' component={Courses}/>
              <PrivateRoute exact path='/profile' component={Profile}/>
              <PrivateRoute exact path='/settings' component={Settings}/>
              <Route exact path='/courses-plan' component={CoursesPlan}/>
              <Route exact path='/about' component={About}/>
              <Route exact path='/agb' component={Agb}/>
              <Route exact path='/impressum' component={Impressum}/>
              {
                trainerOrAdmin
                  ? <PrivateRoute exact path='/memberships' component={Memberships}/>
                  : undefined
              }

              {/* modals */}
              <Route path='**/m/' component={AccountPage}/>
              <PrivateRoute path='**/course/:id' component={CourseDetails}/>
              <PrivateRoute path='**/membership/:id' component={MembershipDetails}/>

              {/* redirect everything to home */}
              <Redirect from='*' to='/home'/>
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