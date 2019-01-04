'use strict';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Instagram from 'mdi-material-ui/Instagram';
import Facebook from 'mdi-material-ui/Facebook';
import Youtube from 'mdi-material-ui/Youtube';
import {PRIMARY} from '../../theme';

class SocialMedia extends React.Component {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const {className} = this.props;
    return (
      <section className={className} style={{backgroundColor: '#fafafa'}}>
        <Grid container spacing={0} justify='center' style={{width: '100%', margin: '0px'}}>
          <Grid item container xs={12} sm={10} md={8} className='home-textarea' justify='center'>
            <Grid item xs={12}>
              <Typography align='center'>
                mehr von FreyRaum im Netz
              </Typography>
            </Grid>

            <Grid item>
              <Tooltip title='follow us on Instagram' placement='top'>
                <a target='_blank' href='https://www.instagram.com/freyraum.fitness/'>
                  <IconButton style={{color: PRIMARY}}>
                    <Instagram/>
                  </IconButton>
                </a>
              </Tooltip>

              <Tooltip title='find us on facebook' placement='top'>
                <a target='_blank' href='https://www.facebook.com/freyraum.fitness/'>
                  <IconButton style={{color: PRIMARY}}>
                    <Facebook/>
                  </IconButton>
                </a>
              </Tooltip>

              <Tooltip title='YouTube' placement='top'>
                <a target='_blank' href='https://www.youtube.com/channel/UCPudg12FsBXS6xD-b-YVp6A/videos'>
                  <IconButton style={{color: PRIMARY}}>
                    <Youtube/>
                  </IconButton>
                </a>
              </Tooltip>
            </Grid>

            <Grid item xs={12}>
              <a href='mailto:freyraum@freya.fitness' style={{textDecoration: 'none'}}>
                <Typography variant='caption' align='center'>
                  freyraum@freya.fitness
                </Typography>
              </a>
            </Grid>
          </Grid>
        </Grid>
      </section>
    )
  }
}

export default SocialMedia;