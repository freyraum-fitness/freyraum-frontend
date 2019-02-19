'use strict';

export const getCurrentNews = (param) => {
  return new Promise((resolve, reject) => {
    if(param instanceof Error) {
      reject(param)
    } else {
      resolve([{id: 'news1'}, {id: 'news2'}]);
    }
  })
};
