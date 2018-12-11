import reducer, {actions, initialState} from '../';

describe('password reducer', () => {

  let state;

  beforeEach(() => {
    state = initialState
  });

  describe('with CHANGE.PENDING action', () => {
    it('should only set state to pending', () => {
      // when
      const nextState = reducer(state, actions.password.change.pending());
      // then
      const expectedState = Object.assign({}, state, {change: Object.assign({}, state.change, {pending: true})});
      expect(nextState).toEqual(expectedState);
    });
  });

  describe('with CHANGE.SUCCESS action', () => {
    it('should set pending to false and update current profile list', () => {
      // when
      const nextState = reducer(state, actions.password.change.success());
      // then
      const expectedState = Object.assign({}, state, {change: Object.assign({}, state.change, {pending: false})});
      expect(nextState).toEqual(expectedState);
    });
  });

  describe('with CHANGE.ERROR action', () => {
    it('should set pending to false and update error message', () => {
      // given
      const error = new Error('Oops, something went wrong!');
      // when
      const nextState = reducer(state, actions.password.change.error(error));
      // then
      const expectedState = Object.assign({}, state, {change: Object.assign({}, state.change, {pending: false, error: error.message})});
      expect(nextState).toEqual(expectedState);
    });
  });

});
