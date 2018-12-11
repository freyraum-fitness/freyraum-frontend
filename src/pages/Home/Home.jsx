'use react';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import connect from 'react-redux/es/connect/connect';
import {withRouter} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import withWidth, {isWidthDown} from '@material-ui/core/withWidth';
import moment from 'moment';
import SimplePage from '../SimplePage';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import {fetchStatistics} from '../../model/statistics';
import NewsItem from '../../components/news/NewsItem/NewsItem';
import {comparingMod} from '../../utils/Comparator';
import MyCourse from '../../components/Course/MyCourse';
import {SignedIn, NotSignedIn} from './../../components/Auth';
import PullToRefresh from './../../components/PullToRefresh/PullToRefresh';
import {toLogoPage} from '../../utils/Routing';
import {CoursesPlanAgenda, CoursesPlanIntro, CoursesPlanOverview} from '../CoursesPlan';
import Slider from 'react-slick';
import Instagram from 'mdi-material-ui/Instagram';
import Facebook from 'mdi-material-ui/Facebook';
import {PRIMARY} from '../../theme';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './style.less';

const compareCourseByStartDate = comparingMod('start', moment);

class Home extends Component {

  getWelcomeGreetings = () => {
    const {width} = this.props;
    const suffix = isWidthDown('sm', width) ? 'xs' : 'md';
    const img = 'url(' + __API__ + '/welcome_' + suffix + '.jpg)';
    return (
      <Grid container spacing={0} justify='center' style={{width: '100%', margin: '0px'}}>
        <Grid item xs={12} sm={10} md={8} className='home-textarea'>
          <Typography variant='h4' gutterBottom>
            Willkommen im FreyRaum
          </Typography>
          <Typography gutterBottom>
            Funktionelles Training in familiärer Atmosphäre.
          </Typography>
          <Typography gutterBottom>
            Mit der Gründung von FreyRaum entsteht in Toppenstedt ein für die Gegend einzigartiges Konzept.
            Ein Raum, in dem vor allem der Spaß an Bewegung an erster Stelle steht und ein abwechslungsreiches
            Trainingsprogramm wartet.
            Jedes Mal anders, jedes Mal neu!
          </Typography>
          <Typography gutterBottom>
            Neben dem breiten Kursprogramm, können Mitglieder auch zum eigenständigen bzw. freien Training
            vorbei kommen.
          </Typography>
        </Grid>
        <div style={{
          backgroundImage: img,
          width: '100%',
          paddingTop: width === 'xs' ? '57%' : '37%',
          backgroundSize: 'cover'
        }}/>
      </Grid>
    )
  };

  render() {
    const {currentUser, profile, news, courses, location, history} = this.props;
    const {data = {}} = courses;
    const myCourses = data.filter(course => course.signedIn);
    myCourses.sort(compareCourseByStartDate);

    return (
      <SimplePage>
        <PullToRefresh pending={profile.pending}>
          <SignedIn>
            <div className='section'>
              <Typography variant='subtitle1' className='title-h-scroll'>
                Meine nächten Kurse
              </Typography>
              <Slider dots swipeToSlide variableWidth infinite={false} arrows={false}
                      className={'slider variable-width'}
                      slidesToShow={1} slidesToScroll={1}>
                {
                  myCourses.length === 0
                    ? <span>'Melde dich hier zu Kursen an'</span>
                    : myCourses.map((course, idx) => <MyCourse key={idx} course={course}/>)
                }
              </Slider>
            </div>
          </SignedIn>

          <NotSignedIn>
            {this.getWelcomeGreetings()}
          </NotSignedIn>

          <div className='section'>
            <Typography variant='subtitle1' className='title-h-scroll'>
              Neuigkeiten
            </Typography>
            <Slider dots swipeToSlide variableWidth infinite={false} arrows={false} className={'slider variable-width'}
                    slidesToShow={1} slidesToScroll={1}>
              {news.data.map((newsItem, idx) => <NewsItem key={idx} news={newsItem}/>)}
            </Slider>
          </div>

          <NotSignedIn>
            <div className='section'>
              <Grid container spacing={0} justify='center' style={{width: '100%', margin: '0px'}}>
                <CoursesPlanIntro currentUser={currentUser} location={location} history={history}/>
                <CoursesPlanOverview/>
                <CoursesPlanAgenda/>
              </Grid>
            </div>
          </NotSignedIn>

          <div className='section' style={{backgroundColor: '#fafafa'}}>
            <Grid container spacing={0} justify='center' style={{width: '100%', margin: '0px'}}>
              <Grid item container xs={12} sm={10} md={8} className='home-textarea' justify='center'>
                <Grid item xs={12}>
                  <SignedIn>
                    <Typography align='center'>
                      Du hast Anregungen oder Fragen?
                    </Typography>
                  </SignedIn>
                  <NotSignedIn>
                    <Typography align='center'>
                      Lust auf ein Probetraining?
                    </Typography>
                  </NotSignedIn>
                  <Button fullWidth color='primary' onClick={() => toLogoPage(location, history, '/contact')}>
                    Kontakformular
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </div>

          <div className='section' style={{backgroundColor: '#fafafa'}}>
            <Grid container spacing={0} justify='center' style={{width: '100%', margin: '0px'}}>
              <Grid item container xs={12} sm={10} md={8} className='home-textarea' justify='center'>
                <Grid item xs={12}>
                  <Typography align='center'>
                    mehr von FreyRaum im Netz
                  </Typography>
                </Grid>

                <Grid item>
                  <Tooltip title='follow us on Instagram' placement='top'>
                    <a target='_blank' href='https://facebook.com/freyraum.fitness/'>
                      <IconButton style={{color: PRIMARY}}>
                        <Instagram/>
                      </IconButton>
                    </a>
                  </Tooltip>

                  <Tooltip title='find us on facebook' placement='top'>
                    <a target='_blank' href='https://www.instagram.com/freyraum.fitness/'>
                      <IconButton style={{color: PRIMARY}}>
                        <Facebook/>
                      </IconButton>
                    </a>
                  </Tooltip>
                </Grid>

                <Grid item xs={12}>
                  <a href='mailto:freya@freya.fitness' style={{textDecoration: 'none'}}>
                    <Typography variant='caption' align='center'>
                      freya@freya.fitness
                    </Typography>
                  </a>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </PullToRefresh>
      </SimplePage>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.profile,
  currentUser: state.profile.user,
  statistics: state.statistics,
  courseTypes: state.courseTypes,
  courses: state.courses,
  news: state.news
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    // statistics
    fetchStatistics: fetchStatistics,
  }, dispatch),
  dispatch
});

export default compose(
  withWidth(),
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Home);