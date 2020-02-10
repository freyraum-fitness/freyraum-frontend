'use react';
import React from 'react';
import SimplePage from '../SimplePage';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import withWidth, {isWidthDown} from '@material-ui/core/withWidth';
import './style.less';

class About extends React.Component {

  render() {
    const {width} = this.props;
    const suffix = isWidthDown('sm', width) ? 'xs' : 'md';

    const img = 'url(/about_freya_' + suffix + '.jpg)';
    return (
      <SimplePage>
        <Grid container spacing={0} justify='center' style={{width: '100%', margin: '0px'}}>
          <Grid item xs={12} sm={10} md={8} className='about-textarea'>
            <Typography variant='h4' gutterBottom>
              Hallo, das bin ich
            </Typography>
            <Typography gutterBottom>
              Mein Name ist Freya Heine und ich verwirkliche mit der Eröffnung von FreyRaum meinen ganz persönlichen
              Traum vom eigenen, sehr persönlichen Studio in Toppenstedt.
            </Typography>
            <Typography gutterBottom>
              Durch mein Studium zur Fitnessökonomin mit Weiterbildungen im medizinischen Fitnesstraining, TRX
              Training, Functional Training und mehreren Jahren Berufserfahrung, in verschiedenen Fitnessstudios,
              ist
              es 2018 Zeit an der Zeit mein eigenes Kapitel zu beginnen.
            </Typography>
            <Typography gutterBottom>
              Meine Leidenschaft zum Sport, als auch die Freude dabei, Euch sportlich nach vorne zu bringen, lassen
              mein Herz höherschlagen.
            </Typography>
          </Grid>
        </Grid>

        <div style={{
          backgroundImage: img,
          width: '100%',
          paddingTop: '37%',
          backgroundSize: 'cover'
        }}/>

        <Grid container spacing={0} justify="center" style={{width: '100%', margin: '0px'}}>
          <Grid item xs={12} sm={10} md={8} className='about-textarea'>
            <Typography variant='h4' gutterBottom>
              Wo ist der FreyRaum?
            </Typography>

            <Typography gutterBottom>
              FreyRaum findest du in der Tangendorfer Straße 2a in 21442 Toppenstedt. Ein Großteil der Kurse findet
              seit August 2018 im ehemaligen „Blumenstübchen“ von Toppenstedt statt.
              Parkplätze sind direkt vor der Tür vorhanden.
            </Typography>
            <Typography gutterBottom>
              Während der Sommersaison kann es vereinzelt vorkommen, dass Kurse in „die Scheune“ verlegt werden.
              Diese
              befindet sich in der Hauptstraße 15 und war bis vor kurzem noch unser Hauptquartier.
            </Typography>
          </Grid>
        </Grid>
      </SimplePage>
    );
  }
}

export default withWidth()(About);
