import {call, put, takeEvery} from 'redux-saga/effects';
import { AxiosResponse } from 'axios';
import {
  SIGN_IN,
  SIGN_IN_SUCCESS,
  OAUTH_CALLBACK,
  OAUTH_CALLBACK_SUCCESS,
  FILE_FIELD_ON_CHANGE,
  FILE_READ,
  FILE_HANDLE_ERROR,
  UPLOAD_COMPLETE
} from '../constants';
import { apiSignIn, apiOAuthCallback } from '../services/api';
import { IFileFieldOnChangeAction } from '../actions/';
import { UPLOAD_STATUS } from '../constants/'
import { readFile, uploadFile } from '../services/file';
import { IAction } from '../reducers';


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
  const files: File[] = action && action.payload && action.payload.files;
  const token: string = `Bearer ${sessionStorage.getItem('accessToken')}`;
  if (!files || !files[0]) {
    return;
  }
  const imageFiles = Array.prototype.filter.call(files, (f: File) => f.type.match('image.*'));
  if (!imageFiles || !imageFiles[0]) {
    return;
  }
  try {
    let fileDataset = [];
    for (let i = 0, l = imageFiles.length; i < l; i++) {
      const f: File = imageFiles[i];
      const fileData = yield readFile(f);
      const action: IAction = {
         type: FILE_READ,
         payload: {
           fileDataset: [fileData]
         }
      };
      yield put(action);
      fileDataset.push(fileData);
    }
    for (let i = 0, l = imageFiles.length; i < l; i++) {
      yield call(uploadFile, imageFiles[i], token);
    }
    const fileDatasetUploaded = fileDataset.map((fileData) => {
      fileData.status = UPLOAD_STATUS.complete;
      return fileData;
    });
    yield put({ type: UPLOAD_COMPLETE, payload: fileDatasetUploaded });
  } catch (e) {
    const payload = {
      message: typeof e.message === 'string' ? e.message : e
    };
    yield put({ type: FILE_HANDLE_ERROR, payload });
    return;
  }
}

export default function* rootSaga () {
  yield takeEvery(SIGN_IN, signIn);
  yield takeEvery(OAUTH_CALLBACK, oauthCallback);
  yield takeEvery(FILE_FIELD_ON_CHANGE, uploadFilesFromField)
}
