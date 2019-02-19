'use strict';
import {GET} from '../HttpUtils';
const baseURL = __API__ + '/exercises';

export const getCurrentExercises = () => GET(`${baseURL}`);
