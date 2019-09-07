import * as React from 'react';
import { shallow } from 'enzyme';
import { OAuthCallback, mapStateToProps, mapDispatchToProps } from '../../containers/OAuthCallback';
import actions from '../../actions';

describe('OAuthCallback', () => {
  const TOKEN = '';
  const USER = {};
  const NEXT_URL = '/create-diary';
  const historyReplace = jest.fn();
  const props: any = {
    history: {
      replace: historyReplace
    },
    oauthCallback: jest.fn(),
    accessToken: TOKEN,
    user: USER
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
    const spy = jest.spyOn(actions, 'oauthCallback').mockImplementation((): any => RES);
    it('oauthCallback() method calls dispatched oauthCallback()', () => {
      props.oauthCallback();
      expect(spy).toBeCalled();
      expect(dispatch).toBeCalledWith(RES);
    });
  });
  describe('componentDidMount', () => {
    it('props.oauthCallback() should be called', () => {
      shallow(<OAuthCallback {...props} />);
      expect(props.oauthCallback).toBeCalled();
    });
  });
  describe('componentDidUpdate', () => {
    it('call history.replace() if accessToken exists', () => {
      const el = shallow(<OAuthCallback {...props} />);
      el.setProps({ accessToken: 'token2' });
      expect(historyReplace).toBeCalledWith(NEXT_URL);
    });
    it('not call history.replace() if accessToken doesn\'t exists', () => {
      const historyReplaceLocal = jest.fn();
      const localProps = {
        ...props,
        history: {
          replace: historyReplaceLocal
        },
        token: 'token'
      };
      const el = shallow(<OAuthCallback {...localProps} />);
      el.setProps({ accessToken: '' });
      expect(historyReplaceLocal).not.toBeCalledWith(NEXT_URL);
    });
  });
});
