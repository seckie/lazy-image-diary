import { call, put, takeEvery } from "redux-saga/effects";
import { AxiosResponse } from "axios";
import {
  SIGN_IN,
  SIGN_IN_SUCCESS,
  OAUTH_CALLBACK,
  OAUTH_CALLBACK_SUCCESS,
  FILE_FIELD_ON_CHANGE,
  FILE_READ,
  FILE_HANDLE_ERROR,
  UPLOAD_START,
  UPLOAD_STARTED,
  UPLOAD_COMPLETE
} from "../constants";
import { apiSignIn, apiOAuthCallback } from "../services/api";
import { IFileFieldOnChangeAction, IUploadAction } from "../actions/";
import { IFileData } from "../models/";
import { readFile, uploadFile } from "../services/file";
import { IAction } from "../reducers";

export function* signIn() {
  const res: AxiosResponse = yield call(apiSignIn);
  yield put({ type: SIGN_IN_SUCCESS, payload: res.data });
}

export function* oauthCallback() {
  const res: AxiosResponse = yield call(apiOAuthCallback);
  sessionStorage.setItem("accessToken", res.data.accessToken);
  sessionStorage.setItem("user", res.data.user);
  yield put({ type: OAUTH_CALLBACK_SUCCESS, payload: res.data });
}

export function* readFilesFromField(action: IFileFieldOnChangeAction) {
  const files: File[] = action && action.payload && action.payload.files;
  if (!files || !files[0]) {
    return;
  }
  const imageFiles = Array.prototype.filter.call(files, (f: File) =>
    f.type.match("image.*")
  );
  if (!imageFiles || !imageFiles[0]) {
    return;
  }
  try {
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
    }
  } catch (e) {
    const payload = {
      message: e.message
    };
    yield put({ type: FILE_HANDLE_ERROR, payload });
  }
}

export function* uploadFilesSaga(action: IUploadAction) {
  const fileDataset: IFileData[] =
    action && action.payload && action.payload.fileDataset;
  const token: string = `Bearer ${sessionStorage.getItem("accessToken")}`;
  if (!fileDataset || !fileDataset[0]) {
    return;
  }
  try {
    const files: File[] = fileDataset.map(fileData => fileData.file);
    yield put({ type: UPLOAD_STARTED });
    yield call(uploadFile, files, token);
    yield put({
      type: UPLOAD_COMPLETE,
      payload: { uploadedFileDataset: fileDataset }
    });
  } catch (e) {
    const payload = {
      message: e.message
    };
    yield put({ type: FILE_HANDLE_ERROR, payload });
  }
}

export default function* rootSaga() {
  yield takeEvery(SIGN_IN, signIn);
  yield takeEvery(OAUTH_CALLBACK, oauthCallback);
  yield takeEvery(FILE_FIELD_ON_CHANGE, readFilesFromField);
  yield takeEvery(UPLOAD_START, uploadFilesSaga);
}
