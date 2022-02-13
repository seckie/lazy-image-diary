/* eslint-disable import/first */
jest.mock("../../services/api");
jest.mock("../../services/file");
import { runSaga } from "redux-saga";
import { takeEvery } from "redux-saga/effects";
import {
  signIn,
  oauthCallback,
  readFilesFromField,
  uploadFilesSaga
} from "../../sagas";
import rootSaga from "../../sagas";
import { apiSignIn, apiOAuthCallback } from "../../services/api";
import { readFile, uploadFile } from "../../services/file";
import {
  SIGN_IN_SUCCESS,
  OAUTH_CALLBACK_SUCCESS,
  FILE_READ,
  FILE_HANDLE_ERROR,
  UPLOAD_STARTED,
  UPLOAD_COMPLETE,
  SIGN_IN,
  OAUTH_CALLBACK,
  FILE_FIELD_ON_CHANGE,
  UPLOAD_START
} from "../../constants";

describe("Sagas", () => {
  describe("root saga", () => {
    const saga = rootSaga();
    it("1st yield value takes SIGN_IN action", () => {
      const expected = takeEvery(SIGN_IN, signIn);
      expect(saga.next().value).toEqual(expected);
    });
    it("2nd yield value takes OAUTH_CALLBACK action", () => {
      const expected = takeEvery(OAUTH_CALLBACK, oauthCallback);
      expect(saga.next().value).toEqual(expected);
    });
    it("3rd yield value takes FILE_FIELD_ON_CHANGE action", () => {
      const expected = takeEvery(FILE_FIELD_ON_CHANGE, readFilesFromField);
      expect(saga.next().value).toEqual(expected);
    });
    it("4th yield value takes UPLOAD_START action", () => {
      const expected = takeEvery(UPLOAD_START, uploadFilesSaga);
      expect(saga.next().value).toEqual(expected);
    });
  });

  xdescribe("signIn saga", () => {
    const dispatched: any[] = [];
    const sagaIO = {
      dispatch: (action: any) => dispatched.push(action)
    };
    const res = { data: "data" };
    const apiSignInMock = (apiSignIn as jest.Mock).mockImplementation(
      (): any => res
    );

    beforeAll(async () => {
      await runSaga(sagaIO, signIn).toPromise();
    });
    afterAll(() => {
      apiSignInMock.mockClear();
    });
    it("apiSignIn() to be called", () => {
      expect(apiSignInMock).toBeCalled();
    });
    it("put SIGN_IN_SUCCESS action with payload", () => {
      const expectedAction = {
        type: SIGN_IN_SUCCESS,
        payload: res.data
      };
      expect(dispatched).toEqual([expectedAction]);
    });
  });

  xdescribe("oauthCallback saga", () => {
    const dispatched: any[] = [];
    const sagaIO = {
      dispatch: (action: any) => dispatched.push(action)
    };
    const TOKEN = "token";
    const res = {
      data: {
        accessToken: TOKEN
      }
    };
    const apiOAuthCallbackMock = (apiOAuthCallback as jest.Mock).mockImplementation(
      () => res
    );

    beforeAll(async () => {
      await runSaga(sagaIO, oauthCallback).toPromise();
    });
    afterAll(() => {
      apiOAuthCallbackMock.mockClear();
    });

    it("apiOAuthCallback() to be called", () => {
      expect(apiOAuthCallbackMock).toBeCalled();
    });
    it('"accessToken" should be set into session Storage', () => {
      const token = sessionStorage.getItem("accessToken");
      expect(token).toBe(TOKEN);
    });
    it("put OAUTH_CALLBACK_SUCCESS action with payload", () => {
      const expected = {
        type: OAUTH_CALLBACK_SUCCESS,
        payload: res.data
      };
      expect(dispatched).toEqual([expected]);
    });
  });

  describe("readFilesFromField saga", () => {
    let dispatched: any[] = [];
    const sagaIO = {
      dispatch: (action: any) => {
        dispatched.push(action);
      }
    };
    const TOKEN = "token";
    const FILES: any[] = [{ type: "image/png" }, { type: "image/jpeg" }];
    const NON_IMAGE_FILES: any[] = [
      { type: "text/plain" },
      { type: "text/javascript" }
    ];
    const ERROR = {
      message: "error_message"
    };
    const readFileRes: any = {
      status: "undone"
    };
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
    let readFileMock: jest.Mock;
    let uploadFileMock: jest.Mock;
    beforeEach(() => {
      readFileMock = (readFile as jest.Mock).mockImplementation(
        (f: any) =>
          new Promise(resolve => {
            resolve({ ...readFileRes, ...f });
          })
      );
      dispatched = [];
      sessionStorage.setItem("accessToken", TOKEN);
    });
    afterEach(() => {
      readFileMock.mockClear();
      uploadFileMock && uploadFileMock.mockReset();
      sessionStorage.removeItem("accessToken");
    });

    it("do nothing if action.payload.files not existed", () => {
      const action: any = null;
      const gen = readFilesFromField(action);
      const expected = { done: true, value: undefined };
      expect(gen.next()).toEqual(expected);
      const action2: any = {
        payload: {}
      };
      const gen2 = readFilesFromField(action2);
      expect(gen2.next()).toEqual(expected);
    });

    it('do nothing if "files" don\'t include image files', async () => {
      await runSaga(sagaIO, readFilesFromField, invalidAction).toPromise();
      const expected: any = [];
      expect(dispatched).toEqual(expected);
    });

    it('call "readFile" with file for the number of "files" length', async () => {
      await runSaga(sagaIO, readFilesFromField, action).toPromise();
      expect(readFileMock).nthCalledWith(1, FILES[0]);
      expect(readFileMock).nthCalledWith(2, FILES[1]);
    });

    it('put FILE_READ action with payload for the number of "files" length', async () => {
      await runSaga(sagaIO, readFilesFromField, action).toPromise();
      const payload1 = {
        fileDataset: [{ ...readFileRes, ...FILES[0] }]
      };
      const payload2 = {
        fileDataset: [{ ...readFileRes, ...FILES[1] }]
      };
      const expected = [
        { type: FILE_READ, payload: payload1 },
        { type: FILE_READ, payload: payload2 }
      ];
      expect(dispatched.slice(0, 2)).toEqual(expected);
    });

    it("put FILE_HANDLE_ERROR if readFile() was failed", async () => {
      const expected = [
        {
          type: FILE_HANDLE_ERROR,
          payload: ERROR
        }
      ];
      (readFile as jest.Mock).mockImplementation(() => {
        throw ERROR;
      });
      await runSaga(sagaIO, readFilesFromField, action).toPromise();
      expect(dispatched).toEqual(expected);
    });
  });

  describe("uploadFilesSaga", () => {
    let dispatched: any[] = [];
    const sagaIO = {
      dispatch: (action: any) => {
        dispatched.push(action);
      }
    };
    const TOKEN = "token";
    const FILES: any[] = [
      { file: "foo", type: "image/png" },
      { file: "bar", type: "image/jpeg" }
    ];
    const ERROR = {
      message: "error_message"
    };
    const action: any = {
      payload: {
        fileDataset: FILES
      }
    };
    let uploadFileMock: jest.Mock;
    beforeEach(() => {
      uploadFileMock = (uploadFile as jest.Mock).mockImplementation(
        (f: any) =>
          new Promise(resolve => {
            resolve({ ...f });
          })
      );
      dispatched = [];
      sessionStorage.setItem("accessToken", TOKEN);
    });
    afterEach(() => {
      uploadFileMock && uploadFileMock.mockReset();
      sessionStorage.removeItem("accessToken");
    });

    it("do nothing if action.payload.fileDataset not existed", () => {
      const action: any = null;
      const gen = uploadFilesSaga(action);
      const expected = { done: true, value: undefined };
      expect(gen.next()).toEqual(expected);
      const action2: any = {
        payload: {}
      };
      const gen2 = readFilesFromField(action2);
      expect(gen2.next()).toEqual(expected);
    });

    it("put UPLOAD_STAETED action once", async () => {
      await runSaga(sagaIO, uploadFilesSaga, action).toPromise();
      const expected: any = [{ type: UPLOAD_STARTED }];
      expect(dispatched.slice(0, 1)).toEqual(expected);
    });

    it('call "uploadFilesSaga" with files', async () => {
      await runSaga(sagaIO, uploadFilesSaga, action).toPromise();
      const expected1 = [FILES[0].file, FILES[1].file];
      const expected2 = `Bearer ${TOKEN}`;
      expect(uploadFileMock).toBeCalledWith(expected1, expected2);
    });

    it("put UPLOAD_COMPLETE action with payload", async () => {
      await runSaga(sagaIO, uploadFilesSaga, action).toPromise();
      const payload = {
        uploadedFileDataset: [{ ...FILES[0] }, { ...FILES[1] }]
      };
      const expected = [
        {
          type: UPLOAD_COMPLETE,
          payload
        }
      ];
      expect(dispatched.slice(-1)).toEqual(expected);
    });

    it("put FILE_HANDLE_ERROR if uploadFile() was failed", async () => {
      const expected = [
        {
          type: UPLOAD_STARTED
        },
        {
          type: FILE_HANDLE_ERROR,
          payload: ERROR
        }
      ];
      (uploadFile as jest.Mock).mockImplementation(() => {
        throw ERROR;
      });
      await runSaga(sagaIO, uploadFilesSaga, action).toPromise();
      expect(dispatched).toEqual(expected);
    });
  });
});
