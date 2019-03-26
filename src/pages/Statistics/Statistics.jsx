'use react';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import connect from 'react-redux/es/connect/connect';
import {bindActionCreators} from 'redux';
import SimplePage from '../SimplePage';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import PullToRefresh from './../../components/PullToRefresh';
import {Bar} from 'react-chartjs';
import {fetchStatistics} from './../../model/statistics';
import {comparingModFunc} from './../../utils/Comparator';
import {findById} from './../../utils/RamdaUtils';
import moment from 'moment';

class TopCourse extends Component {

  render() {
    const {courseType, count} = this.props;
    return (
      <Tooltip title={'Du hast bereits ' + count + ' mal bei ' + courseType.name + ' teilgenommen'}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant='h4' align='center'>
              {count}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography align='center' style={{color: courseType.color}}>
              {courseType.name}
            </Typography>
          </Grid>
        </Grid>
      </Tooltip>
    );
  }
}

class Statistics extends Component {

  constructor(props) {
    super(props);
    this.fetchStatistics();
  }

  onRefresh = () => {
    const {user, actions} = this.props;
    if (user && user.id) {
      actions.fetchStatistics(user.id, true);
    }
  };

  fetchStatistics = () => {
    const {user, statistics, actions} = this.props;
    const {fetchStatistics} = actions;

    if (user && user.id && !statistics.pending) {
      fetchStatistics(user.id);
    }
  };

  componentDidMount() {
    this.fetchStatistics();
  }

  renderTop3 = (top, idx, courseTypes, participationsPerType) => {
    return (
      <Grid item xs={4} sm={3} md={2}>
        <TopCourse courseType={findById(courseTypes.data, top)} count={participationsPerType[top]}/>
      </Grid>
    );
  };

  render() {
    const {statistics, courseTypes} = this.props;

    const participationsPerMonth = statistics.data.participationsPerMonth;
    const sorted = Object.keys(participationsPerMonth)
      .sort(comparingModFunc(value => value, moment));

    const participationsPerType = statistics.data.participationsPerType;
    const top3 = Object.keys(participationsPerType)
      .sort(comparingModFunc(key => participationsPerType[key], v => v, 'DESC'));


    return (
      <SimplePage>
        <PullToRefresh
          pending={statistics.pending}
          onRefresh={this.onRefresh}>
          <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px', padding: '16px 0 0'}}>
            <Grid container item xs={12} md={8}>
              <Grid container spacing={8} item xs={12} alignItems='stretch' style={{padding: '4px'}}>
                <Grid item xs={12}>
                  <Typography variant='subtitle1' color='primary' className='title-h-scroll'>
                    Deine Teilnahmen
                  </Typography>
                </Grid>
                {
                  top3.map((top, idx) => this.renderTop3(top, idx, courseTypes, participationsPerType))
                }
              </Grid>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardHeader title='Statistiken'/>
                <CardContent>
                  <Typography>
                    Hier siehst du, wie oft du in den letzten Wochen und Monaten an Kursen teilgenommen hast.
                  </Typography>
                  <div style={{paddingTop: '16px', width: '100%'}}>
                    <Bar
                      options={{
                        responsive: true,
                        scaleShowVerticalLines: false,
                        tooltipTemplate: "<%=value%> Teilnahme<%if (value > 1){%>n<%}%>",
                      }}
                      data={{
                        labels: sorted
                          .map(key => moment(key).format('MMMM')),
                        datasets: [{
                          label: 'Teilnahmen',
                          fillColor: '#00B0DB',
                          data: sorted
                            .map(key => participationsPerMonth[key])
                        }]
                      }}/>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </PullToRefresh>
      </SimplePage>
    );
  }
}


const mapStateToProps = state => ({
  profile: state.profile,
  user: state.profile.user,
  statistics: state.statistics,
  courseTypes: state.courseTypes
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    // statistics
    fetchStatistics: fetchStatistics,
  }, dispatch),
  dispatch
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(Statistics);
