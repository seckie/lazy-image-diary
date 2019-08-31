import axios, { AxiosRequestConfig } from 'axios';
import { UPLOAD_STATUS } from '../constants/';
import { API_CREATE_IMAGE_NOTE_URL } from '../constants';

export function readFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e: any) {
      resolve({
        file: file,
        path: e.target.result,
        status: UPLOAD_STATUS.uploading
      });
    };
    reader.readAsDataURL(file);
  });
}

export function uploadFile (file: File, token: string) {
  return new Promise((resolve, reject) => {

    // TODO:
    // 日付ごとに分割してリクエストする
    // const date = moment(file.lastModified);
    // const searchTitle = date.format('YYYY-MM-DD');
    const formData = new FormData();
    formData.append('fileData', file);
    formData.append('fileLastModified', file.lastModified.toString());
    const options: AxiosRequestConfig = {
      method: 'post',
      url: API_CREATE_IMAGE_NOTE_URL,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'authorization': token
      }
    };
    axios(options).then(resolve, reject);
  });
}
