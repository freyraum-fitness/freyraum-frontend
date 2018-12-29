'use strict';
import {createActions, handleActions} from 'redux-actions';
import {
  getCurrentNews,
  getNews as getNewsApiCall,
  createNews as createNewsApiCall,
  updateNews as updateNewsApiCall,
  uploadPicture as uploadPictureApiCall,
} from '../../service/news';
import {assignPath, setPath} from '../../utils/RamdaUtils';
import {showNotification} from '../notification';
import * as Format from '../../utils/Format';
import moment from 'moment';

export const MODE = {
  CREATE: {
    title: 'neue News',
    readonly: false,
  },
  VIEW: {
    title: 'News',
    readonly: true,
  },
  MODIFY: {
    title: 'bearbeiten',
    readonly: false,
  }
};

const initialState = {
  pending: false,
  error: null,
  data: [],

  details: {
    pending: false,
    error: null,
    data: {
      title: '',
      teaser: '',
      text: '',
      validity: {
        from: null,
        to: null,
      },
    },
  },

  uploadPicture: {
    pending: false,
    error: null,
  },
};

const newNews = {
  title: 'Neues aus dem FreyRaum',
  teaser: 'Es gibt Neuigkeiten',
  text: '',
  validity: {
    from: moment().format(Format.TIMESTAMP_FORMAT),
    to: moment().format(Format.TIMESTAMP_FORMAT),
  }
};

export const actions = createActions({
  NEWS: {
    INIT: undefined,
    LOAD: {
      PENDING: undefined,
      SUCCESS: news => news,
      ERROR: error => error
    },
    DETAILS: {
      PENDING: undefined,
      SUCCESS: news => news,
      ERROR: error => error,
      ON_CHANGE: (path, value) => ({path: path, value: value}),
      RESET: undefined,
      SAVE: {
        PENDING: undefined,
        SUCCESS: news => news,
        ERROR: error => error,
      },
    },
    UPLOAD_PICTURE: {
      PENDING: undefined,
      SUCCESS: undefined,
      ERROR: error => error,
    }
  }
});

export const initNewNews = () =>
  dispatch => dispatch(actions.news.init());

export const fetchNews = (filterOptions) => {
  return dispatch => {
    dispatch(actions.news.load.pending());
    return getCurrentNews(filterOptions)
      .then(currentNews => dispatch(actions.news.load.success(currentNews)))
      .catch(error => dispatch(actions.news.load.error(error)))
  }
};

export const getNews = id => {
  return dispatch => {
    dispatch(actions.news.details.pending());
    return getNewsApiCall(id)
      .then(news => dispatch(actions.news.details.success(news)))
      .catch(error => dispatch(actions.news.details.error(error)))
  }
};

export const changeDetails = (path, value) =>
  dispatch => dispatch(actions.news.details.onChange(path, value));

export const resetDetails = () =>
  dispatch => dispatch(actions.news.details.reset());

export const saveDetails = news =>
  dispatch => {
    dispatch(actions.news.details.save.pending());
    const func = !!news.id ? updateNewsApiCall : createNewsApiCall;
    return func(news)
      .then(updatedNews => {
        dispatch(actions.news.details.save.success(updatedNews));
        dispatch(showNotification('Neuigkeiten gespeichert', 'success'));
      })
      .catch(error=> dispatch(actions.news.details.save.error(error)));
  };

export const uploadPicture = (id, data, onSuccess) =>
  dispatch => {
    dispatch(actions.news.uploadPicture.pending());
    return uploadPictureApiCall(id, data)
      .then(() => {
        dispatch(actions.news.uploadPicture.success());
        showNotification('Bild gespeichert', 'success');
        onSuccess();
      })
      .catch(error => {
        dispatch(actions.news.uploadPicture.error(error));
        showNotification('Bild konnte nicht gespeichert werden', 'error');
      });
};

const updateNews = (state, news = {}) => {
  const allNews = Object.assign([], state.data);
  let updatedState = state;
  let found = false;
  for (const idx in allNews) {
    if (allNews[idx].id === news.id) {
      allNews[idx] = news;
      updatedState = setPath(['data'], allNews, updatedState);
      found = true;
      break;
    }
  }
  // if course is new
  if (!found) {
    allNews.push(news);
    updatedState = setPath(['data'], allNews, updatedState);
  }
  updatedState =  setPath(['details', 'data'], news, updatedState);
  return setPath(['details', 'originalData'], news, updatedState);
};

export default handleActions({
  [actions.news.init]: state =>
    assignPath(['details'], {pending: false, error: null, data: newNews, originalData: newNews}, state),

  [actions.news.load.pending]: state => setPath(['pending'], true, state),
  [actions.news.load.success]: (state, {payload}) =>
    assignPath([], {pending: false, data: payload, error: null}, state),
  [actions.news.load.error]: (state, {payload}) =>
    assignPath([], {pending: false, error: payload.message}, state),

  [actions.news.details.pending]: state => setPath(['details', 'pending'], true, state),
  [actions.news.details.success]: (state, {payload}) => {
    const updatedState = assignPath(['details'], {pending: false, error: null}, state);
    return updateNews(updatedState, payload);
  },
  [actions.news.details.error]: (state, {payload}) =>
    assignPath(['details'], {pending: false, error: payload.message}, state),

  [actions.news.details.onChange]: (state, {payload}) =>
    setPath(['details', 'data', ...payload.path], payload.value, state),
  [actions.news.details.reset]: state =>
    setPath(['details', 'data'], state.details.originalData, state),

  // SAVE DETAILS
  [actions.news.details.save.pending]: state => setPath(['details', 'save', 'pending'], true, state),
  [actions.news.details.save.success]: (state, {payload}) => {
    const updatedState = assignPath(['details', 'save'], {pending: false, error: null}, state);
    return updateNews(updatedState, payload);
  },
  [actions.news.details.save.error]: (state, {payload}) =>
    assignPath(['details', 'save'], {pending: false, error: payload.message}, state),

  // UPLOAD PICTURE
  [actions.news.uploadPicture.pending]: state => setPath(['uploadPicture', 'pending'], true, state),
  [actions.news.uploadPicture.success]: state =>
    assignPath(['uploadPicture'], {pending: false, error: null}, state),
  [actions.news.uploadPicture.error]: (state, {payload}) =>
    assignPath(['uploadPicture'], {pending: false, error: payload.message}, state),

}, initialState);
