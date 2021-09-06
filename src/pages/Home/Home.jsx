'use react';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import connect from 'react-redux/es/connect/connect';
import {withRouter} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import withWidth from '@material-ui/core/withWidth';
import SimplePage from '../SimplePage';
import Grid from '@material-ui/core/Grid';
import {fetchNews} from '../../model/news';
import {fetchCourses} from '../../model/courses';
import {NotSignedIn, SignedIn} from './../../components/Auth';
import PullToRefresh from './../../components/PullToRefresh/PullToRefresh';
import {CoursesPlanAgenda, CoursesPlanIntro, CoursesPlanOverview} from '../CoursesPlan';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './style.less';
import MyCourses from "./MyCourses";
import WelcomeGreetings from "./WelcomeGreetings";
import News from "./News";
import SocialMedia from "./SocialMedia";
import ContactForm from "./ContactForm";
import AdventWorkouts from "./AdventWorkouts";
import {deepEqual} from "../../utils/RamdaUtils";

class Home extends Component {

  onRefresh = () => {
    this.props.actions.fetchNews();
    this.props.actions.fetchCourses();
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.pending !== this.props.pending
      || !deepEqual(nextProps.currentUser, this.props.currentUser);
  }

  render() {
    const {pending, currentUser, location, history} = this.props;

    return (
      <SimplePage>
        <PullToRefresh pending={pending} onRefresh={this.onRefresh}>
          <SignedIn>
            <MyCourses className='first-section'/>
          </SignedIn>
          <NotSignedIn>
            <WelcomeGreetings className='section'/>
          </NotSignedIn>

          <News/>

          <NotSignedIn>
            <section className='section' style={{ display: 'flex', justifyContent: 'center' }}>
              <Grid container spacing={0} justify='center' style={{width: '100%', maxWidth: 1200, margin: '0px'}}>
                <CoursesPlanIntro currentUser={currentUser} location={location} history={history}/>
                <img src="/2021-09_Kursplan.jpg" alt="FreyRaum - Aktueller Kursplan" style={{ width: '100%' }} />
              </Grid>
            </section>
          </NotSignedIn>

          <ContactForm className='section'/>
          <SocialMedia className='section'/>
        </PullToRefresh>
      </SimplePage>
    );
  }
}

const mapStateToProps = state => ({
  pending: state.profile.pending || state.courses.pending || state.news.pending,
  currentUser: state.profile.user,
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
