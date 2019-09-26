import { unionWith } from "lodash";
import {
  SIGN_IN_SUCCESS,
  OAUTH_CALLBACK_SUCCESS,
  FILE_READ,
  UPLOAD_COMPLETE,
  UPLOAD_STATUS
} from "../constants/";

export interface ISignInResponse {
  authorizeUrl?: string;
  oauthToken?: string;
  oauthTokenSecret?: string;
}

export interface IOAuthCallbackResponse {
  accessToken?: string;
  user?: object;
}

export interface IFileDataset {
  fileDataset?: IFileData[];
  uploadedFileDataset?: IFileData[];
}
export interface IFileData {
  file: File;
  path: string;
  status: UPLOAD_STATUS;
}

export type IState = ISignInResponse & IOAuthCallbackResponse & IFileDataset;

export const initialState: IState = {
  accessToken: "",
  user: {},
  authorizeUrl: "",
  oauthToken: "",
  oauthTokenSecret: "",
  fileDataset: [],
  uploadedFileDataset: []
};

export interface IAction {
  type: string;
  payload: IState;
}

export function unionComparator(newData: IFileData, baseData: IFileData) {
  return newData.path === baseData.path;
}

export default function rootReducer(state = initialState, action: IAction) {
  switch (action.type) {
    case SIGN_IN_SUCCESS:
      if (
        action.payload!.oauthToken &&
        action.payload!.oauthTokenSecret &&
        action.payload!.authorizeUrl
      ) {
        window.sessionStorage.setItem("oauthToken", action.payload!.oauthToken);
        window.sessionStorage.setItem(
          "oauthTokenSecret",
          action.payload!.oauthTokenSecret
        );
        window.location.assign(action.payload!.authorizeUrl);
      }
      return state;
    case OAUTH_CALLBACK_SUCCESS:
      window.sessionStorage.removeItem("oauthToken");
      window.sessionStorage.removeItem("oauthTokenSecret");
      return {
        ...state,
        accessToken: action.payload.accessToken,
        user: action.payload.user
      };
    case FILE_READ:
      return {
        ...state,
        fileDataset: initialState.fileDataset!.concat(
          action.payload.fileDataset!,
          state.fileDataset!
        )
      };
    case UPLOAD_COMPLETE:
      return {
        ...state,
        //fileDataset: unionWith(action.payload.fileDataset!, state.fileDataset!, unionComparator)
        fileDataset: state.fileDataset!.filter(file => {
          const isIncludedInAction: boolean = action.payload.uploadedFileDataset!.some(
            uploadedFile => file.path === uploadedFile.path
          );
          return !isIncludedInAction;
        }),
        uploadedFileDataset: action.payload.uploadedFileDataset!.concat(
          state.uploadedFileDataset!
        )
      };
    default:
      return state;
  }
}
