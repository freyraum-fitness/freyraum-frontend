'use strict';
import {createActions, handleActions} from 'redux-actions';
import {setPath} from './../../utils/RamdaUtils';

const initialState = {
  open: false,
};

export const actions = createActions({
  OPEN_DRAWER: undefined,
  CLOSE_DRAWER: undefined,
});

export const openDrawer = () =>
    dispatch => dispatch(actions.openDrawer());

export const closeDrawer = () =>
    dispatch => dispatch(actions.closeDrawer());

export default handleActions({
  [actions.openDrawer]: state => setPath(['open'], true, state),
  [actions.closeDrawer]: state => setPath(['open'], false, state)
}, initialState)
