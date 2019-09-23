import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import classNames from "classnames";

import actions from "../actions/";
import { IFileData } from "../reducers/";
import { UPLOAD_STATUS } from "../constants/";

export function mapStateToProps(state: any) {
  return state;
}

export function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onChange: (e: React.FormEvent) => dispatch(actions.fileFieldOnChange(e))
  };
}

interface IUser {
  name: string;
  accessToken?: string;
  user?: object;
}

interface IProps {
  fileDataset: IFileData[];
  resultMessages: string[];
  errorMessages: string[];
  onChange: () => void;
}

export const CreateDiary: React.FC<IProps> = props => {
  const tempUser: IUser = {
    name: "User A"
  };

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
        <p className="userInfo">Evernote ID: {tempUser.name}</p>
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
          <button className="btn">アップロード</button>
        </p>
        <ul className="messages">
          {props.resultMessages.map(message => {
            return (
              <li className="messages__item">
                <i className="fas fa-check"></i> {message}
              </li>
            );
          })}
          {props.errorMessages.map(message => {
            return (
              <li className="messages__item">
                <i className="fas fa-times"></i> {message}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mediaList">
        <ul className="medias">
          {(!props.fileDataset || !props.fileDataset[0]) && emptyList}
          {props.fileDataset.map((data: IFileData, i: number) => {
            const mediaCName = classNames({
              media: true,
              "media--uploading": data.status === UPLOAD_STATUS.uploading
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
