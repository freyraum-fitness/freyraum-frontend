'use strict';
import {GET, POST, POST_IMAGE, PATCH} from '../HttpUtils';
const baseURL = __API__ + '/news';

export const getCurrentNews = () => GET(`${baseURL}`);

export const createNews = data => POST(`${baseURL}`, data);

export const getNews = id => GET(`${baseURL}/${id}`);

export const updateNews = data => PATCH(`${baseURL}/${data.id}`, data);

export const uploadPicture = (id, data) => POST_IMAGE(`${baseURL}/${id}/pictures`, data);

export const getPicture = (id, size) => GET(`${baseURL}/${id}/pictures/${size}`);