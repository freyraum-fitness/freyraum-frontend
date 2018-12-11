'use react';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import connect from 'react-redux/es/connect/connect';
import {bindActionCreators} from 'redux';
import withRouter from 'react-router-dom/withRouter';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {ValidationGroup, Validators} from './../../components/Validation';
import {GridButtonControl, GridInputControl, GridPasswordControl} from './../../components/GridFormControl';
import {login, loginDataChanged} from '../../model/login';
import {toLogoPage, exitLogoPage} from '../../utils/Routing';
import './style.less';

class Login extends Component {

  validateForm = () => {
    const result = this.validationGroup.validate();
    return result.valid;
  };

  setValidation = ref => {
    this.validationGroup = ref;
  };

  doLogin = () => {
    if (this.validateForm()) {
      const {login, actions, location, history} = this.props;
      const loginData = {
        email: login.data.email,
        password: login.data.password
      };
      return actions.login(loginData, () => exitLogoPage(location, history));
    }
  };

  render() {
    const {login, actions, location, history} = this.props;
    const formData = login.data;
    return (
      <Grid container spacing={16} justify='center'>
        <ValidationGroup ref={this.setValidation}>
          <GridInputControl
            className='login-email'
            label='E-Mail'
            type='email'
            value={formData.email}
            validators={[Validators.email()]}
            onChange={(id, value) => actions.loginDataChanged('email', value)}/>
          <GridPasswordControl
            className='login-password'
            label='Password'
            value={formData.password}
            onChange={(id, value) => actions.loginDataChanged('password', value)}/>
          <GridButtonControl
            className='login-login-button'
            color='inherit'
            variant='outlined'
            pending={login.pending}
            label='anmelden'
            onClick={this.doLogin}/>
          <GridButtonControl
            className='login-forgot-password'
            color='inherit'
            variant='text'
            size='small'
            disabled={login.pending}
            label='Passwort vergessen?'
            onClick={() => toLogoPage(location, history, '/password/forgotten')}/>
          <Grid item xs={12} className='login-or'>
            <Typography>
              Du hast noch kein Konto und möchtest dich gerne zu den Sportkursen online anmelden?
              Dann erstelle hier ganz einfach deinen eigenen Account:
            </Typography>
          </Grid>
          <GridButtonControl
            className='login-register-button'
            color='inherit'
            variant='text'
            size='small'
            disabled={login.pending}
            label='neues Konto erstellen'
            onClick={() => toLogoPage(location, history, '/account/register')}/>
        </ValidationGroup>
      </Grid>
    );
  }
}


const mapStateToProps = state => ({
  login: state.login
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    login: login,
    loginDataChanged: loginDataChanged
  }, dispatch),
  dispatch
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Login);
