import {call, put, takeEvery} from 'redux-saga/effects';
import axios from 'axios';
import { AxiosResponse, AxiosPromise } from 'axios';
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
import { readFile, uploadFile } from '../services/file';

function apiSignIn (): AxiosPromise {
  const url = `${API_OAUTH_URL}/?callback_url=${encodeURIComponent(LOCAL_OAUTH_CALLBACK_URL)}`;
  return axios.get(url);
}

function apiOAuthCallback (): AxiosPromise {
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
  const res: AxiosResponse = yield call(apiSignIn);
  yield put({ type: SIGN_IN_SUCCESS, payload: res.data });
}

function* oauthCallback () {
  const res: AxiosResponse = yield call(apiOAuthCallback);
  sessionStorage.setItem('accessToken', res.data.accessToken);
  yield put({ type: OAUTH_CALLBACK_SUCCESS, payload: res.data });
}

function* uploadFilesFromField (action: IFileFieldOnChangeAction) {
  const files: File[] = action.payload && action.payload.files;
  const token: string = `Bearer ${sessionStorage.getItem('accessToken')}`;
  if (!files || !files[0]) {
    return;
  }
  const imageFiles = Array.prototype.filter.call(files, (f: File) => f.type.match('image.*'));
  let fileDataset = [];
  for (let i = 0, l = imageFiles.length; i<l; i++) {
    const f: File = imageFiles[i];
    const fileData = yield readFile(f);
    yield put({ type: FILE_READ, payload: fileData });
    fileDataset.push(fileData);
  }
  try {
    for (let i = 0, l = imageFiles.length; i<l; i++) {
      console.log('upload...:', imageFiles[i]);
      yield call(uploadFile, imageFiles[i], token);
    }
  } catch (e) {
    console.log('upload error:', e.message);
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
  yield takeEvery(FILE_FIELD_ON_CHANGE, uploadFilesFromField)
}
