import Actions from "../../actions";
import {
  SIGN_IN,
  OAUTH_CALLBACK,
  FILE_FIELD_ON_CHANGE,
  FILE_FIELD_NO_FILE,
  UPLOAD_START,
  UPLOAD_STATUS
} from "../../constants";

describe("Actions", () => {
  describe("signIn()", () => {
    it("make SIGN_IN type action", () => {
      const expected = {
        type: SIGN_IN
      };
      expect(Actions.signIn()).toEqual(expected);
    });
  });
  describe("oauthCallback()", () => {
    it("make OAUTH_CALLBACK type action", () => {
      const expected = {
        type: OAUTH_CALLBACK
      };
      expect(Actions.oauthCallback()).toEqual(expected);
    });
  });
  describe("fileFieldOnChange()", () => {
    it("make FILE_FIELD_NO_FILE type action if files don't exists", () => {
      const expected = {
        type: FILE_FIELD_NO_FILE
      };
      const ev: any = {};
      expect(Actions.fileFieldOnChange(ev)).toEqual(expected);
    });
    it("make FILE_FIELD_ON_CHANGE type action if files exists", () => {
      const files: any = [];
      const expected = {
        type: FILE_FIELD_ON_CHANGE,
        payload: { files }
      };
      const ev: any = {
        currentTarget: { files }
      };
      expect(Actions.fileFieldOnChange(ev)).toEqual(expected);
    });
  });
  describe("uploadFiles()", () => {
    it("make UPLOAD_START type action", () => {
      const payload: any = {
        fileDataset: ["foo"]
      };
      const expected = {
        type: UPLOAD_START,
        payload
      };
      expect(Actions.uploadFiles(payload.fileDataset)).toEqual(expected);
    });
  });
});
