'use react';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import connect from 'react-redux/es/connect/connect';
import {bindActionCreators} from 'redux';
import withRouter from 'react-router-dom/withRouter';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {GridButtonControl, GridInputControl, GridTextControl} from '../../components/GridFormControl';
import * as Validators from '../../components/Validation/Validators';
import {passwortForgotten, onPasswordForgottenDataChange} from '../../model/password';
import {exitLogoPage} from '../../utils/Routing';
import {ValidationGroup} from '../../components/Validation';

class ForgotPassword extends Component {

  validateForm = () => {
    const result = this.validationGroup.validate();
    return result.valid;
  };

  setValidation = ref => {
    this.validationGroup = ref;
  };

  doSendPaswordForgotten = () => {
    if (this.validateForm()) {
      const {password, actions, location, history} = this.props;
      const passwordForgottenData = {
        email: password.forgotten.data.email,
      };
      return actions.passwortForgotten(passwordForgottenData, () => exitLogoPage(location, history));
    }
  };

  render() {
    const {password, actions, history} = this.props;
    return (
      <Grid container spacing={16} justify='center'>
        <Grid item xs={12} className='login-or'>
          <Typography>
            Du bist bereits angemeldet, hast aber dein Passwort vergessen?
            Kein Problem, wir schicken dir gerne eine E-Mail, wo du dein Passwort zurücksetzen kannst.
          </Typography>
        </Grid>
        <ValidationGroup ref={this.setValidation}>
          <GridInputControl
            className='login-email'
            label='E-Mail'
            type='email'
            value={password.forgotten.data.email}
            validators={[Validators.email()]}
            onChange={(id, value) => actions.onPasswordForgottenDataChange(['email'], value)}/>
        </ValidationGroup>
        {
          password.forgotten.error
            ? <GridTextControl text={password.forgotten.error} error={true}/>
            : undefined
        }
        <GridButtonControl
          className='login-login-button'
          color='inherit'
          variant='outlined'
          pending={password.forgotten.pending}
          label='Passwort zurücksetzen'
          onClick={this.doSendPaswordForgotten}/>
        <GridButtonControl
          className='login-login-button'
          color='inherit'
          variant='text'
          size='small'
          label='abbrechen'
          onClick={history.goBack}/>
      </Grid>
    )
  }
}

const mapStateToProps = state => ({
  password: state.password
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    passwortForgotten: passwortForgotten,
    onPasswordForgottenDataChange: onPasswordForgottenDataChange,
  }, dispatch),
  dispatch
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(ForgotPassword);