'use strict';
import {createActions, handleActions} from 'redux-actions';
import {getCurrentExercises as getCurrentExercisesApiCall} from '../../service/exercises';
import {assignPath, setPath} from '../../utils/RamdaUtils';

const initialState = {
  pending: false,
  error: null,
  data: [],
};

export const actions = createActions({
  EXERCISES: {
    INIT: undefined,
    LOAD: {
      PENDING: undefined,
      SUCCESS: news => news,
      ERROR: error => error
    }
  }
});

export const fetchCurrentExercises = (filterOptions) => {
  return dispatch => {
    dispatch(actions.exercises.load.pending());
    return getCurrentExercisesApiCall(filterOptions)
      .then(currentNews => dispatch(actions.exercises.load.success(currentNews)))
      .catch(error => dispatch(actions.exercises.load.error(error)))
  }
};

export default handleActions({

  [actions.exercises.load.pending]: state => setPath(['pending'], true, state),
  [actions.exercises.load.success]: (state, {payload}) =>
    assignPath([], {pending: false, data: payload, error: null}, state),
  [actions.exercises.load.error]: (state, {payload}) =>
    assignPath([], {pending: false, error: payload.message}, state),

}, initialState);
