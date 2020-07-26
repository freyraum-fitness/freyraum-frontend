'use strict';
import React from 'react';
import compose from 'recompose/compose';
import connect from 'react-redux/es/connect/connect';
import {withRouter} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import AddComment from '@material-ui/icons/AddComment';
import Slider from '../../components/Slider';
import {deepEqual} from '../../utils/RamdaUtils';
import {SignedIn} from '../../components/Auth';
import NewsItem from '../../components/news/NewsItem/NewsItem';
import {comparingModFunc, DESC} from '../../utils/Comparator';
import moment from 'moment';

const compareNewsByValidityFrom = comparingModFunc(news => news.validity.from, moment, DESC);

class News extends React.Component {

  shouldComponentUpdate(nextProps) {
    return !deepEqual(nextProps.news, this.props.news);
  }

  render() {
    const {className, news, history, location} = this.props;
    const newsData = news.data;
    newsData.sort(compareNewsByValidityFrom);

    console.warn("foor", news);

    return (
      <section className={className}>
        <div className='title-h-scroll'>
          <Typography variant='subtitle1' color='primary'>
            Neuigkeiten
          </Typography>
          <SignedIn hasAnyRole={['TRAINER', 'ADMIN']}>
            <IconButton color='primary' onClick={() => history.push(location.pathname + '/news/new')}>
              <AddComment/>
            </IconButton>
          </SignedIn>
        </div>

        <Grid container spacing={0} justify="space-around" style={{width: '100%', margin: '0px'}}>
          {
            newsData.map(newsItem =>
              <Grid item xs={12} sm={8} md={4} lg={3}>
                <NewsItem key={newsItem.id} news={newsItem}/>
              </Grid>
            )
          }
        </Grid>
      </section>
    )
  }
}

const mapStateToProps = state => ({
  news: state.news,
});

export default compose(
  withRouter,
  connect(mapStateToProps)
)(News);
