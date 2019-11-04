import { UPLOAD_STATUS } from "../constants/";

export interface IFileData {
  file: File;
  path: string;
  status?: UPLOAD_STATUS;
}

export interface IUser {
  name: string;
}
