import {
  SIGN_IN_SUCCESS,
  OAUTH_CALLBACK_SUCCESS,
  FILE_READ,
  UPLOAD_COMPLETE,
  UPLOAD_STATUS
} from '../constants/';

export interface ISignInResponse {
  authorizeUrl?: string;
  oauthToken?: string;
  oauthTokenSecret?: string;
}

export interface IOAuthCallbackResponse {
  accessToken?: string,
  user?: object
}

export interface IFileDataset {
  fileDataset?: IFileData[],
  uploadingFileDataset?: IFileData[]
}
export interface IFileData {
  file: File,
  path: string,
  status: UPLOAD_STATUS
}

// TODO: modelへ持っていく
export type IState = ISignInResponse & IOAuthCallbackResponse & IFileDataset;

export const initialState: IState = {
  accessToken: '',
  user: {},
  authorizeUrl: '',
  oauthToken: '',
  oauthTokenSecret: '',
  fileDataset: [],
  uploadingFileDataset: [],
};

export interface IAction {
  type: string,
  payload: IState
}

export default function rootReducer (state = initialState, action: IAction) {
  switch (action.type) {
    case SIGN_IN_SUCCESS:
      if (
        action.payload!.oauthToken &&
        action.payload!.oauthTokenSecret &&
        action.payload!.authorizeUrl
      ) {
        window.sessionStorage.setItem('oauthToken', action.payload!.oauthToken);
        window.sessionStorage.setItem('oauthTokenSecret', action.payload!.oauthTokenSecret);
        history.pushState(null, 'Upload images', action.payload!.authorizeUrl);
      }
      return state;
    case OAUTH_CALLBACK_SUCCESS:
      window.sessionStorage.removeItem('oauthToken');
      window.sessionStorage.removeItem('oauthTokenSecret');
      return {
        ...state,
        accessToken: action.payload.accessToken,
        user: action.payload.user
      };
    case FILE_READ:
      return {
        ...state,
        uploadingFileDataset: state.uploadingFileDataset!.concat(action.payload.uploadingFileDataset!)
      };
    case UPLOAD_COMPLETE:
      return {
        ...state,
        fileDataset: state.fileDataset!.concat(action.payload.fileDataset!),
        uploadingFileDataset: initialState.uploadingFileDataset
      };
    default:
      return state;
  }
};
