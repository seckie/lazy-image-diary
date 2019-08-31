import reducer from '../../reducers';
import {
  SIGN_IN_SUCCESS
} from '../../constants';
import { OutgoingMessage } from 'http';

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
    let result: any = {};
    const pushStateSpy = jest.spyOn(history, 'pushState').mockImplementation((data: any, title: string, url?: string | null) => {
      result = { data, title, url }
    });
    const TITLE = 'Upload images';
    
    reducer(undefined, action);
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
});
