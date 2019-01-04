'use strict';
import React from 'react';
import compose from 'recompose/compose';
import connect from 'react-redux/es/connect/connect';
import Typography from '@material-ui/core/Typography';
import Slider from '../../components/Slider';
import {AttendCourses, MyCourse} from '../../components/Course';
import {deepEqual} from '../../utils/RamdaUtils';
import {comparingMod} from '../../utils/Comparator';
import moment from 'moment';

const compareCourseByStartDate = comparingMod('start', moment);

class MyCourses extends React.Component {

  shouldComponentUpdate(nextProps) {
    return !deepEqual(nextProps.courses, this.props.courses)
      || !deepEqual(nextProps.currentUser, this.props.currentUser);
  }
  
  render() {
    const {className, courses, currentUser} = this.props;
    const {data = {}} = courses;
    const myCourses = data.filter(course => course.participationStatus === 'SIGNED_IN' || course.participationStatus === 'ON_WAITLIST');
    myCourses.sort(compareCourseByStartDate);
    return (
      <section className={className}>
        <Typography variant='subtitle1' color='primary' className='title-h-scroll'>
          Hallo {currentUser ? currentUser.firstname : ''}, deine nächsten Kurse
        </Typography>
        <Slider>
          {
            myCourses.length === 0
              ? <AttendCourses/>
              : myCourses.map(course => <MyCourse key={course.id} course={course}/>)
          }
        </Slider>
      </section>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.profile.user,
  courses: state.courses,
});

export default compose(
  connect(mapStateToProps)
)(MyCourses);