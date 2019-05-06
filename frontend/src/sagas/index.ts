import {call, put, takeEvery} from 'redux-saga/effects';
import axios from 'axios';
import queryString from 'query-string';
import {
  SIGN_IN,
  SIGN_IN_SUCCESS,
  OAUTH_CALLBACK,
  OAUTH_CALLBACK_SUCCESS,
  API_OAUTH_URL,
  API_OAUTH_CALLBACK_URL,
  LOCAL_OAUTH_CALLBACK_URL,
  FILE_FIELD_ON_CHANGE,
  FILE_READ,
  UPLOAD_COMPLETE
} from '../constants';
import { IFileFieldOnChangeAction } from '../actions/';
import { UploadStatus } from '../reducers/'
import { readFile } from '../services/file';

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

function* fileFieldOnChange (action: IFileFieldOnChangeAction) {
  const files = action.payload && action.payload.files;
  if (!files) { return; }
  let fileDataset = [];
  for (let i = 0, l = files.length; i<l; i++) {
    const f: File = files[i];
    if (!f.type.match('image.*')) { continue; }
    const fileData = yield readFile(f);
    yield put({ type: FILE_READ, payload: fileData });
    fileDataset.push(fileData);
  }
  const fileDatasetUploaded = fileDataset.map((fileData) => {
    fileData.status = UploadStatus.complete;
    return fileData;
  });
  yield put({ type: UPLOAD_COMPLETE, payload: fileDatasetUploaded });
}

export default function* rootSaga () {
  yield takeEvery(SIGN_IN, signIn);
  yield takeEvery(OAUTH_CALLBACK, oauthCallback);
  yield takeEvery(FILE_FIELD_ON_CHANGE, fileFieldOnChange)
}
