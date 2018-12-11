import {
  showCreateMembership,
  hideCreateMembership,
  onCreateMembershipDataChanged,
  actions
} from '../';

jest.mock('../../../service/membershiptypes');

describe('membership actions', () => {

  let dispatchMock;
  let getMockState;

  beforeEach(() => {
    dispatchMock = jest.fn();
    getMockState = () => {};
  });

  describe('onCreateMembershipDataChange', () => {
    it('should dispatch SHOW action', () => {
      const somePath = ['foo', 'bar'];
      const value = 'test';
      onCreateMembershipDataChanged(somePath, value)(dispatchMock, getMockState);
      expect(dispatchMock.mock.calls[0][0])
        .toEqual(actions.createMembership.onDataChanged(somePath, value));
    });
  });

});
