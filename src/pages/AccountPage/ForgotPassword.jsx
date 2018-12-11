'use react';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import withRouter from 'react-router-dom/withRouter';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

class ForgotPassword extends Component {
  render() {
    const {history} = this.props;
    return (
      <Grid container spacing={16} justify='center'>
        <Grid item xs={12} className='login-or'>
          <Typography gutterBottom>
            Du bist bereits angemeldet, hast aber dein Passwort vergessen?
            Kein Problem, wir schicken dir gerne eine E-Mail, wo du dein Passwort zurücksetzen kannst.
          </Typography>
        </Grid>
        <Grid item xs={12} className='login-email'>
          <TextField label='E-Mail' fullWidth/>
        </Grid>
        <Grid item xs={12} className='login-login-button'>
          <Button fullWidth variant='outlined' color='inherit'>
            Passwort zurücksetzen
          </Button>
        </Grid>
        <Grid item xs={12} className='login-forgot-password'>
          <Button fullWidth variant='text' size='small' color='inherit'
                  onClick={history.goBack}>
            abbrechen
          </Button>
        </Grid>
      </Grid>
    )
  }
}

export default compose(
  withRouter
)(ForgotPassword);