'use react';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import connect from 'react-redux/es/connect/connect';
import {bindActionCreators} from 'redux';
import SimplePage from '../SimplePage';
import withWidth from '@material-ui/core/withWidth';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconCamera from '@material-ui/icons/CameraAlt';
import Typography from '@material-ui/core/Typography';
import {ProfilePicture, ProfilePictureDialog} from './../../components/profile';
import LoadingIndicator from './../../components/LoadingIndicator';
import PullToRefresh from './../../components/PullToRefresh';
import {
  changeTempProfilePicture,
  closeProfilePictureChangeDialog,
  fetchOwnProfile,
  onProfileDetailsChange,
  openProfilePictureChangeDialog,
  saveProfilePicture
} from './../../model/profile';
import {viewPath} from './../../utils/RamdaUtils';
import {MyMembership} from './../../components/membership';


class Profile extends Component {

  renderMemberships = () => {
    const memberships = viewPath(['profile', 'user', 'memberships'], this.props) || [];
    return (
      <Grid item xs={12} sm={8}>
        <Card>
          <List style={{padding: '0'}}>
            <ListSubheader>
              Deine Mitgliedschaft
            </ListSubheader>
            {
              memberships.map((value, idx) => <MyMembership membership={value} key={idx}/>)
            }
          </List>
        </Card>
      </Grid>
    );
  };

  render() {
    const {
      profile,
      actions,
      width,
    } = this.props;

    if (profile.pending) {
      return (<LoadingIndicator/>);
    } else {
      const {user = {}} = profile;
      const {
        firstname = '',
        lastname = '',
        email,
      } = user;

      return (
        <SimplePage>
          <PullToRefresh
            pending={profile.pending}
            onRefresh={this.props.actions.fetchOwnProfile}>
            <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
              <Grid item xs={12} sm={8} style={{padding: '0px'}}>
                <div style={{position: 'relative', width: '100%', paddingTop: '75%', zIndex: 1}}>
                  <div style={{position: 'absolute', top: '0px', height: '100%', width: '100%', zIndex: 1}}>
                    <ProfilePicture user={profile.user} size={width.toUpperCase()} style={{width: '100%'}}/>
                  </div>
                  <div style={{position: 'absolute', bottom: '0px', right: '24px', zIndex: 2}}>
                    <Button
                      variant='fab'
                      color='secondary'
                      aria-label='edit'
                      onClick={actions.openProfilePictureChangeDialog}>
                      <IconCamera/>
                    </Button>
                  </div>
                </div>

                <Card style={{position: 'relative', margin: '8px', zIndex: 2}}>
                  <CardHeader title={firstname + " " + lastname}/>
                  <CardContent>
                    <Typography variant='caption'>E-Mail</Typography>
                    <Typography>{email}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              {this.renderMemberships()}
            </Grid>
            <ProfilePictureDialog
              show={profile.picture.dialog.open}
              temp={profile.picture.temp}
              pending={profile.picture.pending}
              errorMessage={profile.picture.errorMessage}
              changeTempProfilePicture={actions.changeTempProfilePicture}
              onSave={actions.saveProfilePicture}
              onClose={actions.closeProfilePictureChangeDialog}
            />
          </PullToRefresh>
        </SimplePage>
      );
    }
  }
}

const mapStateToProps = state => ({
  profile: state.profile,
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
  }, dispatch),
  dispatch
});

export default compose(
  withWidth(),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Profile);