'use react';
import React from 'react';
import compose from 'recompose/compose';
import {withRouter} from 'react-router-dom';
import withWidth from '@material-ui/core/withWidth';
import SimplePage from '../SimplePage';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import './style.less';

const getError = errorCode => {
  switch (errorCode) {
    case '404':
      return {
        title: 'Ooops!',
        message: 'Die von Dir angeforderte Seite kennen wir leider nicht.'
      };
    case '401':
      return {
        title: 'Nope!',
        message: 'Du scheinst nicht ausreichende Berechtigungen für die angeforderte Seite zu haben.'
          + ' Bitte wende Dich an einen Administrator,'
          + ' wenn Du der Meinung bist, dass Du die Rechte benötigst.'
      };
    default:
      return {
        icon: '',
        message: 'Irgendwas ist schiefgelaufen.'
          + ' Versuche es später noch einmal oder wende Dich an einen Administrator.'
      }
  }
};

class ErrorPage extends React.Component {

  render() {
    const {match, history} = this.props;
    const errorCode = match.params.errorCode;
    const error = getError(errorCode);

    return (
      <SimplePage>
        <Grid container spacing={0} justify='center' style={{width: '100%', margin: '0px'}}>
          <Grid container item xs={12} sm={10} md={8} className='about-textarea'>
            <Grid item xs={12}>
              <Typography variant='h3' color='primary' align='center' gutterBottom>
                {error.title}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h1' color='error' align='center' gutterBottom>
                {errorCode}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography align='center' gutterBottom>
                {error.message}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography align='center' gutterBottom>
                Wie wäre es stattdessen mit ein paar Burpees?
              </Typography>
            </Grid>
            <Grid item xs={12} sm={10} md={8}>
              <Button color='primary' fullWidth onClick={() => history.push('/home')}>
                zur Startseite
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </SimplePage>
    );
  }
}

export default compose(
  withRouter,
  withWidth()
)(ErrorPage);