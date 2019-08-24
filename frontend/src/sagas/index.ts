import {call, put, takeEvery} from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import {
  SIGN_IN,
  SIGN_IN_SUCCESS,
  OAUTH_CALLBACK,
  OAUTH_CALLBACK_SUCCESS,
  FILE_FIELD_ON_CHANGE,
  FILE_READ,
  UPLOAD_COMPLETE
} from '../constants';
import { apiSignIn, apiOAuthCallback } from '../services/api';
import { IFileFieldOnChangeAction } from '../actions/';
import { UploadStatus } from '../reducers/'
import { readFile, uploadFile } from '../services/file';


export function* signIn () {
  const res: AxiosResponse = yield call(apiSignIn);
  yield put({ type: SIGN_IN_SUCCESS, payload: res.data });
}

export function* oauthCallback () {
  const res: AxiosResponse = yield call(apiOAuthCallback);
  sessionStorage.setItem('accessToken', res.data.accessToken);
  yield put({ type: OAUTH_CALLBACK_SUCCESS, payload: res.data });
}

export function* uploadFilesFromField (action: IFileFieldOnChangeAction) {
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
