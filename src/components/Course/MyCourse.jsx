'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {withRouter} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import moment from "moment";
import './style.less';

class MyCourse extends Component {

  getStartTime = start => {
    return moment(start).calendar(null, {
      sameDay: '[Heute] HH:mm [Uhr]',
      nextDay: '[Morgen] HH:mm [Uhr]',
      nextWeek: 'dddd HH:mm [Uhr]',
      lastDay: '[Gestern] HH:mm [Uhr]',
      lastWeek: '[Letzten] dddd HH:mm [Uhr]',
      sameElse: 'DD.MM.YYYY HH:mm [Uhr]'
    });
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

  render() {
    const {course} = this.props;
    const {name, color} = course.courseType;
    return (
      <div className='my-course'>
        <Card>
          <CardActionArea onClick={this.showCourseDetails}>
            <CardContent className='my-course-content'>
              <Typography variant='caption'>
                {this.getStartTime(course.start)}
              </Typography>
              <Typography variant='h6'>
                {name}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <div className='my-course-color-indicator' style={{backgroundColor: color}}/>
      </div>
    );
  }
}

export default compose(
  withRouter,
)(MyCourse);