import axios, { AxiosRequestConfig } from "axios";
import { API_CREATE_IMAGE_NOTE_URL } from "../constants";

export function readFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function(e: any) {
      resolve({
        file: file,
        path: e.target.result
      });
    };
    reader.readAsDataURL(file);
  });
}

export function uploadFile(files: File[], token: string) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    const lastModified = [];
    for (let file of files) {
      formData.append("fileData", file);
      lastModified.push(file.lastModified.toString());
    }
    formData.append("fileLastModified", JSON.stringify(lastModified));
    const options: AxiosRequestConfig = {
      method: "post",
      url: API_CREATE_IMAGE_NOTE_URL,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: token
      }
    };
    axios(options).then(resolve, reject);
  });
}
