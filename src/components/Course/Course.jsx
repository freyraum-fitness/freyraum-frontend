'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import moment from 'moment';
import * as Format from '../../utils/Format/index';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';
import IconMoreVert from '@material-ui/icons/MoreVert';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import {setPath, viewPath} from '../../utils/RamdaUtils/index';
import {withRouter} from 'react-router-dom';

import {red} from '@material-ui/core/colors';
import {deepEqual} from "../../utils/RamdaUtils";

export const TypeMapper = {
  UNKNOWN: {name: 'unbekannter Kurs', color: red['A200']}
};

const getAvailability = (participants, maxParticipants, textDecoration) => {
  const free = maxParticipants - participants.length;
  let color = free > 2 ? 'grey' : 'orange';
  let text = (free) + (free === 1 ? ' freier Platz' : ' freie Plätze');
  if (free <= 0) {
    color = 'red';
    text = 'Warteliste';
  }
  return (
    <Typography style={{color: color, display: 'inline-block', float: 'right', textDecoration: textDecoration}}>
      {text}
    </Typography>
  );
};

class Course extends Component {

  elements = {};

  state = {
    course: {
      anchor: null,
      course: null
    }
  };

  openMenu = (event, course) => {
    this.setState(setPath(['course'], {anchor: event.currentTarget, course: course}, this.state));
  };

  closeMenu = () => {
    this.setState(setPath(['course'], {anchor: null, course: null}, this.state));
  };

  showCourseDetails = () => {
    const {course, history, location} = this.props;

    history.push({
      pathname: location.pathname + '/course/' + course.id,
      state: {
        to: 'modal',
        data: course,
      }
    });
  };

  getCourseMenu = () => {
    const {anchor} = this.state.course;
    const {signIn, signOut} = this.props;
    const courseId = viewPath(['course', 'id'], this.props);
    const participationStatus = viewPath(['course', 'participationStatus'], this.props);
    return <Menu
      open={!!anchor}
      anchorEl={anchor}
      onClose={this.closeMenu}>
      {
        participationStatus === 'SIGNED_IN' || participationStatus === 'ON_WAITLIST'
          ? <MenuItem onClick={() => {
            this.closeMenu();
            signOut(courseId);
          }}>
            <span style={{marginLeft: '8px'}}>Abmelden</span>
          </MenuItem>
          : <MenuItem onClick={() => {
            this.closeMenu();
            signIn(courseId);
          }}>
            <span style={{marginLeft: '8px'}}>Teilnehmen</span>
          </MenuItem>
      }
      <MenuItem onClick={() => {
        this.closeMenu();
        this.showCourseDetails();
      }}>
        <span style={{marginLeft: '8px'}}>Details anzeigen</span>
      </MenuItem>
    </Menu>
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !deepEqual(nextProps.course, this.props.course)
      || nextProps.showDate !== this.props.showDate
      || !deepEqual(nextState, this.state);
  }

  render() {
    const {course, showDate} = this.props;
    const {
      id,
      courseType,
      start,
      minutes,
      instructor,
      participationStatus,
      attendees,
      maxParticipants,
      canceled
    } = course;

    const {name, color} = courseType;
    const textDecoration = canceled ? 'line-through' : undefined;

    const title = (<div>
      <span ref={e => this.elements.title = e}>
        <Typography type={'title'} style={{display: 'inline-block', textDecoration: textDecoration}}>
          {name}
        </Typography>
      </span>
      <Typography
        style={{
          display: 'inline-block',
          float: 'right',
          textDecoration: textDecoration
        }}>{'mit ' + instructor.firstname}</Typography>
    </div>);
    const additional = (<div>
      {participationStatus === 'SIGNED_IN' ? <Typography style={{display: 'inline-block', color: 'green'}}>Du bist angemeldet</Typography> : undefined}
      {participationStatus === 'ON_WAITLIST' ? <Typography style={{display: 'inline-block', color: 'orange'}}>Auf der Warteliste</Typography> : undefined}
      {getAvailability(attendees, maxParticipants, textDecoration)}
    </div>);
    const infos = canceled ? (<div>
      <Typography style={{color: 'red'}}>Der Kurs wurde abgesagt</Typography>
    </div>) : undefined;

    let backgroundColor;
    if (!canceled) {
      backgroundColor = 'rgba(255, 255, 255, 0.75)';
    }

    return (
      <ListItem
        button
        onClick={this.showCourseDetails}
        ContainerProps={{ref: e => this.elements.item = e}}
        style={{backgroundColor: backgroundColor, position: 'relative'}}>
        <div style={{
          position: 'relative',
          height: '100%',
          width: '36px',
          display: 'inline-block',
          padding: '0 36px 0 0'
        }}> {/* 16px + 4px + 16px */}
          {showDate
            ? <Typography>
              {moment(start).format('DD.MM.')}
            </Typography>
            : undefined
          }
          <Typography>
            {moment(start).format(Format.HOUR_MINUTE)}
          </Typography>
          <Typography style={{color: 'grey'}}>
            {moment(start).add(minutes, 'minutes').format(Format.HOUR_MINUTE)}
          </Typography>
        </div>
        <div style={{display: 'inline-block', width: '100%', paddingRight: '24px'}}>
          {title}
          {additional}
          {infos}
        </div>
        <div
          id={'color_bar_course_' + id}
          style={{
            backgroundColor: color,
            position: 'absolute',
            left: '68px', /* 16px + 36px + 16px */
            width: '4px',
            height: '100%',
            minHeight: '100%'
          }}
        />
        <ListItemSecondaryAction>
          <IconButton aria-label='more' onClick={event => this.openMenu(event, course)}>
            <IconMoreVert/>
          </IconButton>
          {this.getCourseMenu()}
        </ListItemSecondaryAction>
      </ListItem>
    );
  };
}

export default compose(
  withRouter,
)(Course);