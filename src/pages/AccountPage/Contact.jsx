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
  GridInputControl
} from './../../components/GridFormControl';
import {ValidationGroup, Validators} from './../../components/Validation';
import {contactDataChanged, sendContact} from "../../model/contact";

class Contact extends Component {

  state = {
    autoFilled: false
  };

  constructor(props) {
    super(props);
    if (props.user && !this.state.autoFilled) {
      const {contactDataChanged} = props.actions;

      contactDataChanged('firstname', props.user.firstname);
      contactDataChanged('lastname', props.user.lastname);
      contactDataChanged('email', props.user.email);
    }
  }

  validateForm = () => {
    const result = this.validationGroup.validate();
    return result.valid;
  };

  setValidation = ref => {
    this.validationGroup = ref;
  };

  doSendContact = () => {
    if (this.validateForm()) {
      const {sendContact} = this.props.actions;
      const {data} = this.props.contact;
      sendContact(data);
    }
  };

  validateContact = validator => value => {
    const {data} = this.props.contact;
    const {email, telephone} = data;
    if (Validators.notEmpty()(email).valid || Validators.notEmpty()(telephone).valid) {
      if (Validators.notEmpty()(value).valid) {
        return validator(value);
      } else {
        return {valid: true, error: null};
      }
    }
    return {valid: false, error: 'Bitte entweder eine E-Mail-Adresse oder Telefonnumer angeben'};
  };

  render() {
    const {contact, actions} = this.props;
    const {contactDataChanged} = actions;
    const {data, pending, errorMessage} = contact;

    return (
      <Grid container spacing={8} justify='center'>
        <Grid item xs={12} className='contact-text'>
          <Typography>
            Du hast Lust auf ein Probetraining oder möchtest Freya eine Nachricht schreiben? Dann los:
          </Typography>
        </Grid>
        <ValidationGroup ref={this.setValidation}>
          <GridInputControl
            className='contact-firstname'
            id='firstname'
            label='Vorname'
            required
            xs={6}
            value={data.firstname}
            validators={[Validators.notEmpty('Bitte gib deinen Vornamen ein')]}
            onChange={contactDataChanged}/>
          <GridInputControl
            className='contact-lastname'
            id='lastname'
            label='Nachname'
            required
            xs={6}
            value={data.lastname}
            validators={[Validators.notEmpty('Bitte gib deinen Nachnamen ein')]}
            onChange={contactDataChanged}/>
          <GridInputControl
            className='contact-telephone'
            id='telephone'
            label='Telefon'
            xs={6}
            value={data.telephone}
            validators={[this.validateContact(Validators.telephone())]}
            onChange={contactDataChanged}/>
          <GridInputControl
            className='contact-email'
            id='email'
            label='E-Mail'
            xs={6}
            value={data.email}
            validators={[this.validateContact(Validators.email())]}
            onChange={contactDataChanged}/>
          <GridInputControl
            className='contact-subject'
            id='subject'
            label='Betreff'
            required
            value={data.subject}
            validators={[Validators.notEmpty('Bitte gib einen Betreff an')]}
            onChange={contactDataChanged}/>
          <GridInputControl
            className='contact-message'
            id='message'
            label='Nachricht'
            required
            value={data.message}
            multiline
            validators={[Validators.notEmpty('Bitte trage hier deine Nachricht ein')]}
            onChange={contactDataChanged}/>
        </ValidationGroup>
        {
          errorMessage
            ? <GridTextControl text={errorMessage} error={true}/>
            : undefined
        }
        <GridButtonControl
          className='contact-button'
          pending={pending}
          color='inherit'
          variant='outlined'
          label='absenden'
          onClick={this.doSendContact}/>
      </Grid>
    )
  }
}

const mapStateToProps = state => ({
  user: state.profile.user,
  contact: state.contact,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    // contact
    sendContact: sendContact,
    contactDataChanged: contactDataChanged,
  }, dispatch),
  dispatch
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Contact);