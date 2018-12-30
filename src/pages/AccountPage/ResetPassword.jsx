'use react';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import connect from 'react-redux/es/connect/connect';
import {bindActionCreators} from 'redux';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {toLogoPage} from "../../utils/Routing";
import {ValidationGroup} from "../../components/Validation";
import {GridButtonControl, GridPasswordControl, GridTextControl} from "../../components/GridFormControl";
import * as Validators from "../../components/Validation/Validators";
import {onResetPasswordDataChange, resetPassword} from "../../model/password";

class ResetPassword extends Component {

  validateForm = () => {
    const result = this.validationGroup.validate();
    return result.valid;
  };

  setValidation = ref => {
    this.validationGroup = ref;
  };

  doSendResetPasword = () => {
    if (this.validateForm()) {
      const {password, actions, location, history, match} = this.props;
      const passwordResetData = {
        password: password.reset.data.password,
        token: match.params.resetPasswordToken,
      };
      return actions.resetPassword(passwordResetData, () => toLogoPage(location, history, '/login'));
    }
  };

  render() {
    const {actions} = this.props;
    const {
      pending,
      error,
      data,
    } = this.props.password.reset;
    const {
      password,
      matchingPassword
    } = data;
    return (
      <Grid container spacing={8} justify='center'>
        <Grid item xs={12} className='login-or'>
          <Typography>
            Hier kannst du dir ein neues Passwort vergeben.
          </Typography>
        </Grid>
        <ValidationGroup ref={this.setValidation}>
          <GridPasswordControl
            className='reset-password-new'
            label='Neues Password'
            value={password}
            validators={[Validators.minLength(8)]}
            onChange={(id, value) => actions.onResetPasswordDataChange(['password'], value)}/>
          <GridPasswordControl
            className='reset-password-confirm'
            label='Neues Password bestätigen'
            value={matchingPassword}
            validators={[Validators.matches(password, 'Das neue Password stimmt nicht überein.')]}
            onChange={(id, value) => actions.onResetPasswordDataChange(['matchingPassword'], value)}/>
        </ValidationGroup>
        {
          error
            ? <GridTextControl text={error} error={true}/>
            : undefined
        }
        <GridButtonControl
          className='reset-password-button'
          pending={pending}
          color='inherit'
          variant='outlined'
          label='Passwort zurücksetzen'
          onClick={this.doSendResetPasword}/>
      </Grid>
    )
  }
}

const mapStateToProps = state => ({
  password: state.password,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    // password
    resetPassword: resetPassword,
    onResetPasswordDataChange: onResetPasswordDataChange
  }, dispatch),
  dispatch
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ResetPassword);