'use react';
import React from 'react';
import compose from 'recompose/compose';
import connect from 'react-redux/es/connect/connect';
import {bindActionCreators} from 'redux';
import {fetchCurrentExercises} from '../../model/exercises';
import Grid from '@material-ui/core/Grid';
import SimplePage from '../SimplePage';
import PullToRefresh from '../../components/PullToRefresh';

class PersonalRecordDetails extends React.Component {
  
  componentWillUpdate(nextProps, nextState, nextContext) {
    this.refresh({force: false});
  }

  refresh = ({force = false}) => {
    this.props.actions.fetchCurrentExercises({force: force})
  };
  
  render() {
    const {pending} = this.props;
    
    return (
      <SimplePage>
        <PullToRefresh
          pending={pending}
          onRefresh={() => this.refresh({force: true})}>
          <Grid container spacing={16} justify='center' style={{width: '100%', margin: '0px', padding: '16px 0 0'}}>
            <Grid item xs={12}>
              Hello
            </Grid>
          </Grid>
        </PullToRefresh>
      </SimplePage>
    )
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
    fetchCurrentExercises: fetchCurrentExercises,
  }, dispatch),
  dispatch
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(PersonalRecordDetails);