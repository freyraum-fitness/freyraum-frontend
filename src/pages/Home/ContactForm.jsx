'use strict';
import React from 'react';
import compose from 'recompose/compose';
import {withRouter} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {NotSignedIn, SignedIn} from '../../components/Auth';
import {toLogoPage} from '../../utils/Routing';

class ContactForm extends React.Component {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const {className, history} = this.props;
    return (
      <section className={className} style={{backgroundColor: '#f0f0f0'}}>
        <Grid container spacing={0} justify='center' style={{width: '100%', margin: '0px'}}>
          <Grid item container xs={12} sm={10} md={8} className='home-textarea' justify='center'>
            <Grid item xs={12}>
              <SignedIn>
                <Typography align='center'>
                  Du hast Anregungen oder Fragen?
                </Typography>
              </SignedIn>
              <NotSignedIn>
                <Typography align='center'>
                  Lust auf ein Probetraining?
                </Typography>
              </NotSignedIn>
              <Button fullWidth color='primary' onClick={() => toLogoPage(location, history, '/contact')}>
                Kontaktformular
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </section>
    )
  }
}

export default compose(
  withRouter
)(ContactForm);