import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import history from 'history';
import { ToastContainer, ToastOptions, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Logo } from '../components/Logo/Logo';
import { UserInfo } from '../components/UserInfo/UserInfo';
import { UploadInput } from '../components/UploadInput/UploadInput';
import { Notes } from '../components/Notes/Notes';
import { Button } from '../components/Button/Button';
import { Messages } from '../components/Messages/Messages';
import { MediaList } from '../components/MediaList/MediaList';
import { UploadedMediaList } from '../components/UploadedMediaList/UploadedMediaList';
import actions from '../actions/';
import { IFileData, IUser } from '../models/';

const noteItems: string[] = ['選択できる画像ファイルは一度に20個まで', '画像ファイルのサイズは一つ最大15MBまで'];

const toastOptions: ToastOptions = {
  position: 'bottom-right',
  autoClose: false,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: false
};

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

  const onClickUpload = () => {
    props.onSubmit(props.fileDataset);
  };

  if (props.errorMessages[0]) {
    props.errorMessages.forEach(message => {
      toast.error(message, toastOptions);
    });
  }

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
        <Button label="アップロード" disabled={props.isUploading} onClick={onClickUpload} />
        <Messages messages={props.resultMessages} />
      </div>
      <MediaList dataset={props.fileDataset} isUploading={props.isUploading} />
      <UploadedMediaList dataset={props.uploadedFileDataset} />
      <ToastContainer
        position="bottom-right"
        autoClose={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        draggable={false}
      />
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
