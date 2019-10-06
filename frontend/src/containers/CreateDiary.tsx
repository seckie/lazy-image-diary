import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import classNames from "classnames";

import actions from "../actions/";
import { IFileData } from "../models/";

export function mapStateToProps(state: any) {
  return state;
}

export function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onChange: (e: React.FormEvent) => dispatch(actions.fileFieldOnChange(e)),
    onSubmit: (fileDataset: IFileData[]) =>
      dispatch(actions.uploadFiles(fileDataset))
  };
}

interface IUser {
  name: string;
}

interface IProps {
  user: IUser;
  uploadedFileDataset: IFileData[];
  fileDataset: IFileData[];
  resultMessages: string[];
  errorMessages: string[];
  isUploading: boolean;
  onChange: (e: React.FormEvent) => void;
  onSubmit: (fileDataest: IFileData[]) => void;
}

export const CreateDiary: React.FC<IProps> = props => {
  let emptyList = new Array(5).fill("");
  emptyList = emptyList.map((item, i) => (
    <li className="media media____empty" key={i} />
  ));

  return (
    <div className="app">
      <header className="globalHeader">
        <p className="logo">
          <a href="/">Lazy Image Diary</a>
        </p>
        {props.user && (
          <p className="userInfo">Evernote ID: {props.user.name}</p>
        )}
      </header>
      <div className="uploadUI1">
        <p className="uploadInput">
          <span className="inputFile">
            <label htmlFor="imagefiles">画像ファイルを選択</label>
            <input
              type="file"
              name="imagefiles[]"
              id="imagefiles"
              multiple
              accept=".jpg,.jpeg,.png,.gif"
              onChange={props.onChange}
            />
          </span>
        </p>
        <ul className="notes">
          <li>選択できる画像ファイルは一度に20個まで </li>
          <li>画像ファイルのサイズは一つ最大15MBまで</li>
        </ul>
      </div>
      <div className="uploadUI2">
        <p className="uploadInput">
          <button
            className="btn"
            disabled={props.isUploading}
            onClick={() => {
              props.onSubmit(props.fileDataset);
            }}
          >
            アップロード
          </button>
        </p>
        <ul className="messages">
          {props.resultMessages.map((message, i) => {
            return (
              <li className="messages__item" key={i}>
                <i className="fas fa-check"></i> {message}
              </li>
            );
          })}
          {props.errorMessages.map((message, i) => {
            return (
              <li className="messages__item" key={i}>
                <i className="fas fa-times"></i> {message}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mediaList mediaList____undone">
        <ul className="medias">
          {(!props.fileDataset || !props.fileDataset[0]) && emptyList}
          {props.fileDataset &&
            props.fileDataset.map((data: IFileData, i: number) => {
              const mediaCName = classNames({
                media: true,
                media____uploading: props.isUploading
              });
              return (
                <li className={mediaCName} key={`media${i}`}>
                  <img
                    className="thumb"
                    src={data.path}
                    title={global.escape(data.file.name)}
                    alt={global.escape(data.file.name)}
                  />
                </li>
              );
            })}
        </ul>
      </div>
      {props.uploadedFileDataset && props.uploadedFileDataset[0] && (
        <div className="mediaList mediaList____done">
          <h2 className="mediaList__h">アップロード済み</h2>
          <ul className="medias">
            {props.uploadedFileDataset.map((data: IFileData, i: number) => {
              return (
                <li className="media" key={`media${i}`}>
                  <img
                    className="thumb"
                    src={data.path}
                    title={global.escape(data.file.name)}
                    alt={global.escape(data.file.name)}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

CreateDiary.defaultProps = {
  resultMessages: [],
  errorMessages: []
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateDiary);
