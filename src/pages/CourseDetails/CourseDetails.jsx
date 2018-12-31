import React, {Component} from 'react';
import compose from 'recompose/compose';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import {Attendee} from './../../components/Course';
import * as Format from '../../utils/Format';
import {DATE_FORMAT_WITH_DAY, HOUR_MINUTE} from '../../utils/Format';
import {ProfilePicture} from './../../components/profile';
import {showNotification} from './../../model/notification';
import {MODE} from './../../model/courses';
import {getTextColorForBg, SECONDARY} from '../../theme';
import IconBack from '@material-ui/icons/ArrowBack';
import IconCalendar from '@material-ui/icons/DateRange';
import IconCopy from '@material-ui/icons/FileCopy';
import IconClock from '@material-ui/icons/AccessTime';
import Edit from '@material-ui/icons/Edit';
import IconDelete from '@material-ui/icons/Remove';
import IconDeleteForever from '@material-ui/icons/DeleteForever';
import IconLocation from '@material-ui/icons/LocationOn';
import IconUser from '@material-ui/icons/Person';
import IconUserAdd from '@material-ui/icons/PersonAdd';
import IconUserGroup from '@material-ui/icons/Group';
import {deepEqual, setPath, viewPath} from '../../utils/RamdaUtils';
import LoadingIndicator from '../../components/LoadingIndicator';
import ConfirmButton from '../../components/ConfirmButton';
import {GridDateTimeControl} from '../../components/GridFormControl';
import {
  addUserToCourse,
  createCourse,
  deleteCourse,
  duplicateCourse,
  fetchCourses,
  onCourseDetailsChange,
  removeUserFromCourse,
  resetCourseDetails,
  saveCourseDetails,
  showCourseDetails,
  signIn,
  signOut,
} from '../../model/courses';
import {updateUsers} from '../../model/profile';
import {withRouter} from 'react-router-dom';
import {shadeRGBColor} from './../../theme';
import './style.less';
import {ListItemWithDialog} from "../../components/WithDialog";
import {SignedIn} from "../../components/Auth";
import OnlyIf from "../../components/Auth/OnlyIf";
import Fuse from 'fuse.js';

'use strict';

class CourseDetails extends Component {

  state = {
    mode: null,
    user: {
      anchor: null,
      user: null,
    },
    addUser: {
      anchor: null,
      search: '',
    },
    courseType: {
      anchor: null,
    },
  };

  constructor(props) {
    super(props);
    const {match, actions} = props;
    const id = match.params.id;
    if ('new' === id) {
      this.state.mode = MODE.CREATE;
      actions.createCourse();
    } else {
      this.state.mode = MODE.VIEW;
      actions.showCourseDetails(id);
    }
    actions.updateUsers();
  }

  toggleMode = () => {
    if (this.state.mode === MODE.VIEW) {
      this.setState(setPath(['mode'], MODE.MODIFY, this.state));
    } else if (this.state.mode === MODE.MODIFY) {
      this.setState(setPath(['mode'], MODE.VIEW, this.state));
    }
  };

  goBack = () => {
    this.props.history.goBack();
  };

  handleRequestSave = () => {
    this.props.actions.saveCourseDetails(
      this.props.courseDetails.course, () => this.setState(setPath(['mode'], MODE.VIEW, this.state)));
  };

  signInOut = () => {
    const {course = {}} = this.props.courseDetails;
    const {id, participationStatus} = course;
    if (participationStatus === 'SIGNED_IN' || participationStatus === 'ON_WAITLIST') {
      this.props.actions.signOut(id);
    } else {
      this.props.actions.signIn(id);
    }
  };

  openMenu = (event, user) => {
    this.setState(setPath(['user'], {anchor: event.currentTarget, user: user}, this.state));
  };

  closeMenu = () => {
    this.setState(setPath(['user'], {anchor: null, user: null}, this.state));
  };

  getUserMenu = () => {
    const {anchor, user} = this.state.user;
    const {removeUserFromCourse} = this.props.actions;
    const courseId = viewPath(['courseDetails', 'course', 'id'], this.props);
    return <Menu
      open={!!anchor}
      anchorEl={anchor}
      onClose={this.closeMenu}>
      <MenuItem onClick={() => {
        this.closeMenu();
        removeUserFromCourse(courseId, user.id);
      }}>
        <IconDelete/>
        <span style={{marginLeft: '8px'}}>Aus Kurs entfernen</span>
      </MenuItem>
      <MenuItem onClick={() => {
        this.closeMenu()
      }}>
        <IconUser/>
        <span style={{marginLeft: '8px'}}>Profil anzeigen (folgt)</span>
      </MenuItem>
    </Menu>
  };

  openAddUserMenu = event => {
    this.setState(setPath(['addUser'], {anchor: event.currentTarget, search: ''}, this.state));
  };

  closeAddUserMenu = () => {
    this.setState(setPath(['addUser'], {anchor: null, search: ''}, this.state));
  };

  searchUser = value => {
    this.setState(setPath(['addUser', 'search'], value, this.state));
  };

  getUserMenuItem = (user, idx) => {
    const attendees = viewPath(['courseDetails', 'course', 'attendees'], this.props) || [];
    const {addUserToCourse} = this.props.actions;
    const courseId = viewPath(['courseDetails', 'course', 'id'], this.props);

    for (const attendee of attendees) {
      if (attendee.id === user.id) {
        return undefined;
      }
    }

    return <MenuItem key={idx} onClick={() => {
      this.closeAddUserMenu();
      addUserToCourse(courseId, user.id)
    }}>
      <Avatar>
        <ProfilePicture user={user} asAvatar/>
      </Avatar>
      <span style={{marginLeft: '8px'}}>
        {user.firstname + ' ' + user.lastname}
      </span>
    </MenuItem>
  };

  getAddUserMenu = () => {
    const {anchor, search} = this.state.addUser;
    const {updateUsers} = this.props.actions;
    const open = !!anchor;
    if (open) {
      updateUsers();
    }
    const {pending, data} = this.props.users;

    let filtered = data;
    if (search !== '') {
      const options = {
        shouldSort: true,
        threshold: 0.2,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          'firstname',
          'lastname'
        ]
      };
      const fuse = new Fuse(filtered, options);
      filtered = fuse.search(search);
    }

    return <Menu
      open={open}
      anchorEl={anchor}
      PaperProps={{
        style: {
          maxHeight: 48 * 4.5,
        },
      }}
      onClose={this.closeAddUserMenu}>
      <MenuItem>
        <TextField
          value={search}
          onChange={event => this.searchUser(event.target.value)}
          placeholder='Suchen...'/>
      </MenuItem>
      {pending ? <LoadingIndicator/> : filtered.map(this.getUserMenuItem)}
    </Menu>
  };

  openCourseTypeMenu = event => {
    this.setState(setPath(['courseType'], {anchor: event.currentTarget}, this.state));
  };

  closeCourseTypeMenu = () => {
    this.setState(setPath(['courseType'], {anchor: null}, this.state));
  };

  getCourseTypeMenu = () => {
    const {anchor} = this.state.courseType;
    const open = !!anchor;
    const {courseTypes, actions} = this.props;
    const {onCourseDetailsChange} = actions;
    const {pending, data} = courseTypes;
    return <Menu
      open={open}
      anchorEl={anchor}
      PaperProps={{
        style: {
          maxHeight: 48 * 4.75,
        },
      }}
      onClose={this.closeCourseTypeMenu}>
      {
        pending
          ? <LoadingIndicator/>
          : data.map((courseType, idx) =>
            <MenuItem key={idx} onClick={() => {
              this.closeCourseTypeMenu();
              onCourseDetailsChange('courseType', courseType)
            }}>
              {courseType.name}
            </MenuItem>
          )
      }
    </Menu>
  };

  getAttendeeList = attendees => {
    const roles = viewPath(['currentUser', 'roles'], this.props) || {};
    const actionAllowed = roles['TRAINER'] || roles['ADMIN'];
    const maxParticipants = viewPath(['courseDetails', 'course', 'maxParticipants'], this.props) || 0;
    return attendees.map((user, idx) => {
      const onWaitlist = idx >= maxParticipants;
      const {id = ''} = user;
      return <Attendee
        key={idx + '_' + id}
        idx={idx}
        user={user}
        onWaitlist={onWaitlist}
        onClick={actionAllowed ? event => this.openMenu(event, user) : undefined}/>;
    });
  };

  getAddUserButton = () => {
    return <Grid
      item xs={3}
      style={{cursor: 'pointer'}}
      onClick={this.openAddUserMenu}
    >
      <Avatar style={{backgroundColor: SECONDARY, margin: '0 auto'}}>
        <IconUserAdd/>
      </Avatar>
      <Typography
        variant='caption'
        gutterBottom
        align='center'>
        {'Teilnehmer hinzu'}
      </Typography>
    </Grid>
  };

  openDatePicker = () => {
    this.picker.open();
  };

  discardChanges = () => {
    this.props.actions.resetCourseDetails();
    if (this.state.mode === MODE.CREATE) {
      this.goBack();
    }
  };

  duplicateCourse = () => {
    this.props.actions.duplicateCourse();
    this.setState(setPath(['mode'], MODE.CREATE, this.state));
  };

  render() {
    const {
      courseDetails = {},
      courseDelete,
      style,
      titleElement,
      actions
    } = this.props;
    let {
      course,
      originalCourse,
    } = courseDetails;

    const hasChanges = !deepEqual(course, originalCourse);
    const {mode} = this.state;
    const editable = !mode.readonly;

    let pending = false;
    if (!course || (!course.id && mode !== MODE.CREATE)) {
      course = viewPath(['location', 'state', 'data'], this.props);
      if (!course) {
        pending = true;
        course = {};
      }
    }

    const {
      onCourseDetailsChange,
      deleteCourse,
    } = actions;

    const courseId = viewPath(['courseDetails', 'course', 'id'], this.props);
    const {
      start, courseType, minutes, attendees = [], maxParticipants, participationStatus
    } = course;
    if (pending) {
      return <LoadingIndicator/>;
    }

    let {name, color} = courseType;
    if (!name) {
      name = "Kurstyp wählen";
      color = '#00fa00';
    }

    const textColor = getTextColorForBg(color, 'rgba(255,255,255,0.87)', 'rgba(0,0,0,0.93)');

    const roles = viewPath(['currentUser', 'roles'], this.props) || {};
    const trainerOrAdmin = roles['TRAINER'] || roles['ADMIN'];

    return (
      <div className='animation-container' style={style}>
        <div className='title-background' style={{background: 'linear-gradient(10deg, ' + color + ' 40%, ' + shadeRGBColor(color, 0.35) + ' 110%)'}}>
          <Grid container spacing={16} justify='center' style={{width: '100%', margin: '0px'}}>
            <Grid item xs={12} sm={10} md={8} style={{padding: '0px'}}>
              <div className='toolbar'>
                <Tooltip title="Zurück">
                  <IconButton className='icon-back' onClick={this.goBack} style={{color: textColor}}>
                    <IconBack/>
                  </IconButton>
                </Tooltip>

                <OnlyIf isTrue={mode !== MODE.CREATE}>
                  <SignedIn hasAnyRole={['TRAINER', 'ADMIN']}>
                    <div style={{display: 'inline-block'}}>
                      <Tooltip title='Bearbeiten'>
                        <IconButton onClick={this.toggleMode} style={{color: textColor, transform: editable ? 'rotateY(180deg)' : undefined}}>
                          <Edit/>
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Duplizieren">
                        <IconButton onClick={this.duplicateCourse} style={{color: textColor}}>
                          <IconCopy/>
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Kurs löschen">
                        <ConfirmButton
                          iconButton
                          style={{color: textColor}}
                          question='Möchtest du den Kurs wirklich löschen?'
                          onClick={() => {
                            deleteCourse(courseId);
                            this.goBack();
                          }}
                          variant='raised'
                          pending={courseDelete.pending}
                        >
                          <IconDeleteForever/>
                        </ConfirmButton>
                      </Tooltip>
                    </div>
                  </SignedIn>
                </OnlyIf>
              </div>
            </Grid>
          </Grid>
          <div className='title-course-type'>
            {name}
          </div>
        </div>
        <div
          className='course-type'
          onClick={this.openCourseTypeMenu}
          style={{color: textColor, cursor: trainerOrAdmin ? 'pointer' : undefined, ...titleElement}}>
          {name}
        </div>
        {/* Menü */}
        {trainerOrAdmin ? this.getCourseTypeMenu() : undefined}

        <div className='trainer'>
          <div className='trainer-image'>
            <ProfilePicture user={course.instructor} size='XS'/>
          </div>
          <div className='trainer-name'>
            <Typography variant='caption'>mit {viewPath(['instructor', 'firstname'], course)}</Typography>
          </div>
        </div>

        <div className='content'>
          <Grid container spacing={16} justify='center' style={{width: '100%', margin: '0px'}}>
            <Grid item xs={12} sm={10} md={8}>
              <Card>
                <CardContent style={{padding: '0px'}}>
                  <List style={{paddingBottom: '0px'}}>
                    <ListItem button={editable} onClick={editable ? this.openDatePicker : undefined}>
                      <ListItemIcon>
                        {
                          editable
                          ? <Edit size={24}/>
                          : <IconCalendar size={24}/>
                        }

                      </ListItemIcon>
                      <ListItemText
                        primary={start ? moment(start).format(HOUR_MINUTE) + ' Uhr' : ''}
                        secondary={start ? moment(start).format(DATE_FORMAT_WITH_DAY) : ''}/>
                    </ListItem>
                    {/* Invisible component - just used for date time selection */}
                    <GridDateTimeControl
                      ctrlRef={e => this.picker = e}
                      style={{position: 'absolute', top: -9000, opacity: '0'}}
                      id='start_date'
                      value={moment(start)}
                      onChange={value => {
                        if (!value.isValid()) {
                          return;
                        }
                        onCourseDetailsChange('start', value.format(Format.TIMESTAMP_FORMAT));
                      }}
                    />

                    <ListItemWithDialog
                      editable={editable}
                      icon={<IconClock size={24}/>}
                      label='Kursdauer'
                      value={minutes}
                      type='number'
                      primary={minutes + ' Minuten'}
                      onChange={value => onCourseDetailsChange('minutes', Number.parseInt(value))}/>

                    <ListItem>
                      <ListItemIcon>
                        <IconLocation size={24}/>
                      </ListItemIcon>
                      <ListItemText
                        primary={'FREY.RAUM Toppenstedt'}
                        secondary={'Tangendorfer Straße 2a'}/>
                    </ListItem>

                    <ListItemWithDialog
                      editable={editable}
                      icon={<IconUserGroup size={24}/>}
                      label='maximale Teilehmerzahl'
                      value={maxParticipants}
                      type='number'
                      primary={'maximal ' + maxParticipants + ' Teilnehmer'}
                      onChange={value => onCourseDetailsChange('maxParticipants', Number.parseInt(value))}/>

                  </List>
                </CardContent>

                <CardActions
                  style={{
                    height: '0px',
                    padding: '0px',
                    overflow: 'hidden',
                    justifyContent: 'center',
                    transition: 'all 650ms cubic-bezier(0.23, 1, 0.32, 1)'
                  }}
                  className={hasChanges ? 'hasChanges' : undefined}>
                  <Button color='secondary' onClick={this.discardChanges}>
                    {mode === MODE.CREATE ? 'Abbrechen' : 'Änderungen verwerfen'}
                  </Button>
                  <Button color='primary' onClick={this.handleRequestSave}>
                    {mode === MODE.CREATE ? 'Neuen Kurs speichern' : 'Änderungen speichern'}
                  </Button>
                </CardActions>

                <CardActions style={{justifyContent: 'space-between'}}>
                  <Typography style={{display: 'inline-block', color: participationStatus === 'SIGNED_IN' ? 'green' : 'orange', paddingLeft: '16px', paddingRight: '16px'}}>
                    <OnlyIf isTrue={participationStatus === 'SIGNED_IN'}>
                      Du bist angemeldet
                    </OnlyIf>
                    <OnlyIf isTrue={participationStatus === 'ON_WAITLIST'}>
                      Du bist auf der Warteliste
                    </OnlyIf>
                  </Typography>
                  <Button color='primary' onClick={this.signInOut} disabled={hasChanges}>
                    {participationStatus === 'SIGNED_IN' || participationStatus === 'ON_WAITLIST' ? 'Abmelden' : 'Teilnehmen'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} sm={10} md={8}>
              <Grid container spacing={16} style={{width: '100%', margin: '0px'}}>
                {this.getAttendeeList(attendees)}
                {trainerOrAdmin ? this.getUserMenu() : undefined}
                {trainerOrAdmin ? this.getAddUserButton() : undefined}
                {trainerOrAdmin ? this.getAddUserMenu() : undefined}
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  };
}

const mapStateToProps = state => ({
  currentUser: state.profile.user,
  courseTypes: state.courseTypes,
  courseDetails: state.courses.courseDetails,
  users: state.profile.users,
  courseDelete: state.courses.delete
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    showNotification: showNotification,
    // users
    updateUsers: updateUsers,
    // courses
    fetchCourses: fetchCourses,
    createCourse: createCourse,
    duplicateCourse: duplicateCourse,
    showCourseDetails: showCourseDetails,
    saveCourseDetails: saveCourseDetails,
    onCourseDetailsChange: onCourseDetailsChange,
    resetCourseDetails: resetCourseDetails,
    signIn: signIn,
    signOut: signOut,
    addUserToCourse: addUserToCourse,
    removeUserFromCourse: removeUserFromCourse,
    deleteCourse: deleteCourse
  }, dispatch),
  dispatch
});


export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(CourseDetails);