'use react';
import React from 'react';
import LogoPage from '../LogoPage';
import compose from 'recompose/compose';
import withRouter from 'react-router-dom/withRouter';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Grid from '@material-ui/core/Grid';
import Login from './Login.jsx';
import DeleteAccount from './DeleteAccount.jsx';
import ChangePassword from './ChangePassword.jsx';
import ForgotPassword from './ForgotPassword.jsx';
import ResetPassword from './ResetPassword.jsx';
import Register from './Register.jsx';
import Contact from './Contact.jsx';
import './style.less';

class AccountPage extends LogoPage {

  withBackButton = () => true;

  page() {
    return (
      <div className='login-page'>
        <Grid container spacing={16} justify='center' alignItems='center'>
          <Grid item xs={4} className='login-logo'>
            <img src='/logo_white_transparent.png' width='100%'/>
          </Grid>
          <Grid item xs={12} sm={10} md={6} lg={4}>
            <Switch>
              <Route exact path='**/login' component={Login}/>
              <Route exact path='**/account/register' component={Register}/>
              <Route exact path='**/account/delete' component={DeleteAccount}/>
              <Route exact path='**/password/forgotten' component={ForgotPassword}/>
              <Route exact path='**/password/reset' component={ResetPassword}/>
              <Route exact path='**/password/change' component={ChangePassword}/>
              <Route exact path='**/contact' component={Contact}/>
            </Switch>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default compose(
  withRouter
)(AccountPage);
