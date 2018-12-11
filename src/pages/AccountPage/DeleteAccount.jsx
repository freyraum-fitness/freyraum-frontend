'use react';
import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {red} from '@material-ui/core/colors';

class ResetPassword extends Component {
  render() {
    return (
      <Grid container spacing={16} justify='center'>
        <Grid item xs={12}>
          <Typography paragraph className='delete-text-p1'>
            Du möchtest uns wirklich verlassen?
          </Typography>
          <Typography paragraph className='delete-text-p2'>
            Das ist sehr schade und wir werden Dich im FreyRaum vermissen.
          </Typography>
          <Typography paragraph className='delete-text-p3'>
            Wenn Du Deinen Account endgültig löschen willst und damit auch all Deine Daten auf unserer Seite,
            bestätige dies bitte hier:
          </Typography>
        </Grid>
        <Grid item xs={12} className='delete-button'>
          <Button fullWidth variant='contained' style={{backgroundColor: red[500]}}>
            Account löschen
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography className='delete-foot-note'>
            Wir werden Dir eine Mail schicken, in der Du 48 Stunden Zeit hast, Deine Entscheidung rückgängig zu machen.
            Natürlich kannst Du Dir jederzeit ein neues Konto erstellen.
          </Typography>
        </Grid>
      </Grid>
    )
  }
}

export default ResetPassword;