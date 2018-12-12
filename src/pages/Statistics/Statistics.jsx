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
import PullToRefresh from './../../components/PullToRefresh';
import {Bar} from 'react-chartjs';
import {fetchStatistics} from './../../model/statistics';
import {comparingModFunc} from './../../utils/Comparator';
import {findById} from './../../utils/RamdaUtils';
import moment from 'moment';


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

  render() {
    const {statistics, courseTypes} = this.props;

    const {name = ""} = findById(courseTypes.data, statistics.data.favouriteCourseTypeId) || {};
    const participationsPerMonth = statistics.data.participationsPerMonth;
    const sorted = Object.keys(participationsPerMonth)
      .sort(comparingModFunc(value => value, moment));

    return (
      <SimplePage>
        <PullToRefresh
          pending={statistics.pending}
          onRefresh={this.onRefresh}>
          <Grid container spacing={16} justify="center" style={{width: '100%', margin: '0px'}}>
            <Grid item xs={12} sm={8}>
              <Card>
                <CardHeader title='Dein Lieblingskurs'/>
                <CardContent>
                  <Typography>
                    {name}
                  </Typography>
                  <Typography variant='caption'>
                    {'Du hast an diesem Kurs bereits ' + statistics.data.favouriteCourseParticipations + ' mal teilgenommen.'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={8}>
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
