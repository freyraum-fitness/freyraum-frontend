'use react';
import React from 'react';
import compose from 'recompose/compose';
import connect from 'react-redux/es/connect/connect';
import {withRouter} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import SimplePage from '../SimplePage';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import {red} from '@material-ui/core/colors';
import {GridSwitchControl} from './../../components/GridFormControl';
import LoadingIndicator from './../../components/LoadingIndicator';
import {
  changeTempProfilePicture,
  closeProfilePictureChangeDialog,
  fetchOwnProfile,
  onProfileDetailsChange,
  openProfilePictureChangeDialog,
  saveProfilePicture,
  updateSettings
} from './../../model/profile';
import {findBy, viewPath} from './../../utils/RamdaUtils';
import {toLogoPage} from './../../utils/Routing';


class Settings extends SimplePage {

  getSwitch = ({key, label, labelNotChecked = label}) => {
    const {settings, user, actions} = this.props;
    const {updateSettings} = actions;
    const preference = findBy('key', settings, key) || {};
    const checked = preference.value === 'true' || preference.value === true;
    return (<GridSwitchControl
        value={checked}
        onChange={(id, value) => updateSettings({userId: user.id, key: key, value: value})}
        label={checked ? label : labelNotChecked}/>
    );
  };

  render() {
    const {profile, history, location} = this.props;
    if (profile.pending || !this.props.user) {
      return (<LoadingIndicator/>);
    }

    return (
      <SimplePage>
        <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
          <Grid item xs={12} sm={8} md={6} lg={4}>
            <Card>
              <CardHeader
                title='Privatsphäre'
                subheader='Deine Privatsphäre ist uns wichtig und du bestimmst, was andere von dir sehen dürfen.'
              />
              <CardContent>
                {
                  this.getSwitch({
                    key: 'VIEW_PARTICIPATION',
                    label: 'Andere Benutzer dürfen sehen, wenn du an Kursen teilnimmst'
                  })
                }
                {
                  this.getSwitch({
                    key: 'VIEW_PROFILE_PICTURE',
                    label: 'Andere Benutzer dürfen dein Profilbild sehen'
                  })
                }
                {
                  this.getSwitch({
                    key: 'VIEW_PROFILE',
                    label: 'Andere Benutzer dürfen dein Profil sehen'
                  })
                }
                {
                  this.getSwitch({
                    key: 'VIEW_STATISTICS',
                    label: 'Andere Benutzer dürfen deine Statistiken (PR) ansehen'
                  })
                }
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={8} md={6} lg={4}>
            <Card>
              <CardHeader
                title='Benachrichtigungen'
                subheader='Gerne halten wird dich per Mail auf dem Laufenden.'
              />
              <CardContent>
                {
                  this.getSwitch({
                    key: 'NOTIFICATION_NEW_COURSES',
                    label: 'Wir informieren dich wöchentlich über neue Kurse'
                  })
                }
                {
                  this.getSwitch({
                    key: 'NOTIFICATION_CANCELLATION',
                    label: 'Wir informieren dich, wenn ein Kurs abgesagt wird, dem du zugesagt hast'
                  })
                }
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={8}>
            <Button
              fullWidth
              variant='contained'
              color='default'
              onClick={() => toLogoPage(location, history, '/password/change')}>
              Passwort ändern
            </Button>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Button
              fullWidth
              variant='contained'
              style={{backgroundColor: red[500]}}
              onClick={() => toLogoPage(location, history, '/account/delete')}>
              Account löschen
            </Button>
          </Grid>
        </Grid>
      </SimplePage>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.profile,
  settings: viewPath(['profile', 'user', 'preferences'], state),
  user: state.profile.user,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    // profile
    fetchOwnProfile: fetchOwnProfile,
    onProfileDetailsChange: onProfileDetailsChange,
    openProfilePictureChangeDialog: openProfilePictureChangeDialog,
    closeProfilePictureChangeDialog: closeProfilePictureChangeDialog,
    saveProfilePicture: saveProfilePicture,
    changeTempProfilePicture: changeTempProfilePicture,
    updateSettings: updateSettings,
  }, dispatch),
  dispatch
});

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Settings);