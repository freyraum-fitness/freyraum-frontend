import reducer, {actions, initialState} from '../';
import {setPath} from './../../../utils/RamdaUtils'

describe('membership reducer', () => {

  let state;

  beforeEach(() => {
    state = initialState
  });

  describe('with CREATE_MEMBERSHIP.ON_DATA_CHANGED action', () => {

    it('should only set state to show: true', () => {
      const nextState = reducer(state, actions.createMembership.onDataChanged(['any', 'path'], 'foo'));

      const expectedState = setPath(['create', 'data', 'any', 'path'], 'foo', state);

      expect(nextState).toEqual(expectedState);
    });
  });

});
