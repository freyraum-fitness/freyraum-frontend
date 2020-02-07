'use strict';
import React from 'react';
import compose from 'recompose/compose';
import withWidth, {isWidthDown} from '@material-ui/core/withWidth';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

class WelcomeGreetings extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.width !== this.props.width;
  }

  render() {
    const {className, width} = this.props;
    const suffix = isWidthDown('sm', width) ? 'xs' : 'md';
    const img = 'url(/welcome_' + suffix + '.jpg)';
    return (
      <section className={className} style={{backgroundColor: '#fafafa'}}>
        <Grid container spacing={0} justify='center' style={{width: '100%', margin: '0px'}}>
          <Grid item xs={12} sm={10} md={8} className='home-textarea'>
            <Typography variant='h4' gutterBottom>
              Willkommen im FreyRaum
            </Typography>
            <Typography gutterBottom>
              Funktionelles Training in familiärer Atmosphäre.
            </Typography>
            <Typography gutterBottom>
              Mit der Gründung von FreyRaum entsteht in Toppenstedt ein für die Gegend einzigartiges Konzept.
              Ein Raum, in dem vor allem der Spaß an Bewegung an erster Stelle steht und ein abwechslungsreiches
              Trainingsprogramm wartet.
              Jedes Mal anders, jedes Mal neu!
            </Typography>
            <Typography gutterBottom>
              Neben dem breiten Kursprogramm können Mitglieder auch zum eigenständigen bzw. freien Training
              vorbei kommen.
            </Typography>
          </Grid>
          <div style={{
            backgroundImage: img,
            width: '100%',
            paddingTop: width === 'xs' ? '57%' : '37%',
            backgroundSize: 'cover'
          }}/>
        </Grid>
      </section>
    )
  }
}

export default compose(
  withWidth()
)(WelcomeGreetings);
