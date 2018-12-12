'use strict';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import {withRouter} from 'react-router-dom';
import moment from 'moment/moment';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowBack from '@material-ui/icons/ArrowBack';
import {viewPath} from './../../utils/RamdaUtils';
import {DATE_FORMAT} from './../../utils/Format';
import './style.less';

class NewsDetails extends Component {

  render() {
    const news = viewPath(['location', 'state', 'data'], this.props);
    return (
      <div className='news-details'>
        <AppBar className='page-app-bar' position='sticky'>
          <Toolbar>
            <IconButton className='back-button' color='inherit' onClick={this.props.history.goBack}>
              <ArrowBack/>
            </IconButton>
            <Typography variant='h6' color='inherit'>
              {news.title}
            </Typography>
          </Toolbar>
        </AppBar>
        <div className='news-details-img' style={{backgroundImage: 'url(' + __API__ + '/test' + news.pictureId + '.jpg)'}}/>
        <div className='news-details-textarea'>
          <Typography variant='caption'>
            {moment(news.validity.from).format(DATE_FORMAT)}
          </Typography>
          <Typography>
            {news.text}
          </Typography>
        </div>
      </div>
    );
  };
}

export default compose(
  withRouter,
)(NewsDetails);