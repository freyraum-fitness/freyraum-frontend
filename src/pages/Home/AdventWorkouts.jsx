'use strict';
import React from 'react';
import compose from 'recompose/compose';
import {withRouter} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

class AdventWorkouts extends React.Component {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const {className, history} = this.props;
    return (
      <section className={className}>
        <div className='title-h-scroll'>
          <Typography variant='subtitle1' color='primary'>
            Adventskalender
          </Typography>
        </div>
        <Grid container spacing={0} justify='center' style={{width: '100%', margin: '0px'}}>
          <Grid item container xs={12} sm={10} md={8} className='home-textarea' justify='center'>
            <Grid item xs={12}>
              <Typography>
                Alle Workouts aus unserem Adventskalendar kannst du dir noch einmal ansehen und natürlich mitmachen.
              </Typography>
            </Grid>
          </Grid>
          <Grid item container xs={12} sm={10} md={8} justify='center'>
            <Button color='primary' onClick={() => history.push('/advent')}>
              🎄 Hier geht es zum Adventskalendar 🎄
            </Button>
          </Grid>
        </Grid>
      </section>
    )
  }
}

export default compose(
  withRouter
)(AdventWorkouts);