'use react';
import React from 'react';
import compose from 'recompose/compose';
import connect from 'react-redux/es/connect/connect';
import {bindActionCreators} from 'redux';
import withRouter from 'react-router-dom/withRouter';
import Link from 'react-router-dom/Link';
import Grid from '@material-ui/core/Grid';
import {
  GridButtonControl,
  GridCheckboxControl,
  GridInputControl,
  GridPasswordControl,
  GridTextControl
} from '../../components/GridFormControl';
import {ValidationGroup} from '../../components/Validation';
import {createAccount, createAccountDataChanged} from '../../model/profile';
import {exitLogoPage} from "../../utils/Routing";
import * as Validators from "../../components/Validation/Validators";

class Register extends React.Component {

  validateForm = () => {
    const result = this.validationGroup.validate();
    return result.valid;
  };

  setValidation = ref => {
    this.validationGroup = ref;
  };

  doCreateAccount = () => {
    if (this.validateForm()) {
      const {profile, actions, location, history} = this.props;
      const data = profile.createAccount.data;
      const createAccountData = {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
        matchingPassword: data.matchingPassword
      };
      return actions.createAccount(createAccountData, () => exitLogoPage(location, history));
    }
  };

  render() {
    const {profile, actions, history} = this.props;
    const {createAccount} = profile;
    return (
      <Grid container spacing={16} justify='flex-start'>
        <ValidationGroup ref={this.setValidation}>
          <GridInputControl
            id='firstname'
            xs={6}
            className='register-firstname'
            label='Vorname'
            required
            value={createAccount.data.firstname}
            validators={[Validators.notEmpty()]}
            onChange={(id, value) => actions.createAccountDataChanged(id, value)}/>
          <GridInputControl
            id='lastname'
            xs={6}
            className='register-lastname'
            label='Nachname'
            required
            value={createAccount.data.lastname}
            validators={[Validators.notEmpty()]}
            onChange={(id, value) => actions.createAccountDataChanged(id, value)}/>
          <GridInputControl
            id='email'
            className='login-email'
            label='E-Mail'
            type='email'
            required
            value={createAccount.data.email}
            validators={[Validators.email()]}
            onChange={(id, value) => actions.createAccountDataChanged(id, value)}/>
          <GridPasswordControl
            id='password'
            className='change-password-old'
            label='Password'
            required
            value={createAccount.data.password}
            validators={[Validators.minLength(8)]}
            onChange={(id, value) => actions.createAccountDataChanged(id, value)}/>
          <GridPasswordControl
            id='matchingPassword'
            className='change-password-confirm'
            label='Password bestätigen'
            required
            value={createAccount.data.matchingPassword}
            validators={[Validators.matches(createAccount.data.password, 'Die Passwörter stimmen nicht überein')]}
            onChange={(id, value) => actions.createAccountDataChanged(id, value)}/>
          <GridCheckboxControl
            id='acceptAgb'
            className='register-accept-agb'
            value={createAccount.data.acceptAgb}
            validators={[Validators.cheked('Bitte die AGBs akzeptieren')]}
            label={<span>Ich habe die <Link to='/agb'>AGB</Link> gelesen und stimme zu</span>}
            onChange={(id, value) => actions.createAccountDataChanged(id, value)}/>
        </ValidationGroup>
        {
          profile.createAccount.error
            ? <GridTextControl text={profile.createAccount.error} error={true}/>
            : undefined
        }
        <GridButtonControl
          className='register-button'
          color='inherit'
          variant='outlined'
          pending={profile.createAccount.pending}
          label='Konto erstellen'
          onClick={this.doCreateAccount}/>
        <GridButtonControl
          className='register-back-button'
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
  profile: state.profile
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    createAccount: createAccount,
    createAccountDataChanged: createAccountDataChanged,
  }, dispatch),
  dispatch
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Register);