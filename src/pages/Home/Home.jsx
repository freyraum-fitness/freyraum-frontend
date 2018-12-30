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
import AddComment from '@material-ui/icons/AddComment';
import {fetchNews} from '../../model/news';
import {fetchCourses} from '../../model/courses';
import NewsItem from '../../components/news/NewsItem/NewsItem';
import {comparingMod, comparingModFunc, DESC} from '../../utils/Comparator';
import {AttendCourses, MyCourse} from '../../components/Course';
import {NotSignedIn, SignedIn} from './../../components/Auth';
import PullToRefresh from './../../components/PullToRefresh/PullToRefresh';
import VideoCard from './../../components/VideoCard';
import {toLogoPage} from '../../utils/Routing';
import {CoursesPlanAgenda, CoursesPlanIntro, CoursesPlanOverview} from '../CoursesPlan';
import Instagram from 'mdi-material-ui/Instagram';
import Facebook from 'mdi-material-ui/Facebook';
import Youtube from 'mdi-material-ui/Youtube';
import {PRIMARY} from '../../theme';
import {Workouts} from "./Workouts";
import {Slider} from './Slider';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './style.less';

const compareCourseByStartDate = comparingMod('start', moment);
const compareNewsByValidityFrom = comparingModFunc(news => news.validity.from, moment, DESC);

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
            Neben dem breiten Kursprogramm können Mitglieder auch zum eigenständigen bzw. freien Training
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

  onRefresh = () => {
    this.props.actions.fetchNews();
    this.props.actions.fetchCourses();
  };

  render() {
    const {currentUser, profile, news, courses, location, history} = this.props;
    const {data = {}} = courses;
    const myCourses = data.filter(course => course.participationStatus === 'SIGNED_IN' || course.participationStatus === 'ON_WAITLIST');
    myCourses.sort(compareCourseByStartDate);
    const newsData = news.data;
    newsData.sort(compareNewsByValidityFrom);

    return (
      <SimplePage>
        <PullToRefresh pending={news.pending || courses.pending || profile.pending} onRefresh={this.onRefresh}>
          <SignedIn>
            <section className='first-section'>
              <Typography variant='subtitle1' color='primary' className='title-h-scroll'>
                Hallo {currentUser ? currentUser.firstname : ''}, deine nächsten Kurse
              </Typography>
              <Slider>
                {
                  myCourses.length === 0
                    ? <AttendCourses/>
                    : myCourses.map((course, idx) => <MyCourse key={idx} course={course}/>)
                }
              </Slider>
            </section>
          </SignedIn>

          <NotSignedIn>
            {this.getWelcomeGreetings()}
          </NotSignedIn>

          <SignedIn>
            <section className='section'>
              <div className='title-h-scroll'>
                <Typography variant='subtitle1' color='primary'>
                  Adventskalender
                </Typography>
              </div>
              <Slider>
                {Workouts.map((item, idx) => <VideoCard key={idx} title={item.title} url={item.url}/>)}
              </Slider>
            </section>
          </SignedIn>

          <section className='section'>
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
            <Slider>
              {newsData.map((newsItem, idx) => <NewsItem key={idx} news={newsItem}/>)}
            </Slider>
          </section>

          <NotSignedIn>
            <section className='section'>
              <Grid container spacing={0} justify='center' style={{width: '100%', margin: '0px'}}>
                <CoursesPlanIntro currentUser={currentUser} location={location} history={history}/>
                <CoursesPlanOverview/>
                <CoursesPlanAgenda/>
              </Grid>
            </section>
          </NotSignedIn>

          <section className='section' style={{backgroundColor: '#fafafa'}}>
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
                    Kontaktformular
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </section>

          <section className='section' style={{backgroundColor: '#fafafa'}}>
            <Grid container spacing={0} justify='center' style={{width: '100%', margin: '0px'}}>
              <Grid item container xs={12} sm={10} md={8} className='home-textarea' justify='center'>
                <Grid item xs={12}>
                  <Typography align='center'>
                    mehr von FreyRaum im Netz
                  </Typography>
                </Grid>

                <Grid item>
                  <Tooltip title='follow us on Instagram' placement='top'>
                    <a target='_blank' href='https://www.instagram.com/freyraum.fitness/'>
                      <IconButton style={{color: PRIMARY}}>
                        <Instagram/>
                      </IconButton>
                    </a>
                  </Tooltip>

                  <Tooltip title='find us on facebook' placement='top'>
                    <a target='_blank' href='https://www.facebook.com/freyraum.fitness/'>
                      <IconButton style={{color: PRIMARY}}>
                        <Facebook/>
                      </IconButton>
                    </a>
                  </Tooltip>

                  <Tooltip title='YouTube' placement='top'>
                    <a target='_blank' href='https://www.youtube.com/channel/UCPudg12FsBXS6xD-b-YVp6A/videos'>
                      <IconButton style={{color: PRIMARY}}>
                        <Youtube/>
                      </IconButton>
                    </a>
                  </Tooltip>
                </Grid>

                <Grid item xs={12}>
                  <a href='mailto:freyraum@freya.fitness' style={{textDecoration: 'none'}}>
                    <Typography variant='caption' align='center'>
                      freyraum@freya.fitness
                    </Typography>
                  </a>
                </Grid>
              </Grid>
            </Grid>
          </section>
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
    fetchNews: fetchNews,
    fetchCourses: fetchCourses,
  }, dispatch),
  dispatch
});

export default compose(
  withWidth(),
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Home);