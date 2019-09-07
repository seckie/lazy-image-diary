import * as React from 'react';
import { shallow } from 'enzyme';
import { mapStateToProps, mapDispatchToProps } from '../../containers/Default';
import { Default } from '../../containers/Default';
import actions from '../../actions';

describe('Default', () => {
  const props = {
    onClickSignIn: jest.fn()
  };
  describe('mapStateToProps', () => {
    const state = {
      test: 'test'
    };
    it('just return state without mutation', () => {
      expect(mapStateToProps(state)).toEqual(state);
    });
  });
  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);
    const RES = 'sign in response';
    const signInSpy = jest.spyOn(actions, 'signIn').mockImplementation((): any => RES);
    it('onClickSignIn() method calls dispatched signIn()', () => {
      props.onClickSignIn();
      expect(signInSpy).toBeCalled();
      expect(dispatch).toBeCalledWith(RES);
    });
  });
  describe('render', () => {
    it('render sign-in button', () => {
      const el = shallow(<Default {...props} />);
      expect(el.find('.btn-evernote-signin')).toHaveLength(1);
    });
  });
});
