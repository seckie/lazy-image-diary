jest.mock('../../services/api');
jest.mock('../../services/file');
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
  readFile,
  uploadFile
} from '../../services/file';
import {
  SIGN_IN_SUCCESS,
  OAUTH_CALLBACK_SUCCESS,
  FILE_READ,
  FILE_HANDLE_ERROR
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
      await runSaga(sagaIO, oauthCallback).toPromise();
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

  describe('uploadFilesFromField saga', () => {
    let dispatched: any[] = [];
    const sagaIO = {
      dispatch: (action: any) => {
        dispatched.push(action)
      }
    };
    const TOKEN = 'token';
    const FILES: any[] = [
      { type: 'image/png'},
      { type: 'image/jpeg'}
    ];
    const NON_IMAGE_FILES: any[] = [
      { type: 'text/plain'},
      { type: 'text/javascript'}
    ];
    const ERROR = {
      message: 'error_message'
    };
    const readFileRes: any = {
      status: 'undone'
    };
    const readFileMock = (readFile as jest.Mock).mockImplementation(() => new Promise((resolve) => resolve(readFileRes)));
    const action: any = {
      payload: {
        files: FILES
      }
    };
    const invalidAction: any = {
      payload: {
        files: NON_IMAGE_FILES
      }
    };
    beforeEach(() => {
      dispatched = [];
      sessionStorage.setItem('accessToken', TOKEN);
    });
    afterEach(() => {
      readFileMock.mockClear();
      (uploadFile as jest.Mock).mockClear();
      sessionStorage.removeItem('accessToken');
    });

    it('do nothing if action.payload.files not existed', () => {
      const action: any = null;
      const gen = uploadFilesFromField(action);
      const expected = { done: true, value: undefined };
      expect(gen.next()).toEqual(expected);
      const action2: any = {
        payload: {}
      };
      const gen2 = uploadFilesFromField(action2);
      expect(gen2.next()).toEqual(expected);
    });

    it('do nothing if "files" don\'t include image files', async () => {
      await runSaga(sagaIO, uploadFilesFromField, invalidAction).toPromise();
      const expected: any = [];
      expect(dispatched).toEqual(expected);
    });

    it('call "readFile" with file for the number of "files" length', async () => {
      await runSaga(sagaIO, uploadFilesFromField, action).toPromise();
      expect(readFileMock).nthCalledWith(1, FILES[0]);
      expect(readFileMock).nthCalledWith(2, FILES[1]);
    });

    it('put FILE_READ action with payload for the number of "files" length', async () => {
      await runSaga(sagaIO, uploadFilesFromField, action).toPromise();
      const expected = [
        { type: FILE_READ, payload: readFileRes },
        { type: FILE_READ, payload: readFileRes }
      ];
      expect(dispatched.slice(0, 2)).toEqual(expected);
    });

    it('call uploadFile() with file & token for the number of "files" length', async () => {
      await runSaga(sagaIO, uploadFilesFromField, action).toPromise();
      const token = `Bearer ${TOKEN}`;
      expect(uploadFile).nthCalledWith(1, FILES[0], token);
      expect(uploadFile).nthCalledWith(2, FILES[1], token);
    });

    it('put FILE_HANDLE_ERROR if readFile() was failed', async () => {
      const expected = [
        {
          type: FILE_HANDLE_ERROR,
          payload: ERROR
        }
      ];
      (readFile as jest.Mock).mockImplementation(() => { throw ERROR });
      await runSaga(sagaIO, uploadFilesFromField, action).toPromise();
      expect(dispatched).toEqual(expected);
    });

    it('put FILE_HANDLE_ERROR if uploadFile() was failed', async () => {
      const expected = [
        {
          type: FILE_HANDLE_ERROR,
          payload: ERROR
        }
      ];
      (uploadFile as jest.Mock).mockImplementation(() => { throw ERROR });
      await runSaga(sagaIO, uploadFilesFromField, action).toPromise();
      expect(dispatched).toEqual(expected);
    });
  });
});
