'use react';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import connect from 'react-redux/es/connect/connect';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import SimplePage from '../SimplePage';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import TextField from '@material-ui/core/TextField';
import BatchedButton from '../../components/BatchedButton';
import {getIcon} from './../../components/membership';
import {comparingModFunc} from '../../utils/Comparator';
import {findBy, findById, setPath, togglePath} from './../../utils/RamdaUtils';
import {DATE_FORMAT} from './../../utils/Format';
import {fetchMemberships} from './../../model/memberships';
import Fuse from 'fuse.js';
import moment from 'moment';
import PullToRefresh from '../../components/PullToRefresh/PullToRefresh';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import {viewPath} from '../../utils/RamdaUtils';
import './style.less';

const infinity = '\u221E';

const mapStateToProps = state => ({
  courses: state.courses,
  currentUser: state.profile.user,
  memberships: state.memberships,
  membershipTypes: state.membershipTypes,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    // memberships
    fetchMemberships: fetchMemberships,
  }, dispatch),
  dispatch
});

class _MembershipItem extends Component {

  onClick = selectedMembership => {
    const {history} = this.props;
    history.push('/memberships/membership/' + selectedMembership.id);
  };

  render() {
    const {membership, membershipTypes, className} = this.props;
    const {key, maxParticipations} = findById(membershipTypes.data, membership.membershipTypeId) || {};
    let max = maxParticipations;
    if (max === -1) {
      max = infinity;
    }

    return <ListItem button onClick={() => this.onClick(membership)} className={className}>
      <ListItemIcon>
        {getIcon(maxParticipations, membership.participationCount, key)}
      </ListItemIcon>
      <Grid container spacing={0} justify='center' style={{width: '100%', padding: '8px'}}>
        <Grid item xs={8}>
          <Typography>{membership.user.firstname + ' ' + membership.user.lastname}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>
            {moment(membership.validity.from).format(DATE_FORMAT)}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant='caption'>
            {membership.participationCount + ' von ' + max}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography>
            {
              membership.validity.to
                ? moment(membership.validity.to).format(DATE_FORMAT)
                : infinity
            }
          </Typography>
        </Grid>
      </Grid>
    </ListItem>
  }
}

const MembershipItem = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(_MembershipItem);

class Memberships extends SimplePage {

  state = {
    search: '',
    filter: {
      card10: false,
      card10full: false,
      abo: false,
      trial: false,
      extended: false,
      valid: true,
      search: true,
    },
    showInvalid: false,
  };

  onRowSelect = selectedMembership => {
    const {history} = this.props;
    history.push('/memberships/membership/' + selectedMembership.id);
  };

  toggleFilter = id => {
    const updated = togglePath(['filter', id], this.state);
    this.setState(setPath(['search'], '', updated));
  };

  setSearch = event => {
    this.setState(setPath(['search'], event.target.value, this.state));
  };

  render() {
    const {search, filter} = this.state;
    const {memberships, membershipTypes, actions, location, history} = this.props;
    const {pending, data} = memberships;
    const {fetchMemberships} = actions;

    if (!pending) {
      fetchMemberships(false); // no force refresh on render
    }

    const dataFilter = {
      card10: data => {
        const card10 = findBy('key', membershipTypes.data, 'CARD_10') || {};
        return data.filter(m => m.membershipTypeId === card10.id);
      },
      cardfull: data => {
        return data.filter(m => {
          const membershipType = findById(membershipTypes.data, m.membershipTypeId) || {};
          const r = m.participationCount / membershipType.maxParticipations;
          return r > 0.7;
        });
      },
      abo: data => {
        const abo = findBy('key', membershipTypes.data, 'SUBSCRIPTION') || {};
        return data.filter(m => m.membershipTypeId === abo.id);
      },
      trial: data => {
        const trial = findBy('key', membershipTypes.data, 'TRIAL') || {};
        return data.filter(m => m.membershipTypeId === trial.id);
      },
      extended: data => {
        const now = moment();
        return data.filter(m => m.validity.to && moment(m.validity.to) < now);
      },
      valid: data => {
        const now = moment();
        return data.filter(m => m.validity.from && moment(m.validity.from) <= now
          && (!m.validity.to || moment(m.validity.to) >= now));
      },
      search: data => {
        if (search === '') {
          return data;
        }
        const options = {
          shouldSort: false,
          tokenize: true,
          threshold: 0.2,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 1,
          keys: [
            'user.firstname',
            'user.lastname',
          ]
        };
        const fuse = new Fuse(data, options);
        return fuse.search(search);
      }
    };

    let filtered = data;
    for (const f in dataFilter) {
      if (filter[f]) {
        filtered = dataFilter[f](filtered);
      }
    }
    filtered.sort(comparingModFunc(m => m.user.firstname, m => m));

    const possibleData = {};
    for (const f in dataFilter) {
      possibleData[f] = [];
      if (!filter[f]) {
        possibleData[f] = dataFilter[f](filtered);
      }
    }

    const roles = viewPath(['currentUser', 'roles'], this.props) || {};
    const trainerOrAdmin = roles['TRAINER'] || roles['ADMIN'];

    const additionalActions = (
      <div>
        {
          trainerOrAdmin
            ? <Tooltip title='Mitgliedschaft erstellen' enterDelay={500}>
              <IconButton color='inherit' onClick={() => history.push(location.pathname + '/membership/new')}>
                <AddIcon/>
              </IconButton>
            </Tooltip>
            : undefined
        }
      </div>
    );

    return (
      <SimplePage additionalActions={additionalActions}>
        <PullToRefresh
          pending={pending}
          onRefresh={() => fetchMemberships(true)}>
          <Grid container spacing={0} justify='center' style={{width: '100%', margin: '0px'}}>
            <Grid item xs={12} md={10} className='memberships-textarea'>
              <Grid container spacing={16} style={{width: '100%', margin: '0px'}}>
                <Grid item xs={12}>
                  <Typography variant='h4' gutterBottom>
                    Mitgliedschaften
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    {'Insgesamt gibt es ' + data.length + ' Mitgliedschaften'}
                  </Typography>
                </Grid>
                <Grid item>
                  <BatchedButton
                    id='card10'
                    label='10er'
                    selected={filter.card10}
                    onClick={() => this.toggleFilter('card10')}
                    badgeContent={possibleData.card10.length}/>
                </Grid>
                <Grid item>
                  <BatchedButton
                    id='cardfull'
                    label='(fast) voll'
                    selected={filter.cardfull}
                    onClick={() => this.toggleFilter('cardfull')}
                    badgeContent={possibleData.cardfull.length}/>
                </Grid>
                <Grid item>
                  <BatchedButton
                    id='abo'
                    label='Abo'
                    selected={filter.abo}
                    onClick={() => this.toggleFilter('abo')}
                    badgeContent={possibleData.abo.length}/>
                </Grid>
                <Grid item>
                  <BatchedButton
                    id='trial'
                    label='Probem.'
                    selected={filter.trial}
                    onClick={() => this.toggleFilter('trial')}
                    badgeContent={possibleData.trial.length}/>
                </Grid>
                <Grid item>
                  <BatchedButton
                    id='extended'
                    label='Abgelaufen'
                    selected={filter.extended}
                    onClick={() => this.toggleFilter('extended')}
                    badgeContent={possibleData.extended.length}/>
                </Grid>
                <Grid item>
                  <BatchedButton
                    id='valid'
                    label='Gültig'
                    selected={filter.valid}
                    onClick={() => this.toggleFilter('valid')}
                    badgeContent={possibleData.valid.length}/>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id='search'
                    label='Suche nach Namen'
                    fullWidth
                    value={search}
                    onChange={this.setSearch}
                    type='search'
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={10}>
              <List>
                {
                  filtered.map((membership, key) => <MembershipItem key={key}
                                                                    className={key % 2 === 0 ? 'membership-odd' : undefined}
                                                                    membership={membership}/>)
                }
              </List>
            </Grid>
          </Grid>
        </PullToRefresh>
      </SimplePage>
    );
  }
}

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Memberships);