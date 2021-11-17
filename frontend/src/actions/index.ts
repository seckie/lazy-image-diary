import {
  SIGN_IN,
  OAUTH_CALLBACK,
  FILE_FIELD_ON_CHANGE,
  FILE_FIELD_NO_FILE,
  UPLOAD_START
} from "../constants/index";
import { IFileData } from "../models/";

export interface IAction {
  type: string;
  payload?: any;
}

interface IFileFieldOnChangePayload {
  files: File[];
}

export interface IFileFieldOnChangeAction extends IAction {
  payload: IFileFieldOnChangePayload;
}

export interface IUploadAction extends IAction {
  payload: {
    fileDataset: IFileData[];
  };
}

export interface IActions {
  signIn: () => IAction;
  oauthCallback: () => IAction;
  fileFieldOnChange: (e: React.FormEvent) => IAction;
  uploadFiles: (files: IFileData[]) => IAction;
}

const Actions: IActions = {
  signIn() {
    return {
      type: SIGN_IN
    };
  },
  oauthCallback() {
    return {
      type: OAUTH_CALLBACK
    };
  },
  fileFieldOnChange(e: React.FormEvent) {
    const el: any = e.currentTarget;
    const files = el && el.files;
    if (!files) {
      return {
        type: FILE_FIELD_NO_FILE
      };
    } else {
      return {
        type: FILE_FIELD_ON_CHANGE,
        payload: {
          files
        }
      };
    }
  },
  uploadFiles(fileDataset: IFileData[]) {
    return {
      type: UPLOAD_START,
      payload: {
        fileDataset
      }
    };
  }
};

export default Actions;
