'use react';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import withRouter from 'react-router-dom/withRouter';
import Link from 'react-router-dom/Link';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";

class Register extends Component {
  render() {
    const {history} = this.props;
    return (
      <Grid container spacing={16} justify='flex-start'>
        <Grid item xs={6} className='login-email'>
          <TextField label='Vorname' fullWidth/>
        </Grid>
        <Grid item xs={6} className='login-email'>
          <TextField label='Nachname' fullWidth/>
        </Grid>
        <Grid item xs={12} className='login-email'>
          <TextField label='E-Mail' fullWidth/>
        </Grid>
        <Grid item xs={12} className='login-email'>
          <TextField label='Passwort' fullWidth/>
        </Grid>
        <Grid item xs={12} className='login-email'>
          <TextField label='Passwort wiederholen' fullWidth/>
        </Grid>
        <Grid item xs={12} className='login-email'>
          <Checkbox/>
          <Typography style={{display: 'inline-block'}}>
            Ich habe die <Link to='/agb'>AGB</Link> gelesen und stimme zu
          </Typography>
        </Grid>
        <Grid item xs={12} className='login-login-button'>
          <Button fullWidth variant='outlined' color='inherit'>
            Konto erstellen
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
)(Register);