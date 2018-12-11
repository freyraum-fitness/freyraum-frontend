import reducer, {actions} from '../';

describe('Drawer reducer', () => {

  describe('with OPEN_DRAWER action', () => {
    it('should set open to true', () => {
      // when
      const nextState = reducer({open: false}, actions.openDrawer());
      // then
      expect(nextState).toEqual({open: true});
    });
  });

  describe('with CLOSE_DRAWER action', () => {
    it('should set open to false', () => {
      // when
      const nextState = reducer({open: true}, actions.closeDrawer());
      // then
      expect(nextState).toEqual({open: false});
    });
  });

});
