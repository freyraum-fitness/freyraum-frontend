'use react';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import connect from 'react-redux/es/connect/connect';
import {withRouter} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import SimplePage from './../SimplePage';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import PullToRefresh from './../../components/PullToRefresh';
import Course from '../../components/Course/index';
import {fetchCourses, signIn, signOut} from './../../model/courses';
import {comparingMod} from './../../utils/Comparator';
import * as Format from './../../utils/Format';
import moment from 'moment';
import {withStyles} from '@material-ui/core/styles';
import {fade} from '@material-ui/core/styles/colorManipulator';
import withWidth from '@material-ui/core/withWidth';
import './style.less';
import {setPath, viewPath} from '../../utils/RamdaUtils';
import Fuse from 'fuse.js';

const compareCourseByStartDate = comparingMod('start', moment);

const styles = theme => ({
  additionalActions: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 'unset',
    },
  },
  search: {
    display: 'inline-block',
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: 'auto',
    flex: 1,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 5,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 6,
    transition: theme.transitions.create('width'),
    width: 70,
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing.unit * 10,
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
});

class Courses extends Component {

  state = {
    search: ''
  };

  setSearch = event => {
    this.setState(setPath(['search'], event.target.value, this.state));
  };

  getCourses = data => {
    const {actions} = this.props;
    data.sort(compareCourseByStartDate);

    const elements = [];
    let lastFormatted = undefined;
    for (const idx in data) {
      const course = data[idx];

      const formattedDayOfCourse = moment(course.start).format(Format.DAY_OF_WEEK_DATE_FORMAT);
      if (lastFormatted !== formattedDayOfCourse) {
        elements.push(
          <ListSubheader key={formattedDayOfCourse} disableGutters className='course-date'>
            {formattedDayOfCourse}
          </ListSubheader>
        );
      }
      lastFormatted = formattedDayOfCourse;

      elements.push(
        <Course
          key={idx}
          course={course}
          showCourseDetails={actions.showNewsDetails}
          signIn={actions.signIn}
          signOut={actions.signOut}/>
      );
    }
    return elements;
  };

  render() {
    const {search} = this.state;
    const {courses, history, location, actions, classes, width} = this.props;

    let filtered = courses.data;
    if (search !== '') {
      const options = {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          'attendees.firstname',
          'attendees.lastname',
          'courseType.name'
        ]
      };
      const fuse = new Fuse(courses.data, options);
      filtered = fuse.search(search);
    }

    const roles = viewPath(['currentUser', 'roles'], this.props) || {};
    const trainerOrAdmin = roles['TRAINER'] || roles['ADMIN'];

    const additionalActions = (
      <div className={classes.additionalActions}>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon/>
          </div>
          <InputBase
            placeholder='Suchen…'
            value={search}
            onChange={this.setSearch}
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
          />
        </div>
        {
          trainerOrAdmin
            ? <Tooltip title='Kurs erstellen' enterDelay={500}>
              <IconButton color='inherit' onClick={() => history.push(location.pathname + '/course/new')}>
                <AddIcon/>
              </IconButton>
            </Tooltip>
            : undefined
        }
      </div>
    );

    return (
      <SimplePage additionalActions={additionalActions} hideTitle={'xs' === width}>
        <PullToRefresh
          pending={courses.pending}
          onRefresh={() => actions.fetchCourses(true)}>
          <Grid container spacing={0} justify='center' style={{width: '100%', margin: '0px'}}>
            <Grid item xs={12} sm={10} md={8}>
              <List disablePadding className='course-list'>
                {this.getCourses(filtered)}
              </List>
            </Grid>
          </Grid>
        </PullToRefresh>
      </SimplePage>
    );
  }
}

const
  mapStateToProps = state => ({
    courses: state.courses,
    currentUser: state.profile.user
  });

const
  mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({
      // courses
      fetchCourses: fetchCourses,
      signIn: signIn,
      signOut: signOut
    }, dispatch),
    dispatch
  });

export default compose(
  withStyles(styles),
  withWidth(),
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Courses);
