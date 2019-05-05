import {call, put, takeEvery} from 'redux-saga/effects';
import {
  SIGN_IN,
  SIGN_IN_SUCCESS,
  OAUTH_CALLBACK,
  OAUTH_CALLBACK_SUCCESS,
  API_OAUTH_URL,
  API_OAUTH_CALLBACK_URL,
  LOCAL_OAUTH_CALLBACK_URL
} from '../constants';
import axios from 'axios';
import queryString from 'query-string';

function apiSignIn (): any {
  const url = `${API_OAUTH_URL}/?callback_url=${encodeURIComponent(LOCAL_OAUTH_CALLBACK_URL)}`;
  return axios.get(url);
}

function apiOAuthCallback (): any {
  const query = queryString.parse(window.location.search);
  const newQuery = {
    oauthToken: window.sessionStorage.getItem('oauthToken'),
    oauthTokenSecret: window.sessionStorage.getItem('oauthTokenSecret'),
    oauth_verifier: query.oauth_verifier
  };
  const url = `${API_OAUTH_CALLBACK_URL}?${queryString.stringify(newQuery)}`;
  return axios.get(url);
}

function* signIn () {
  const res: any = yield call(apiSignIn);
  yield put({ type: SIGN_IN_SUCCESS, payload: res.data });
}

function* oauthCallback () {
  const res: any = yield call(apiOAuthCallback);
  yield put({ type: OAUTH_CALLBACK_SUCCESS, payload: res.data });
}

export default function* rootSaga () {
  yield takeEvery(SIGN_IN, signIn);
  yield takeEvery(OAUTH_CALLBACK, oauthCallback);
}
