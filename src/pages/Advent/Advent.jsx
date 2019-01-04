'use react';
import React from 'react';
import SimplePage from '../SimplePage';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {Workouts} from './Workouts';
import VideoCard from '../../components/VideoCard';
import LazyLoad from 'react-lazyload';

import './style.less';

class Advent extends React.Component {

  renderWorkout = workout => (
    <LazyLoad key={workout.title} height={300} once offset={300}>
      <Grid item xs={12} sm={6} md={3}>
        <VideoCard title={workout.title} url={workout.url}/>
      </Grid>
    </LazyLoad>
  );

  render() {
    return (
      <SimplePage>
        <Grid container spacing={16} justify='center' style={{width: '100%', margin: '0px'}}>
          <Grid item xs={12} sm={10} className='advent-textarea'>
            <Typography variant='h4' gutterBottom>
              Adventskalendar
            </Typography>
            <Typography gutterBottom>
              Hier ist noch einmal unser Adventskalendar zum Ansehen und mitmachen.
            </Typography>
          </Grid>
          {Workouts.map(this.renderWorkout)}
        </Grid>
      </SimplePage>
    );
  }
}

export default Advent;