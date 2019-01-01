'use react';
import React from 'react';
import SimplePage from '../SimplePage';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {Workouts} from "./Workouts";
import VideoCard from "../../components/VideoCard";
import './style.less';

class Advent extends React.Component {

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
          {Workouts.map((item, idx) => <Grid key={idx} item xs={12} sm={6} md={3}><VideoCard title={item.title} url={item.url}/></Grid>)}
        </Grid>
      </SimplePage>
    );
  }
}

export default Advent;