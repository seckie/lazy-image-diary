import axios from 'axios';
import queryString from 'query-string';
import {
  API_OAUTH_URL,
  API_OAUTH_CALLBACK_URL,
  LOCAL_OAUTH_CALLBACK_URL
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

const actions = {
  signIn: (): any => {
    const url = `${API_OAUTH_URL}/?callback_url=${encodeURIComponent(LOCAL_OAUTH_CALLBACK_URL)}`;
    axios.get(url).then(res => {
      const data: ISignInResponse = res.data;
      window.sessionStorage.setItem('oauthToken', data.oauthToken);
      window.sessionStorage.setItem('oauthTokenSecret', data.oauthTokenSecret);
      window.location.href = data.authorizeUrl;
    }, error => {
      console.log(error);
    });
    // TODO
    // redux-sagaを使った処理に整理する
  },
  oauthCallback: (): any => {
    const query = queryString.parse(window.location.search);
    const newQuery = {
      oauthToken: window.sessionStorage.getItem('oauthToken'),
      oauthTokenSecret: window.sessionStorage.getItem('oauthTokenSecret'),
      oauth_verifier: query.oauth_verifier
    };
    const url = `${API_OAUTH_CALLBACK_URL}?${queryString.stringify(newQuery)}`;
    axios.get(url).then((res) => {
      const data: IOAuthCallbackResponse = res.data;
      window.sessionStorage.removeItem('oauthToken');
      window.sessionStorage.removeItem('oauthTokenSecret');
      console.log(data.user); // TODO: save user data to store
      console.log(data.accessToken) // TODO: save accessToken to store
      // TODO
      // redux-sagaを使った処理に書き換える
      return data;
    });
  }
};

export default actions;
