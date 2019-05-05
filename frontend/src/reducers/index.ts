import {SIGN_IN_SUCCESS, OAUTH_CALLBACK_SUCCESS} from '../constants/';

export interface ISignInResponse {
  authorizeUrl: string;
  oauthToken: string;
  oauthTokenSecret: string;
}

export interface IOAuthCallbackResponse {
  accessToken: string,
  user: object
}

// TODO: modelへ持っていく
export type IState = ISignInResponse & IOAuthCallbackResponse;

const initialState: IState = {
  accessToken: '',
  user: {},
  authorizeUrl: '',
  oauthToken: '',
  oauthTokenSecret: ''
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
    default:
      return state;
  }
};
