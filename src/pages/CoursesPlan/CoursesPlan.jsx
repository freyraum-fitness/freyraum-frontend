'use react';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import connect from 'react-redux/es/connect/connect';
import {withRouter} from 'react-router-dom';
import {bindActionCreators} from 'redux';
import SimplePage from '../SimplePage';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import {toLogoPage} from './../../utils/Routing';
import './style.less';

const data = [
  {
    time: '07:00-07:45',
    mo: 'KRAFT & TECHNIK',
    mi: 'FUN.BASE'
  },
  {
    time: '09:00-10:00',
    mo: 'FUN.POWER',
    di: 'FUN.BASE',
    mi: 'FUN.POWER',
    fr: 'FUN.POWER'
  },
  {
    time: '10:00-11:00',
    mo: 'TRX FIT MOMS',
    di: 'BEST AGER CLASS (65+)',
    mi: 'FUN.BASE',
    do: 'FUN.BASE',
  },
  {
    time: '11:00-11:45',
    di: 'FUN.POWER',
    mi: 'TRX FIT MOMS',
    fr: 'TRX FIT MOMS',
    so: <span><Typography variant='caption' style={{color: 'lightgrey'}}>11:00-12:00</Typography>FUN.TEAM</span>,
  },
  {
    time: '16:30-17:30',
    do: 'KRAFT & TECHNIK',
    fr: 'KRAFT & TECHNIK'
  },
  {
    time: '17:30-18:30',
    mo: 'FUN.POWER',
    di: 'FUN.POWER',
    mi: 'FUN.POWER',
    do: 'FUN.BASE',
    fr: 'FUN.TEAM'
  },
  {
    time: '18:30-19:30',
    mo: 'FUN.BASE',
    di: 'FUN.BASE',
    mi: 'FUN.BASE',
    do: 'FUN.POWER',
    so: 'FUN.TEAM'
  },
  {
    time: '19:30-20:30',
    mo: 'FUN.BASE',
    di: 'FUN.BASE',
    mi: 'FUN.TEAM',
    do: 'MÄNNER ABEND',
  },
  {
    time: '20:30-21:30',
    mo: 'FUN.POWER',
    di: 'FUN.POWER',
    mi: 'FUN.POWER',
  }
];

const types = {
  'FUN.BASE': 'Der Einstieg. Die Grundlage des funktionalen Trainings',
  'FUN.POWER': 'Das volle Programm. Immer neue Herausforderungen. Schweißtreibend!',
  'FUN.TEAM': 'Teamwork. Wir nutzen die Grundübungen und arbeiten uns gemeinsam ans Ziel.',
  'KRAFT & TECHNIK': 'Man lernt nie aus. Techniktraining und Gewichte steigern.',
  'TRX FIT MOMS': 'Mutter & Kind Zeit. Nach der Rückbildungsgymnastik mit dem Kind gemeinsam fit werden.',
  'MÄNNER ABEND': 'Krafttraining. Technik erlernen und gemeinsam Gewichte bewegen.',
  'BEST AGER CLASS (65+)': 'Da geht noch was. Funktionelles Training, egal in welchem Alter.',
};

const Cell = ({children, numeric, disableTooltip}) =>
  <Tooltip title={types[children] || ''}
           disableHoverListener={!children || disableTooltip}
           disableFocusListener={!children || disableTooltip}
           disableTouchListener={!children || disableTooltip}>
    <TableCell
      numeric={numeric}
      className='courses-plan-cell'
    >
      {children}
    </TableCell>
  </Tooltip>;

export const CoursesPlanIntro = ({currentUser, location, history}) => (
  <Grid item xs={12} sm={10} md={8} className='courses-plan-textarea'>
    <Typography variant='h4' gutterBottom>
      Unser Kursplan
    </Typography>

    <Typography gutterBottom>
      In jedem Kurs werden 10 - 30 verschiedene Übungen trainiert. Das Konzept wird jedes Mal individuell
      und neu für den Tag entwickelt.
      Wichtig ist hierbei vor allem das Einbeziehen von funktionellen Übungen, die alltagsnah trainiert
      werden. Dabei werden auch Eigenschaften wie Koordination, Gleichgewicht, Beweglichkeit, Kraft und
      Schnelligkeit einbezogen und je nach Trainingsstand verbessert.
    </Typography>
    <Typography>
      Das hier ist der allgemeinen Kursplan.
      {currentUser
        ? <span> Für alle aktuellen Kurse der nächsten Tage klicke <Button color='primary'
                                                                           onClick={() => history.push('/courses')}>Hier</Button></span>
        : <span> Für Details zu den Kursen und freien Plätzen, melde dich einfach an.<Button color='primary'
                                                                                             onClick={() => toLogoPage(location, history, '/login')}>zum Login</Button></span>
      }
    </Typography>
  </Grid>
);

export const CoursesPlanOverview = () => (
  <Grid item xs={12}>
    <Paper>
      <div style={{overflowX: 'auto'}}>
        <Table>
          <TableHead>
            <TableRow>
              <Cell disableTooltip>Zeit</Cell>
              <Cell disableTooltip numeric>Montag</Cell>
              <Cell disableTooltip numeric>Dienstag</Cell>
              <Cell disableTooltip numeric>Mittwoch</Cell>
              <Cell disableTooltip numeric>Donnerstag</Cell>
              <Cell disableTooltip numeric>Freitag</Cell>
              <Cell disableTooltip numeric>Sonntag</Cell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((n, idx) => {
              return (
                <TableRow key={idx} className={idx % 2 === 0 ? 'odd' : undefined}>
                  <Cell component="th" scope="row">
                    {n.time}
                  </Cell>
                  <Cell numeric>{n.mo}</Cell>
                  <Cell numeric>{n.di}</Cell>
                  <Cell numeric>{n.mi}</Cell>
                  <Cell numeric>{n.do}</Cell>
                  <Cell numeric>{n.fr}</Cell>
                  <Cell numeric>{n.so}</Cell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Paper>
  </Grid>
);

export const CoursesPlanAgenda = () => (
  <Grid item xs={12} sm={10} md={8} className='courses-plan-textarea'>
    {
      Object.keys(types).map((key, idx) => {
        return <div key={idx}>
          <Typography variant='subtitle1' style={{marginTop: '8px'}}>{key}</Typography>
          <Typography gutterBottom>{types[key]}</Typography>
        </div>
      })
    }
  </Grid>
);

class CoursesPlan extends Component {

  render() {
    const {currentUser, location, history} = this.props;
    return (
      <SimplePage>
        <div style={{position: 'relative'}}>
          <Grid container spacing={0} justify='center' style={{width: '100%', margin: '0px'}}>
            <CoursesPlanIntro currentUser={currentUser} location={location} history={history}/>
            <CoursesPlanOverview/>
            <CoursesPlanAgenda/>
          </Grid>
        </div>
      </SimplePage>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.profile.user
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    // no actions needed for now
  }, dispatch),
  dispatch
});

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(CoursesPlan);