'use react';
import React from 'react';
import SimplePage from '../SimplePage';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import './style.less';

class Impressum extends SimplePage {

  render() {
    return (
      <SimplePage>
        <Grid container spacing={0} justify='center' style={{width: '100%', margin: '0px'}}>
          <Grid item xs={12} sm={10} md={8} className='impressum-textarea'>
            <Typography variant='h4' gutterBottom>
              Betreiber
            </Typography>
            <Typography>
              Freya Constanze Heine
            </Typography>
            <Typography>
              Tangendorfer Straße 2a
            </Typography>
            <Typography>
              21442 Toppenstedt
            </Typography>
            <Typography>
              Telefon: +49 (0) 151 2071 2506
            </Typography>
            <Typography>
              E-Mail: freyraum@freya.fitness
            </Typography>
          </Grid>

          <Grid item xs={12} sm={10} md={8} className='impressum-textarea'>
            <Typography variant='h4' gutterBottom>
              Haftung für Links
            </Typography>
            <Typography>
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss
              haben.
              Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
              verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die
              verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
              Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche
              Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
              zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </Typography>
          </Grid>
        </Grid>
      </SimplePage>
    );
  }
}

export default Impressum;