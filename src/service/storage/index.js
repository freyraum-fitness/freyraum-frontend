
import moment from 'moment';
import {TIMESTAMP_FORMAT} from "../../utils/Format";

export const readFromStorage = (key) => {
  const item = localStorage.getItem(key);
  if (!item) {
    return null;
  }
  const json = JSON.parse(item);
  if (json && moment().isBefore(moment(json.expires))) {
    return json.value;
  }
  return null;
};

export const writeToStorage = (key, value, expiresInMinutes) => {
  const item = {
    key: key,
    value: value,
    expires: moment().add(expiresInMinutes, 'minute').format(TIMESTAMP_FORMAT)
  };
  localStorage.setItem(key, JSON.stringify(item));
};
