import {fetchOwnProfile} from './profile';
import {fetchCourses} from './courses';
import {fetchCourseTypes} from './coursetypes';
import {fetchMembershipTypes} from './membershiptypes';
import {fetchNews} from './news';
import {fetchCurrentExercises} from './exercises';

export default (dispatch) => {
  dispatch(fetchOwnProfile());
  dispatch(fetchCourses());
  dispatch(fetchCourseTypes());
  dispatch(fetchMembershipTypes());
  dispatch(fetchNews());
  dispatch(fetchCurrentExercises());
}
