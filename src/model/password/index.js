'use strict';
import {createActions, handleActions} from 'redux-actions';
import {setPath, assignPath} from '../../utils/RamdaUtils';
import {
  changePassword as changePasswordApiCall,
  passwordForgotten as passwordForgottenApiCall,
  resetPassword as resetPasswordApiCall
} from '../../service/password';
import {
  showNotification
} from './../notification';

export  const initialState = {
  change: {
    pending: false,
    error: undefined,
    data: {
      oldPassword: '',
      password: '',
      matchingPassword: ''
    }
  },
  forgotten: {
    pending: false,
    error: undefined,
    data: {
      email: '',
    }
  },
  reset: {
    pending: false,
    error: undefined,
    data: {
      password: '',
      matchingPassword: ''
    }
  }
};

export const actions = createActions({
  PASSWORD: {
    CHANGE: {
      PENDING: undefined,
      SUCCESS: undefined,
      ERROR: error => error,
    },
    FORGOTTEN: {
      PENDING: undefined,
      SUCCESS: undefined,
      ERROR: error => error,
    },
    RESET: {
      PENDING: undefined,
      SUCCESS: undefined,
      ERROR: error => error,
    },
    CHANGING: (path, value) => ({path: path, value: value})
  }
});

export const changePassword = (changePasswordData, onSuccess) =>
  dispatch => {
    dispatch(actions.password.change.pending());
    return changePasswordApiCall(changePasswordData)
      .then(() => {
        dispatch(actions.password.change.success());
        onSuccess();
        dispatch(showNotification('Passwort geändert', 'success'));
      })
      .catch(error => dispatch(actions.password.change.error(error)));
  };

export const passwortForgotten = (passwordForgottenData, onSuccess) =>
  dispatch => {
    dispatch(actions.password.forgotten.pending());
    return passwordForgottenApiCall(passwordForgottenData)
      .then(() => {
        dispatch(actions.password.forgotten.success());
        onSuccess();
        dispatch(showNotification('E-Mail verschickt', 'success'));
      })
      .catch(error => dispatch(actions.password.forgotten.error(error)));
  };

export const resetPassword = (resetPasswordData, onSuccess) =>
  dispatch => {
    dispatch(actions.password.reset.pending());
    return resetPasswordApiCall(resetPasswordData)
      .then(() => {
        dispatch(actions.password.reset.success());
        onSuccess();
        dispatch(showNotification('Passwort zurückgesetzt', 'success'));
      })
      .catch(error => dispatch(actions.password.reset.error(error)));
  };

export const onChangePasswordDataChange = (path, value) =>
    dispatch => dispatch(actions.password.changing(['change' , 'data', ...path], value));

export const onPasswordForgottenDataChange = (path, value) =>
    dispatch => dispatch(actions.password.changing(['forgotten', 'data', ...path], value));

export const onResetPasswordDataChange = (path, value) =>
    dispatch => dispatch(actions.password.changing(['reset', 'data', ...path], value));

export default handleActions({
  // change
  [actions.password.change.pending]: state => setPath(['change', 'pending'], true, state),
  [actions.password.change.success]: state =>
    assignPath(['change'], {pending: false, data: initialState.change.data, error: undefined}, state),
  [actions.password.change.error]: (state, {payload}) =>
    assignPath(['change'], {pending: false, error: payload.message}, state),

  // forgotten
  [actions.password.forgotten.pending]: state => setPath(['forgotten', 'pending'], true, state),
  [actions.password.forgotten.success]: state =>
    assignPath(['forgotten'], {pending: false, data: initialState.forgotten.data, error: undefined}, state),
  [actions.password.forgotten.error]: (state, {payload}) =>
    assignPath(['forgotten'], {pending: false, error: payload.message}, state),

  // reset
  [actions.password.reset.pending]: state => setPath(['reset', 'pending'], true, state),
  [actions.password.reset.success]: state =>
    assignPath(['reset'], {pending: false, data: initialState.reset.data, error: undefined}, state),
  [actions.password.reset.error]: (state, {payload}) =>
    assignPath(['reset'], {pending: false, error: payload.message}, state),

  // change data
  [actions.password.changing]: (state, {payload}) => setPath(payload.path, payload.value, state),
}, initialState);
