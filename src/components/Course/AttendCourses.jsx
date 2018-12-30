'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {withRouter} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import './style.less';

class AttendCourses extends Component {

  showCourses = () => {
    const {history} = this.props;
    history.push('/courses');
  };

  render() {
    return (
      <div className='my-course'>
        <Card>
          <CardActionArea onClick={this.showCourses}>
            <CardContent className='my-course-content'>
              <Typography variant='caption'>
                du bist noch nicht angemeldet
              </Typography>
              <Typography variant='h6'>
                melde dich hier zu Kursen an
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
    );
  }
}

export default compose(
  withRouter,
)(AttendCourses);