'use strict';
import {POST} from '../HttpUtils';
const baseURL = __API__;

export const changePassword = data => POST(`${baseURL}/password/change`, data);

export const passwordForgotten = (data) => POST(`${baseURL}/password/forgot`, data);

export const resetPassword = (data) => POST(`${baseURL}/password/reset`, data);
