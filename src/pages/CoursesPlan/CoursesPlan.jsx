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
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {toLogoPage} from './../../utils/Routing';
import './style.less';
import {findBy} from "../../utils/RamdaUtils";

const data = [
  {
    time: {primary: '07:00-07:45'},
    mo: {primary: 'KRAFT & TECHNIK'},
    di: {},
    mi: {primary: 'FUN.BASE'},
    do: {},
    fr: {},
    so: {},
  },
  {
    time: {primary: '09:00-10:00'},
    mo: {primary: 'FUN.POWER'},
    di: {primary: 'FUN.BASE'},
    mi: {primary: 'FUN.POWER'},
    do: {},
    fr: {primary: 'FUN.POWER'},
    so: {},
  },
  {
    time: {primary: '10:00-11:00'},
    mo: {primary: 'FIT MOMS'},
    di: {primary: 'BEST AGERS(65+)'},
    mi: {primary: 'FUN.BASE'},
    do: {},
    fr: {primary: 'FUN.BASE'},
    so: {},
  },
  {
    time: {primary: '11:00-11:45'},
    mo: {},
    di: {primary: 'FUN.POWER'},
    mi: {primary: 'FIT MOMS'},
    do: {},
    fr: {primary: 'FIT MOMS'},
    so: {primary: 'FUN.TEAM', secondary: '11:00-12:00'},
  },
  {
    time: {primary: '16:30-17:30'},
    mo: {},
    di: {},
    mi: {},
    do: {primary: 'KRAFT & TECHNIK'},
    fr: {primary: 'KRAFT & TECHNIK'},
    so: {},
  },
  {
    time: {primary: '17:30-18:30'},
    mo: {primary: 'FUN.POWER'},
    di: {primary: 'FUN.POWER'},
    mi: {primary: 'FUN.POWER'},
    do: {primary: 'FUN.BASE'},
    fr: {primary: 'FUN.TEAM'},
    so: {},
  },
  {
    time: {primary: '18:30-19:30'},
    mo: {primary: 'FUN.BASE'},
    di: {primary: 'FUN.BASE'},
    mi: {primary: 'FUN.BASE'},
    do: {primary: 'FUN.POWER'},
    fr: {},
    so: {primary: 'FUN.TEAM'},
  },
  {
    time: {primary: '19:30-20:30'},
    mo: {primary: 'FUN.BASE'},
    di: {primary: 'FUN.BASE'},
    mi: {primary: 'FUN.TEAM'},
    do: {primary: 'MÄNNERABEND'},
    fr: {},
    so: {},
  },
  {
    time: {primary: '20:30-21:30'},
    mo: {primary: 'FUN.POWER'},
    di: {primary: 'FUN.POWER'},
    mi: {primary: 'FUN.POWER'},
    do: {},
    fr: {},
    so: {},
  }
];

const types = {
  'FUN.BASE': 'Der Einstieg. Die Grundlage des funktionalen Trainings',
  'FUN.POWER': 'Das volle Programm. Immer neue Herausforderungen. Schweißtreibend!',
  'FUN.TEAM': 'Teamwork. Wir nutzen die Grundübungen und arbeiten uns gemeinsam ans Ziel.',
  'KRAFT & TECHNIK': 'Man lernt nie aus. Techniktraining und Gewichte steigern.',
  'FIT MOMS': 'Mutter & Kind Zeit. Nach der Rückbildungsgymnastik mit dem Kind gemeinsam fit werden.',
  'MÄNNERABEND': 'Krafttraining. Technik erlernen und gemeinsam Gewichte bewegen.',
  'BEST AGERS(65+)': 'Da geht noch was. Funktionelles Training, egal in welchem Alter.',
};

const mapStateToProps = state => ({
  currentUser: state.profile.user,
  courseTypes: state.courseTypes,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    // no actions needed for now
  }, dispatch),
  dispatch
});

class _Cell extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.selected !== this.props.selected;
  }

  render() {
    const {selected, onClick, children, numeric, courseTypes} = this.props;
    let color = undefined;
    if (selected && !!children) {
      const courseType = findBy('name', courseTypes.data, children.primary) || {};
      color = courseType.color;
    }

    return (
      <TableCell
        numeric={numeric}
        className='courses-plan-cell'
        style={{color: color, cursor: 'grab'}}
        onClick={onClick}
        onMouseEnter={onClick}
      >
        <Typography variant='caption'>
          {children.secondary}
        </Typography>
        {children.primary}
      </TableCell>
    );
  }
}

const Cell = compose(
  connect(mapStateToProps, mapDispatchToProps)
)(_Cell);

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
    <Typography gutterBottom>
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

export class CoursesPlanOverview extends React.Component {

  state = {
    selected: ''
  };

  select = name => {
    this.setState({selected: name});
  };

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.selected !== this.state.selected;
  }

  render() {
    const {selected} = this.state;
    return (
      <Grid item xs={12}>
        <ClickAwayListener onClickAway={() => this.select(undefined)}>
          <Paper>
            <div style={{overflowX: 'auto'}}>
              <Table>
                <TableHead>
                  <TableRow>
                    <Cell>{{primary: 'Zeit'}}</Cell>
                    <Cell numeric>{{primary: 'Montag'}}</Cell>
                    <Cell numeric>{{primary: 'Dienstag'}}</Cell>
                    <Cell numeric>{{primary: 'Mittwoch'}}</Cell>
                    <Cell numeric>{{primary: 'Donnerstag'}}</Cell>
                    <Cell numeric>{{primary: 'Freitag'}}</Cell>
                    <Cell numeric>{{primary: 'Sonntag'}}</Cell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((n, idx) => {
                    return (
                      <TableRow key={n.time} className={idx % 2 === 0 ? 'odd' : undefined}>
                        <Cell component="th" scope="row">
                          {n.time}
                        </Cell>
                        <Cell numeric selected={selected === n.mo.primary} onClick={() => this.select(n.mo.primary)}>{n.mo}</Cell>
                        <Cell numeric selected={selected === n.di.primary} onClick={() => this.select(n.di.primary)}>{n.di}</Cell>
                        <Cell numeric selected={selected === n.mi.primary} onClick={() => this.select(n.mi.primary)}>{n.mi}</Cell>
                        <Cell numeric selected={selected === n.do.primary} onClick={() => this.select(n.do.primary)}>{n.do}</Cell>
                        <Cell numeric selected={selected === n.fr.primary} onClick={() => this.select(n.fr.primary)}>{n.fr}</Cell>
                        <Cell numeric selected={selected === n.so.primary} onClick={() => this.select(n.so.primary)}>{n.so}</Cell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Paper>
        </ClickAwayListener>
      </Grid>
    );
  }
}

class _CoursesPlanAgenda extends React.Component {

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const {courseTypes} = this.props;
    return (
      <Grid item xs={12} sm={10} md={8} className='courses-plan-textarea'>
        {
          Object.keys(types).map(name => {
            const courseType = findBy('name', courseTypes.data, name) || {};
            return <div key={name}>
              <Typography variant='subtitle1' style={{marginTop: '8px', color: courseType.color}}>{name}</Typography>
              <Typography gutterBottom>{types[name]}</Typography>
            </div>
          })
        }
      </Grid>
    );
  }
}
export const CoursesPlanAgenda = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(_CoursesPlanAgenda);

class CoursesPlan extends Component {

  render() {
    const {currentUser, location, history} = this.props;
    return (
      <SimplePage>
        <div style={{position: 'relative'}}>
          <Grid container spacing={0} justify='center' style={{width: '100%', margin: '0px'}}>
            <CoursesPlanIntro currentUser={currentUser} location={location} history={history}/>
            <img src="/2021-09_Kursplan.jpg" alt="FreyRaum - Aktueller Kursplan" style={{ width: '100%' }} />
          </Grid>
        </div>
      </SimplePage>
    );
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(CoursesPlan);
