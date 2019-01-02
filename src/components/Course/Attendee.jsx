'use strict';
import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import {TITLE_BG} from '../../theme';
import {ProfilePicture} from '../profile';
import Typography from '@material-ui/core/Typography';

class Attendee extends Component {

  render() {
    const {idx, user, onWaitlist, onClick} = this.props;
    return (
      <Grid
        item xs={3} sm={2}
        className='attendee'
        style={{
          transition: '-webkit-transform 650ms cubic-bezier(0.23, 1, 0.32, 1)' + (500 + idx * 50) + 'ms, opacity 850ms cubic-bezier(0.23, 1, 0.32, 1) ' + (500 + idx * 50) + 'ms'
        }}
        onClick={onClick}>
        <Avatar className='attendee_avatar' style={{backgroundColor: TITLE_BG}}>
          <ProfilePicture user={user} asAvatar/>
        </Avatar>
        <Typography
          variant='caption'
          gutterBottom
          align='center'>
          {user.firstname + ' ' + user.lastname}
        </Typography>
        {
          onWaitlist
            ? <Typography
              variant='caption'
              style={{color: 'rgba(255, 165, 0, 1)'}}
              gutterBottom
              align='center'>
              (Warteliste)
            </Typography>
            : undefined
        }
      </Grid>
    );
  }

}

export default Attendee;