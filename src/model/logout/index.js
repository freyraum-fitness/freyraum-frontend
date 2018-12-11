'use strict';
import {Cookies} from 'react-cookie';
import {actions as profileActions} from './../profile';

const cookies = new Cookies();

export const logout = onSuccess => {
  return dispatch => {
    cookies.remove('token_data', {path: '/'});
    dispatch(profileActions.profile.load.success(undefined));
    if (onSuccess) {
      onSuccess();
    }
  }
};
