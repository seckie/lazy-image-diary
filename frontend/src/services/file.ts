import axios, { AxiosRequestConfig } from 'axios';
import { UploadStatus } from '../reducers/';

export function readFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e: any) {
      resolve({
        file: file,
        path: e.target.result,
        status: UploadStatus.uploading
      });
    };
    reader.readAsDataURL(file);
  });
}

export function uploadFile (files: File[]) {
  return new Promise((resolve, reject) => {

    // TODO:
    // 日付ごとに分割してリクエストする
    // const date = moment(file.lastModified);
    // const searchTitle = date.format('YYYY-MM-DD');

    const formData = new FormData();
    for (let i=0,l=files.length; i<l; i++) {
      formData.append('fileData[]', files[i]);
    }
    // formData.append('fileLastModified', file.lastModified.toString());
    const headers: any = {
      'Content-Type': 'multipart/form-data'
    };
    const config: AxiosRequestConfig = { headers: headers };
    axios.post('/create_image_note', formData, config).then(resolve, reject);
  });
}
