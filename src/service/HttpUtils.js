'use strict';
import {Cookies} from 'react-cookie';
import moment from 'moment';
const baseURL = __API__;

const cookies = new Cookies();
const basicHeader = btoa('freyaFitnessWebApp:secret');

const acceptJsonHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

const securityHeaders = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': '*',
};

let _tokenData = null;
const getTokenData = () => {
  if (!_tokenData) {
    _tokenData = cookies.get('token_data');
  }
  return _tokenData;
};

const setTokenData = tokenData => {
  _tokenData = tokenData;
  cookies.set('token_data', tokenData, {path: '/', secure: true, expires: moment().add(2, 'years').toDate()});
};

const getAccessTokenHeader = () => {
  const tokenData = getTokenData();
  if (tokenData && tokenData['access_token']) {
    return {'Authorization': 'Bearer   ' + tokenData['access_token']};
  }
};

const removeTokenData = () => {
  _tokenData = null;
  cookies.remove('token_data', {path: '/'});
};

const toEncodedBody = (data) => Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');

const updateTokenData = data =>
  fetch(`${baseURL}/oauth/token`,
    {
      method: 'POST',
      headers: {
        ...securityHeaders,
        'Authorization': 'Basic ' + basicHeader,
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: toEncodedBody(data)
    }
  ).then(response => {
    if (!response.ok) {
      throw new Error("Error fetching token");
    }
    return response.json()
      .then(tokenData => {
        setTokenData(tokenData);
        return new Promise(resolve => resolve(tokenData));
      });
  });

let updatingAccessToken = undefined;
const updateAccessToken = () => {
  // if multiple calls get a 401 and try to update the token data,
  // do not request a new token multiple times!
  // Therefore return the same promise at this point.
  if (updatingAccessToken) {
    return updatingAccessToken;
  }
  const tokenData = getTokenData();
  if (tokenData && tokenData['refresh_token']) {
    updatingAccessToken = updateTokenData({
      refresh_token: tokenData['refresh_token'],
      grant_type: 'refresh_token'
    });
  } else {
    updatingAccessToken = new Promise((resolve, reject) => reject("No refresh token available"));
  }
  return updatingAccessToken.then(tokenData => {
    updatingAccessToken = undefined;
    return new Promise(resolve => resolve(tokenData))
  }).catch(error => {
    updatingAccessToken = undefined;
    console.info("Could not refresh the oauth token => delete cookie");
    removeTokenData();
    return new Promise((resolve, reject) => reject(error))
  });
};

const fetchWithToken = (url, params, retry = true) =>
  fetch(url, params)
    .then(async response => {
      // 401 indicates that the access token is expired
      if (response.status === 401 && retry && !!getTokenData()) {
        return updateAccessToken()
          .then(() => {
            // update headers with new token
            params.headers = {
              ...params.headers,
              ...getAccessTokenHeader()
            };
            return fetchWithToken(url, params, false);
          })
          .catch(e => {
            console.error("error while fetching token => retry once", e);
            params.headers.Authorization = null;
            return fetchWithToken(url, params, false);
          });
      }
      if (!response.ok) {
        let error = 'Es ist ein unerwarteter Fehler aufgetreten.';
        await response.json()
          .then(error => {
            if (!!error.message) {
              error = error.message;
            }
            console.warn("[" + response.status + "]", "Error message", error);
            throw new Error(error);
          });
      }
      return new Promise(resolve => resolve(response));
    });

export const LOGIN = (loginData = {}) =>
  updateTokenData({
    username: loginData.email,
    password: loginData.password,
    grant_type: 'password'
  });

export const GET = url => fetchWithToken(url,
  {
    headers: {
      ...securityHeaders,
      ...getAccessTokenHeader()
    },
    credentials: 'include'
  })
  .then(response => response.json());

export const PUT = (url, data) => fetchWithToken(url,
  {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      ...acceptJsonHeaders,
      ...securityHeaders,
      ...getAccessTokenHeader()
    },
    credentials: 'include'
  })
  .then(response => response.json());

export const POST = (url, data) => fetchWithToken(url,
  {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      ...acceptJsonHeaders,
      ...securityHeaders,
      ...getAccessTokenHeader()
    },
    credentials: 'include'
  })
  .then(response => response.json());

export const PATCH = (url, data) => fetchWithToken(url,
  {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: {
      ...acceptJsonHeaders,
      ...securityHeaders,
      ...getAccessTokenHeader()
    },
    credentials: 'include'
  })
  .then(response => response.json());

export const DELETE = url => fetchWithToken(url,
  {
    method: 'DELETE',
    headers: {
      ...acceptJsonHeaders,
      ...securityHeaders,
      ...getAccessTokenHeader()
    },
    credentials: 'include'
  })
  .then(response => response.json());

export const GET_IMAGE = url => fetchWithToken(url,
  {
    method: 'GET',
    headers: {
      ...securityHeaders,
      ...getAccessTokenHeader()
    },
    credentials: 'include'
  })
  .then(response => response.blob());

export const POST_IMAGE = (url, data) => fetchWithToken(url,
  {
    method: 'POST',
    body: data,
    headers: {
      ...securityHeaders,
      ...getAccessTokenHeader()
    },
    credentials: 'include'
  })
  .then(response => response.json());