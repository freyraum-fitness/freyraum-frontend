'use strict';
import {createActions, handleActions} from 'redux-actions';
import {
  getOwnProfile,
  changeProfilePicture,
  login as loginApiCall,
  createAccount as createAccountApiCall,
  getAllUsers as getAllUsersApiCall,
} from '../../service/profile';
import {updateSettings as updatePreferenceApiCall} from '../../service/settings';
import {setPath, assignPath, viewPath} from '../../utils/RamdaUtils';
import init from './../init.js';
import {showNotification} from '../notification';
import moment from 'moment';

const initialState = {
  pending: true, // load the current user initially
  user: undefined,
  users: {
    lastUpdate: undefined,
    pending: false,
    data: []
  },
  picture: {
    dialog: {
      open: false
    },
    temp: {
      dataUrl: undefined,
      file: undefined
    },
    pending: false,
    errorMessage: undefined
  },
  createAccount: {
    pending: false,
    error: '',
    data: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      matchingPassword: '',
      acceptAgb: false
    }
  },
  updatePreference: {
    pending: false,
    error: undefined
  }
};

export const actions = createActions({
  SHOW_REGISTRATION: undefined,
  PROFILE: {
    LOAD: {
      PENDING: undefined,
      SUCCESS: profile => profile,
      ERROR: error => error
    },
    ON_PROFILE_DETAILS_CHANGE: (path, value) => ({path: path, value: value}),
    PICTURE: {
      RESET: undefined,
      DIALOG: {
        OPEN: undefined,
        CLOSE: undefined
      },
      CHANGE_TEMP: temp => temp,
      SAVE: {
        PENDING: undefined,
        SUCCESS: undefined,
        ERROR: error => error
      }
    }
  },
  USERS: {
    PENDING: undefined,
    ERROR: error => error,
    SUCCESS: users => users
  },
  SET_LOGIN_REF: ref => ref,
  SHOULD_SCROLL_TO_LOGIN: shouldScroll => shouldScroll,
  CREATE_ACCOUNT: {
    PENDING: undefined,
    SUCCESS: profile => profile,
    ERROR: error => error,
    DATA_CHANGED: (id, value) => ({id: id, value: value}),
  },
  UPDATE_PREFERENCE: {
    SAVE: {
      PENDING: undefined,
      SUCCESS: answer => answer,
      ERROR: error => error
    }
  }
});

export const createAccount = (createData, onSuccess) =>
  dispatch => {
    dispatch(actions.createAccount.pending());
    return createAccountApiCall(createData)
      .then(() => {
        dispatch(actions.createAccount.success());
        onSuccess();
        dispatch(showNotification('Account erstellt', 'success'));
      })
      .catch(error => dispatch(actions.createAccount.error(error)));
  };

export const createAccountDataChanged = (id, value) =>
  dispatch => dispatch(actions.createAccount.dataChanged(id, value));

export const updateUsers = () => {
  return (dispatch, getState) => {
    console.warn(getState().profile.users)
    if (getState().profile.users.lastUpdate || getState().profile.users.pending) {
      return; // TODO update every other call/day
    }
    dispatch(actions.users.pending());
    return getAllUsersApiCall()
      .then(users => dispatch(actions.users.success(users)))
      .catch(error => dispatch(actions.users.error(error)));
  };
};

export const fetchOwnProfile = (filterOptions) =>
  dispatch => {
    dispatch(actions.profile.load.pending());
    return getOwnProfile(filterOptions)
      .then(profile => dispatch(actions.profile.load.success(profile)))
      .catch(error => dispatch(actions.profile.load.error(error)))
  };

export const onProfileDetailsChange = (path, value) => {
  return dispatch => dispatch(actions.profile.onProfileDetailsChange(path, value));
};

export const openProfilePictureChangeDialog = () => {
  return dispatch => {
    dispatch(actions.profile.picture.reset());
    dispatch(actions.profile.picture.dialog.open());
  }
};

export const closeProfilePictureChangeDialog = () => {
  return dispatch => dispatch(actions.profile.picture.dialog.close());
};

export const changeTempProfilePicture = temp => {
  return dispatch => dispatch(actions.profile.picture.changeTemp(temp));
};

export const saveProfilePicture = file => {
  return dispatch => {
    dispatch(actions.profile.picture.save.pending());
    return changeProfilePicture(file)
      .then(() => {
        dispatch(actions.profile.picture.save.success());
        dispatch(actions.profile.picture.dialog.close());
      })
      .catch(error => dispatch(actions.profile.picture.save.error(error)))
  }
};

export const updateSettings = data =>
  dispatch => {
    dispatch(actions.updatePreference.save.pending());
    return updatePreferenceApiCall(data)
      .then(() => {
        dispatch(actions.updatePreference.save.success(data));
      })
      .catch(error => dispatch(actions.updatePreference.save.error(error.message)));
  };

const updateUserPreferences = (state, preference) => {
  const preferences = viewPath(['user', 'preferences'], state);
  for (const idx in preferences) {
    if (preferences[idx].key === preference.key) {
      preferences[idx] = preference;
      return setPath(['user', 'preferences'], preferences, state);
    }
  }
  preferences.push(preference);
  return setPath(['user', 'preferences'], preferences, state);
};

export default handleActions({
  [actions.showLogin]: state => setPath(['showLogin'], true, state),
  [actions.showRegistration]: state => setPath(['showLogin'], false, state),

  [actions.profile.load.pending]: state => setPath(['pending'], true, state),
  [actions.profile.load.success]: (state, {payload}) =>
    assignPath([], {pending: false, user: payload, errorMessage: null}, state),
  [actions.profile.load.error]: (state, {payload}) =>
    assignPath([], {pending: false, errorMessage: payload.message}, state),
  [actions.profile.onProfileDetailsChange]: (state, {payload}) =>
    setPath(['user', ...payload.path], payload.value, state),

  // profile picture
  [actions.profile.picture.reset]: state =>
    setPath(['picture'], initialState.picture, state),
  [actions.profile.picture.dialog.open]: state =>
    setPath(['picture', 'dialog', 'open'], true, state),
  [actions.profile.picture.dialog.close]: state =>
    setPath(['picture', 'dialog', 'open'], false, state),
  [actions.profile.picture.changeTemp]: (state, {payload}) =>
    setPath(['picture', 'temp'], payload, state),
  [actions.profile.picture.save.pending]: state =>
    setPath(['picture', 'pending'], true, state),
  [actions.profile.picture.save.success]: state =>
    assignPath(['picture'], {pending: false, errorMessage: undefined}, state),
  [actions.profile.picture.save.error]: (state, {payload}) =>
    setPath(['picture', 'errorMessage'], payload.message, state),

  [actions.setLoginRef]: (state, {payload}) =>
    setPath(['loginRef'], payload, state),
  [actions.shouldScrollToLogin]: (state, {payload}) =>
    setPath(['shouldScrollToLogin'], payload, state),

  // create account
  [actions.createAccount.dataChanged]: (state, {payload}) =>
    setPath(['createAccount', 'data', payload.id], payload.value, state),
  [actions.createAccount.pending]: state =>
    assignPath(['createAccount'], {pending: true, error: undefined}, state),
  [actions.createAccount.success]: state =>
    assignPath(['createAccount'], {pending: false, error: undefined, data: initialState.createAccount.data}, state),
  [actions.createAccount.error]: (state, {payload}) =>
    assignPath(['createAccount'], {pending: false, error: payload.message}, state),

  // load users
  [actions.users.pending]: state =>
    assignPath(['users'], {pending: true, error: undefined}, state),
  [actions.users.success]: (state, {payload}) =>
    assignPath(['users'], {pending: false, data: payload, error: undefined, lastUpdate: moment()}, state),
  [actions.users.error]: (state, {payload}) =>
    assignPath(['users'], {pending: false, error: payload}, state),

  // save preferences
  [actions.updatePreference.save.pending]: state =>
    assignPath(['updatePreference'], {pending: true, error: undefined}, state),
  [actions.updatePreference.save.success]: (state, {payload}) => {
    const updatedState = assignPath(['updatePreference'], {pending: false, error: undefined}, state);
    return updateUserPreferences(state, payload);
  },
  [actions.updatePreference.save.error]: state =>
    assignPath(['updatePreference'], {pending: false, error: error}, state),

}, initialState);
