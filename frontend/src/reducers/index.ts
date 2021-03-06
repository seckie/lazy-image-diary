import {
  SIGN_IN_SUCCESS,
  OAUTH_CALLBACK_SUCCESS,
  FILE_READ,
  UPLOAD_STARTED,
  UPLOAD_COMPLETE,
  FILE_HANDLE_ERROR
} from '../constants/';
import { IFileData } from '../models/';

export interface ISignInResponse {
  authorizeUrl?: string;
  oauthToken?: string;
  oauthTokenSecret?: string;
}

export interface IOAuthCallbackResponse {
  accessToken?: string;
  user?: object;
}

export type IState = ISignInResponse &
  IOAuthCallbackResponse & {
    isUploading?: boolean;
    fileDataset?: IFileData[];
    uploadedFileDataset?: IFileData[];
    message?: string;
  };

export const initialState: IState = {
  accessToken: '',
  user: {},
  authorizeUrl: '',
  oauthToken: '',
  oauthTokenSecret: '',
  isUploading: false,
  fileDataset: [],
  uploadedFileDataset: [],
  message: ''
};

export interface IAction {
  type: string;
  payload: IState;
}

export const mapMessage = (message?: string) => {
  switch (message) {
    case 'Unexpected field':
      return '画像ファイル数が多すぎます';
    default:
      return message;
  }
};

export default function rootReducer(state = initialState, action: IAction) {
  switch (action.type) {
    case SIGN_IN_SUCCESS:
      if (action.payload!.oauthToken && action.payload!.oauthTokenSecret && action.payload!.authorizeUrl) {
        window.sessionStorage.setItem('oauthToken', action.payload!.oauthToken);
        window.sessionStorage.setItem('oauthTokenSecret', action.payload!.oauthTokenSecret);
        window.location.assign(action.payload!.authorizeUrl);
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
        fileDataset: initialState.fileDataset!.concat(action.payload.fileDataset!, state.fileDataset!)
      };
    case UPLOAD_STARTED:
      return {
        ...state,
        isUploading: true
      };
    case UPLOAD_COMPLETE:
      const newState = {
        ...state,
        isUploading: false,
        fileDataset: state.fileDataset!.filter(file => {
          const isIncludedInAction: boolean = action.payload.uploadedFileDataset!.some(
            uploadedFile => file.path === uploadedFile.path
          );
          return !isIncludedInAction;
        }),
        uploadedFileDataset: action.payload.uploadedFileDataset!.concat(state.uploadedFileDataset!)
      };
      return newState;
    case FILE_HANDLE_ERROR:
      return {
        ...state,
        errorMessages: [mapMessage(action.payload.message)],
        isUploading: false
      };
    default:
      return state;
  }
}
