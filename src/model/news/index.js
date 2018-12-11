import {createActions, handleActions} from 'redux-actions';
import {getNews} from '../../service/news';
import {assignPath, setPath} from '../../utils/RamdaUtils';

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
  data: []
};

export const actions = createActions({
  NEWS: {
    LOAD: {
      PENDING: undefined,
      SUCCESS: news => news,
      ERROR: error => error
    },
    CREATE: {
      PENDING: undefined,
      SUCCESS: news => news,
      ERROR: error => error
    }
  }
});

export const fetchNews = (filterOptions) => {
  return dispatch => {
    dispatch(actions.news.load.pending());
    return getNews(filterOptions)
      .then(profile => dispatch(actions.news.load.success(profile)))
      .catch(error => dispatch(actions.news.load.error(error)))
  }
};

export const createNews = filterOptions => {
  return dispatch => {
    dispatch(actions.news.create.pending());
    dispatch(actions.news.newsDetails.show());
    return createNewNews(filterOptions)
      .then(course => dispatch(actions.news.create.success(course)))
      .catch(error => dispatch(actions.news.create.error(error)));
  };
};

export default handleActions({
  [actions.news.load.pending]: state => setPath(['pending'], true, state),
  [actions.news.load.success]: (state, {payload}) =>
    assignPath([], {pending: false, data: payload, errorMessage: null}, state),
  [actions.news.load.error]: (state, {payload}) =>
    assignPath([], {pending: false, errorMessage: payload.message}, state),

  [actions.news.create.pending]: state => setPath(['pending'], true, state),
  [actions.news.create.success]: (state, {payload}) =>
    assignPath([], {pending: false, data: payload, errorMessage: null}, state),
  [actions.news.create.error]: (state, {payload}) =>
    assignPath([], {pending: false, errorMessage: payload.message}, state),
}, initialState);
