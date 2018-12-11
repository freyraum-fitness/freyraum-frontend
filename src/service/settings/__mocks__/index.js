'use strict';

export const updateSettings = (param) => {
  return new Promise((resolve, reject) => {
    if(param instanceof Error) {
      reject(param)
    } else {
      resolve({message: 'Preference saved'});
    }
  })
};
