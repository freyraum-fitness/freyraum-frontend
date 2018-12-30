'use strict';
import {createActions, handleActions} from 'redux-actions';
import {setPath, assignPath} from './../../utils/RamdaUtils';
import {login as loginApiCall} from '../../service/login';
import init from './../init.js';

const initialState = {
  pending: false,
  error: undefined,
  data: {
    email: "",
    password: ""
  }
};

export const actions = createActions({
  LOGIN: {
    PENDING: undefined,
    ERROR: error => error,
    SUCCESS: undefined,
    DATA_CHANGED: (id, value) => ({id: id, value: value}),
  },
});


export const login = (loginData, onSuccess) =>
  dispatch => {
    dispatch(actions.login.pending());
    return loginApiCall(loginData)
      .then(() => {
        dispatch(actions.login.success());
        init(dispatch);
        onSuccess();
      })
      .catch(() => dispatch(actions.login.error("Fehler beim Anmelden. Stimmen E-Mail und Passwort?")));
  };

export const loginDataChanged = (id, value) =>
  dispatch => dispatch(actions.login.dataChanged(id, value));

export default handleActions({
  [actions.login.pending]: state => assignPath([], {pending: true, error: undefined}, state),
  [actions.login.success]: state => assignPath([], {pending: false, error: undefined}, state),
  [actions.login.error]: (state, {payload}) => assignPath([], {pending: false, error: payload}, state),
  [actions.login.dataChanged]: (state, {payload}) =>
    setPath(['data', payload.id], payload.value, state),
}, initialState)
