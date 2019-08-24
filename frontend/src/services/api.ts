import axios from 'axios';
import { AxiosPromise } from 'axios';
import queryString from 'query-string';
import {
  API_OAUTH_URL,
  API_OAUTH_CALLBACK_URL,
  LOCAL_OAUTH_CALLBACK_URL
} from '../constants';

export function apiSignIn (): AxiosPromise {
  const url = `${API_OAUTH_URL}/?callback_url=${encodeURIComponent(LOCAL_OAUTH_CALLBACK_URL)}`;
  return axios.get(url);
}

export function apiOAuthCallback (): AxiosPromise {
  const query = queryString.parse(window.location.search);
  const newQuery = {
    oauthToken: window.sessionStorage.getItem('oauthToken'),
    oauthTokenSecret: window.sessionStorage.getItem('oauthTokenSecret'),
    oauth_verifier: query.oauth_verifier
  };
  const url = `${API_OAUTH_CALLBACK_URL}?${queryString.stringify(newQuery)}`;
  return axios.get(url);
}
