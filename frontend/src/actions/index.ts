import {
  SIGN_IN,
  OAUTH_CALLBACK
} from '../constants/index'

export interface IActions {
  signIn: () => void,
  oauthCallback: () => void,
  type: string,
  payload: IOAuthCallbackResponse
}

export interface ISignInResponse {
  authorizeUrl: string;
  oauthToken: string;
  oauthTokenSecret: string;
}
export interface IOAuthCallbackResponse {
  accessToken: string,
  user: object
}

export function signIn() {
  return {
    type: SIGN_IN
  };
}

export function oauthCallback() {
  return {
    type: OAUTH_CALLBACK
  };
}

export default {
  signIn,
  oauthCallback
};
