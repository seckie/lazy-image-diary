import {
  SIGN_IN_SUCCESS,
  OAUTH_CALLBACK_SUCCESS,
  FILE_READ,
  UPLOAD_COMPLETE
} from '../constants/';

export interface ISignInResponse {
  authorizeUrl: string;
  oauthToken: string;
  oauthTokenSecret: string;
}

export interface IOAuthCallbackResponse {
  accessToken: string,
  user: object
}

export interface IFileDataset {
  fileDataset: IFileData[]
}
export enum UploadStatus {
  uploading = 'uploading',
  complete = 'complete',
  failure = 'failure',
}
export interface IFileData {
  file: File,
  path: string,
  status: UploadStatus
}

// TODO: modelへ持っていく
export type IState = ISignInResponse & IOAuthCallbackResponse & IFileDataset;

const initialState: IState = {
  accessToken: '',
  user: {},
  authorizeUrl: '',
  oauthToken: '',
  oauthTokenSecret: '',
  fileDataset: []
};

export default function reducers (state = initialState, action: any) {
  switch (action.type) {
    case SIGN_IN_SUCCESS:
      window.sessionStorage.setItem('oauthToken', action.payload!.oauthToken);
      window.sessionStorage.setItem('oauthTokenSecret', action.payload!.oauthTokenSecret);
      window.location.href = action.payload!.authorizeUrl;
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
        fileDataset: state.fileDataset.concat(action.payload)
      };
    case UPLOAD_COMPLETE:
      return {
        ...state,
        fileDataset: action.payload
      };
    default:
      return state;
  }
};
