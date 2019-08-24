jest.mock('axios');
import axios, { AxiosRequestConfig } from 'axios';
import {
  apiSignIn,
  apiOAuthCallback
} from '../../services/api';
import {
  API_OAUTH_URL,
  API_OAUTH_CALLBACK_URL,
  LOCAL_OAUTH_CALLBACK_URL
} from '../../constants';

describe('api', () => {
  const mockMessage = 'Axios response';
  jest.spyOn(axios, 'get').mockImplementation((
    url: string,
    config?: AxiosRequestConfig
  ):any => (
    new Promise((resolve) => resolve({
      url,
      config,
      statusText: mockMessage 
    }))
  ));

  describe('apiSignIn', () => {
    const url = `${API_OAUTH_URL}/?callback_url=${encodeURIComponent(LOCAL_OAUTH_CALLBACK_URL)}`
    it('return Axious response', async () => {
      const res = await apiSignIn();
      const expected = {
        url,
        statusText: mockMessage
      };
      expect(res).toEqual(expected);
    });
  });

  describe('apiOAuthCallback', () => {
    const OAUTH_TOKEN = 'token';
    const OAUTH_TOKEN_SECRET = 'tokensecret';
    const VERIFIER = 'verifier';
    const url = `${API_OAUTH_CALLBACK_URL}?oauthToken=${OAUTH_TOKEN}&oauthTokenSecret=${OAUTH_TOKEN_SECRET}&oauth_verifier=${VERIFIER}`
    const originalWindow = window;
    beforeEach(() => {
      window.sessionStorage.setItem('oauthToken', OAUTH_TOKEN);
      window.sessionStorage.setItem('oauthTokenSecret', OAUTH_TOKEN_SECRET);
      // mock window.location.search
      window = Object.create(window);
      Object.defineProperty(window, 'location', {
        value: {
          search: `?oauth_verifier=${VERIFIER}`
        }
      });
    });

    afterEach(() => {
      window = originalWindow;
    });

    it('return Axious response', async () => {
      const res = await apiOAuthCallback();
      const expected = {
        url,
        statusText: mockMessage
      };
      expect(res).toEqual(expected);
    });
  });
});
