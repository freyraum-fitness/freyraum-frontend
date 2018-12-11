'use strict';
import React, {Component} from 'react';
import {withCookies} from 'react-cookie';
import Link from 'react-router-dom/Link';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import './style.less';

class WeUseCookies extends Component {

  constructor(props) {
    super(props);
    const {cookies} = props;
    let cookiesAccepted = cookies.get('accept_cookies');
    this.state = {
      initialCookiesAccepted: cookiesAccepted,
    }
  }

  acceptCookies = () => {
    const {cookies} = this.props;
    cookies.set('accept_cookies', true, {path: '/', sameSite: true});
    this.setState({cookiesAccepted: true});
  };

  render() {
    if (this.state.initialCookiesAccepted) {
      return <div/> // no need to render anything
    }

    return (
      <div className='we-use-cookies' style={{maxHeight: this.state.cookiesAccepted ? '0px' : '1000px'}}>
        <ClickAwayListener onClickAway={this.acceptCookies}>
          <Grid container spacing={16} className='container' justify='center'>
            <Grid item xs={12} sm={10} md={8}>
              <Typography variant='h6'>
                Wir benutzen Cookies 🍪
              </Typography>
              <Typography>
                Um Dein Surferlebis zu verbessern, verwenden wir Cookies.
                Was genau gespeichert wird, kannst Du in den <Link to='/agb/cookies'>AGB</Link> nachlesen.
                Wenn Du auf der Seite weiter surfst, akzeptierst Du unsere Cookies.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={10} md={8} container justify='flex-end'>
              <Button color='primary' onClick={this.acceptCookies}>
                verstanden und schließen
              </Button>
            </Grid>
          </Grid>
        </ClickAwayListener>
      </div>
    );
  }
}

export default withCookies(WeUseCookies);