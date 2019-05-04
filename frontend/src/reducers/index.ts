import {IActions} from '../actions/';
import {SIGN_IN, OAUTH_CALLBACK} from '../constants/';


export interface ISignInResponse {
  authorizeUrl: string;
  oauthToken: string;
  oauthTokenSecret: string;
}

export interface IOAuthCallbackResponse {
  accessToken: string,
  user: object
}

export interface IState {
  // TODO: modelへ持っていく
  accessToken?: string,
  user?: object

  authorizeUrl?: string;
  oauthToken?: string;
  oauthTokenSecret?: string;
}

export default function reducers (state: IState, action: IActions) {
  switch (action.type) {
    case SIGN_IN:    
      window.sessionStorage.setItem('oauthToken', state.oauthToken);
      window.sessionStorage.setItem('oauthTokenSecret', state.oauthTokenSecret);
      window.location.href = state.authorizeUrl;
      return state;
    case OAUTH_CALLBACK:    
      return {
        ...state,
        accessToken: action.payload.accessToken,
        user: action.payload.user
      };
    default:
      return state;
  }
};
