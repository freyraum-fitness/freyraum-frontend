'use react';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import connect from 'react-redux/es/connect/connect';
import {bindActionCreators} from 'redux';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
  GridButtonControl,
  GridTextControl,
  GridPasswordControl
} from './../../components/GridFormControl';
import {ValidationGroup, Validators} from './../../components/Validation';
import {
  changePassword,
  onChangePasswordDataChange
} from './../../model/password';
import {exitLogoPage} from './../../utils/Routing';

class ChangePassword extends Component {

  validateForm = () => {
    const result = this.validationGroup.validate();
    return result.valid;
  };

  setValidation = ref => {
    this.validationGroup = ref;
  };

  doChangePassword = () => {
    if (this.validateForm()) {
      const {password, actions} = this.props;
      return actions.changePassword(password.data, () => exitLogoPage(location, history));
    }
  };

  render() {
    const {actions} = this.props;
    const {
      pending,
      error,
      data,
    } = this.props.password.change;
    const {
      oldPassword,
      password,
      matchingPassword
    } = data;
    return (
      <Grid container spacing={8} justify='center'>
        <Grid item xs={12} className='change-password-text'>
          <Typography paragraph>
            Hier kannst Du Dir ein neues Passwort vergeben.
          </Typography>
          <Typography paragraph>
            Dein neues Password muss mindestens 8 Zeichen lang sein und sollte regelmäßig von Dir geändert werden.
          </Typography>
        </Grid>
        <ValidationGroup ref={this.setValidation}>
          <GridPasswordControl
            className='change-password-old'
            label='Aktuelles Password'
            value={oldPassword}
            onChange={(id, value) => actions.onChangePasswordDataChange(['oldPassword'], value)}/>
          <GridPasswordControl
            className='change-password-new'
            label='Neues Password'
            value={password}
            validators={[Validators.minLength(8)]}
            onChange={(id, value) => actions.onChangePasswordDataChange(['password'], value)}/>
          <GridPasswordControl
            className='change-password-confirm'
            label='Neues Password bestätigen'
            value={matchingPassword}
            validators={[Validators.matches(password, 'Das neue Password stimmt nicht überein.')]}
            onChange={(id, value) => actions.onChangePasswordDataChange(['matchingPassword'], value)}/>
        </ValidationGroup>
        {
          error
            ? <GridTextControl text={error} error={true}/>
            : undefined
        }
        <GridButtonControl
          className='change-password-button'
          pending={pending}
          color='inherit'
          variant='outlined'
          label='Passwort ändern'
          onClick={this.doChangePassword}/>
      </Grid>
    )
  }
}

const mapStateToProps = state => ({
  user: state.profile.user,
  password: state.password
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    // password
    changePassword: changePassword,
    onChangePasswordDataChange: onChangePasswordDataChange
  }, dispatch),
  dispatch
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ChangePassword);