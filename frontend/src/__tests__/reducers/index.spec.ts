import reducer from '../../reducers';
import {
  SIGN_IN_SUCCESS, OAUTH_CALLBACK_SUCCESS
} from '../../constants';

describe('reducer', () => {
  describe('SIGN_IN_SUCCESS action type', () => {
    const OAUTH_TOKEN = 'token';
    const OAUTH_TOKEN_SECRET = 'token_secret';
    const AUTHORIZE_URL = 'url';
    const action = {
      type: SIGN_IN_SUCCESS,
      payload: {
        oauthToken: OAUTH_TOKEN,
        oauthTokenSecret: OAUTH_TOKEN_SECRET,
        authorizeUrl: AUTHORIZE_URL
      }
    };
    const pushStateSpy = jest.spyOn(history, 'pushState').mockImplementation(() => null);
    const TITLE = 'Upload images';
    beforeAll(() => {
      reducer(undefined, action);
    });
    afterAll(() => {
      sessionStorage.removeItem('oauthToken');
      sessionStorage.removeItem('oauthTokenSecret');
      pushStateSpy.mockClear();
    });
    it('sessionStorage has "oauthToken" item after the action', () => {
      expect(sessionStorage.getItem('oauthToken')).toBe(OAUTH_TOKEN);
    });
    it('sessionStorage has "oauthToken" item after the action', () => {
      expect(sessionStorage.getItem('oauthToken')).toBe(OAUTH_TOKEN);
    });
    it('pushState should be called', () => {
      expect(pushStateSpy).toBeCalledWith(null, TITLE, AUTHORIZE_URL);
    });
  });

  describe('OAUTH_CALLBACK_SUCCESS action type', () => {
    const ACCESS_TOKEN = 'token';
    const USER = { name: 'test '};
    const action = {
      type: OAUTH_CALLBACK_SUCCESS,
      payload: {
        accessToken: ACCESS_TOKEN,
        user: USER
      }
    };
    let res: any;
    beforeAll(() => {
      sessionStorage.setItem('oauthToken', 'token');
      sessionStorage.setItem('oauthTokenSecret', 'token_secret');
      res = reducer(undefined, action);
    });
    it('sessionStorage doesn\'t have "oauthToken" item after the action', () => {
      expect(sessionStorage.getItem('oauthToken')).toBe(null);
    });
    it('sessionStorage doesn\'t have "oauthTokenSecret" item after the action', () => {
      expect(sessionStorage.getItem('oauthToken')).toBe(null);
    });
    it('return new state updated with accessToken and user', () => {
      const expected = {
        ...res,
        accessToken: ACCESS_TOKEN,
        user: USER
      };
      expect(res).toEqual(expected);
    });
  });

  describe('OAUTH_CALLBACK_SUCCESS action type', () => {
    it('', () => {

    });
  });

  describe('OAUTH_CALLBACK_SUCCESS action type', () => {
    it('', () => {

    });
  });

  describe('OAUTH_CALLBACK_SUCCESS action type', () => {
    it('', () => {

    });
  });
});
