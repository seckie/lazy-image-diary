import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import classNames from 'classnames';
import history from 'history';

import { Logo } from '../components/Logo/Logo';
import { UserInfo } from '../components/UserInfo/UserInfo';
import { UploadInput } from '../components/UploadInput/UploadInput';
import { Notes } from '../components/Notes/Notes';
import actions from '../actions/';
import { IFileData, IUser } from '../models/';

const noteItems: string[] = ['選択できる画像ファイルは一度に20個まで', '画像ファイルのサイズは一つ最大15MBまで'];

export function mapStateToProps(state: any) {
  return state;
}

export function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onChange: (e: React.FormEvent) => dispatch(actions.fileFieldOnChange(e)),
    onSubmit: (fileDataset: IFileData[]) => dispatch(actions.uploadFiles(fileDataset))
  };
}

interface IProps {
  user: IUser;
  accessToken: string;
  uploadedFileDataset: IFileData[];
  fileDataset: IFileData[];
  resultMessages: string[];
  errorMessages: string[];
  isUploading: boolean;
  onChange: (e: React.FormEvent) => void;
  onSubmit: (fileDataest: IFileData[]) => void;
  history: history.History;
}

export const CreateDiary: React.FC<IProps> = props => {
  useEffect(() => {
    if (!window.sessionStorage.getItem('accessToken')) {
      props.history.replace('/');
    }
  });

  let emptyList = new Array(5).fill('');
  emptyList = emptyList.map((item, i) => <li className="media media____empty" key={i} />);

  return (
    <div className="app">
      <header className="globalHeader">
        <Logo href="/" />
        {props.user && <UserInfo evernoteID={props.user.name} />}
      </header>
      <div className="uploadUI1">
        <UploadInput onChange={props.onChange} />
        <Notes items={noteItems} />
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
