import reducer from "../../reducers";
import { initialState, unionComparator } from "../../reducers";
import {
  SIGN_IN_SUCCESS,
  OAUTH_CALLBACK_SUCCESS,
  FILE_READ,
  UPLOAD_COMPLETE
} from "../../constants";

describe("utility function", () => {
  it("unionComparator", () => {
    const D1: any = { path: "path1", status: "complete" };
    const D2: any = { path: "path2", status: "uploading" };
    const D2_2: any = { path: "path2", status: "complete" };
    expect(unionComparator(D1, D2)).toBe(false);
    expect(unionComparator(D2, D2_2)).toBe(true);
  });
});

describe("reducer", () => {
  describe("SIGN_IN_SUCCESS action type", () => {
    const OAUTH_TOKEN = "token";
    const OAUTH_TOKEN_SECRET = "token_secret";
    const AUTHORIZE_URL = "url";
    describe("with valid payload", () => {
      const action = {
        type: SIGN_IN_SUCCESS,
        payload: {
          oauthToken: OAUTH_TOKEN,
          oauthTokenSecret: OAUTH_TOKEN_SECRET,
          authorizeUrl: AUTHORIZE_URL
        }
      };
      const locationAssignSpy = jest
        .spyOn(location, "assign")
        .mockImplementation(() => null);
      beforeAll(() => {
        reducer(undefined, action);
      });
      afterAll(() => {
        sessionStorage.removeItem("oauthToken");
        sessionStorage.removeItem("oauthTokenSecret");
        locationAssignSpy.mockClear();
      });
      it('sessionStorage has "oauthToken" item after the action', () => {
        expect(sessionStorage.getItem("oauthToken")).toBe(OAUTH_TOKEN);
      });
      it('sessionStorage has "oauthToken" item after the action', () => {
        expect(sessionStorage.getItem("oauthToken")).toBe(OAUTH_TOKEN);
      });
      it("pushState should be called", () => {
        expect(locationAssignSpy).toBeCalledWith(AUTHORIZE_URL);
      });
    });
    describe("with invalid payload", () => {
      it('make no mutations without "oauthToken" payload', () => {
        const action = {
          type: SIGN_IN_SUCCESS,
          payload: {
            oauthToken: OAUTH_TOKEN
          }
        };
        const res = reducer(undefined, action);
        expect(res).toEqual(initialState);
      });
      it('make no mutations without "oauthTokenSecret" payload', () => {
        const action = {
          type: SIGN_IN_SUCCESS,
          payload: {
            oauthToken: OAUTH_TOKEN,
            authorizeUrl: AUTHORIZE_URL
          }
        };
        const res = reducer(undefined, action);
        expect(res).toEqual(initialState);
      });
      it('make no mutations without "authorizeUrl" payload', () => {
        const action = {
          type: SIGN_IN_SUCCESS,
          payload: {
            oauthToken: OAUTH_TOKEN,
            oauthTokenSecret: OAUTH_TOKEN_SECRET
          }
        };
        const res = reducer(undefined, action);
        expect(res).toEqual(initialState);
      });
    });
  });

  describe("OAUTH_CALLBACK_SUCCESS action type", () => {
    const ACCESS_TOKEN = "token";
    const USER = { name: "test " };
    const action = {
      type: OAUTH_CALLBACK_SUCCESS,
      payload: {
        accessToken: ACCESS_TOKEN,
        user: USER
      }
    };
    let res: any;
    beforeAll(() => {
      sessionStorage.setItem("oauthToken", "token");
      sessionStorage.setItem("oauthTokenSecret", "token_secret");
      res = reducer(undefined, action);
    });
    it('sessionStorage doesn\'t have "oauthToken" item after the action', () => {
      expect(sessionStorage.getItem("oauthToken")).toBe(null);
    });
    it('sessionStorage doesn\'t have "oauthTokenSecret" item after the action', () => {
      expect(sessionStorage.getItem("oauthToken")).toBe(null);
    });
    it("return new state updated with accessToken and user", () => {
      const expected = {
        ...res,
        accessToken: ACCESS_TOKEN,
        user: USER
      };
      expect(res).toEqual(expected);
    });
  });

  describe("FILE_READ action type", () => {
    const INITIAL_FILE_DATASET = ["foo" as any];
    const FILE_DATASET = ["bar" as any];
    const action = {
      type: FILE_READ,
      payload: {
        fileDataset: FILE_DATASET
      }
    };
    const state = {
      ...initialState,
      fileDataset: INITIAL_FILE_DATASET
    };
    let res: any;
    beforeAll(() => {
      res = reducer(state, action);
    });
    it('return new state updated with "fileDataset"', () => {
      const expected = {
        ...state,
        fileDataset: FILE_DATASET.concat(INITIAL_FILE_DATASET)
      };
      expect(res).toEqual(expected);
    });
  });

  describe("UPLOAD_COMPLETE action type", () => {
    const INITIAL_FILE_DATASET = [
      { path: "foo" } as any,
      { path: "bar" } as any
    ];
    const FILE_DATASET = [{ path: "bar" } as any, { path: "buzz" } as any];
    const action = {
      type: UPLOAD_COMPLETE,
      payload: {
        uploadedFileDataset: FILE_DATASET
      }
    };
    const state = {
      ...initialState,
      fileDataset: INITIAL_FILE_DATASET
    };
    let res: any;
    beforeAll(() => {
      res = reducer(state, action);
    });
    it('return new state updated with "uploadedFileDataset"', () => {
      const expected = {
        ...initialState,
        fileDataset: [{ path: "foo" }],
        uploadedFileDataset: FILE_DATASET
      };
      expect(res).toEqual(expected);
    });
  });

  describe("default action type", () => {
    const action = {
      type: "DEFAULT",
      payload: {
        accessToken: "token",
        user: { name: "name" },
        authorizeUrl: "url",
        oauthToken: "token",
        oauthTokenSecret: "token_secret",
        fileDataset: ["foo" as any],
        uploadingFileDataset: ["bar" as any]
      }
    };
    let res: any;
    beforeAll(() => {
      res = reducer(undefined, action);
    });
    it("return initial state", () => {
      expect(res).toEqual(initialState);
    });
  });
});
