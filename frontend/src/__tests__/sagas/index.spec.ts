jest.mock('../../services/api');
import { runSaga } from 'redux-saga';
import {
  signIn,
  oauthCallback,
  uploadFilesFromField,
} from '../../sagas';
import {
  apiSignIn,
  apiOAuthCallback
} from '../../services/api';
import {
  SIGN_IN_SUCCESS,
  OAUTH_CALLBACK_SUCCESS
} from '../../constants';

describe('Sagas', () => {
  describe('signIn saga', () => {
    const dispatched: any[] = [];
    const sagaIO = {
      dispatch: (action: any) => dispatched.push(action),
    };
    const res = { data: 'data' };
    const apiSignInMock = (apiSignIn as jest.Mock).mockImplementation((): any => res);

    beforeAll(async () => {
      await runSaga(sagaIO, signIn).toPromise();
    });
    afterAll(() => {
      apiSignInMock.mockClear();
    });
    it('apiSignIn() to be called', () => {
      expect(apiSignInMock).toBeCalled();
    });
    it('put SIGN_IN_SUCCESS action with payload', () => {
      const expectedAction = {
        type: SIGN_IN_SUCCESS,
        payload: res.data
      };
      expect(dispatched).toEqual([expectedAction]);
    });
  });

  describe('oauthCallback saga', () => {
    const dispatched: any[] = [];
    const sagaIO = {
      dispatch: (action: any) => dispatched.push(action)
    };
    const TOKEN = 'token';
    const res = {
      data: {
        accessToken: TOKEN
      }
    };
    const apiOAuthCallbackMock = (apiOAuthCallback as jest.Mock).mockImplementation(() => res);

    beforeAll(async () => {
      await runSaga(sagaIO, oauthCallback);
    });
    afterAll(() => {
      apiOAuthCallbackMock.mockClear();
    });

    it('apiOAuthCallback() to be called', () => {
      expect(apiOAuthCallbackMock).toBeCalled();
    });
    it('"accessToken" should be set into session Storage', () => {
      const token = sessionStorage.getItem('accessToken');
      expect(token).toBe(TOKEN);
    });
    it('put OAUTH_CALLBACK_SUCCESS action with payload', () => {
      const expected = {
        type: OAUTH_CALLBACK_SUCCESS,
        payload: res.data
      };
      expect(dispatched).toEqual([ expected ]);
    });
  });
});
