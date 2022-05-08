import React, { useEffect, useCallback } from 'react';
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

export const CreateDiary: React.FC<IProps> = (props) => {
  const {
    onChange,
    onSubmit,
    fileDataset,
    history,
    errorMessages,
    user,
    isUploading,
    resultMessages,
    uploadedFileDataset
  } = props;

  useEffect(() => {
    if (!window.sessionStorage.getItem('accessToken')) {
      history.replace('/');
    }
  }, [history]);

  const onClickUpload = useCallback(() => {
    onSubmit(fileDataset);
  }, [onSubmit, fileDataset]);

  // const changeHandler = useCallback((e: any) => {
  //   onChange(e);
  // }, [onChange]);

  if (errorMessages[0]) {
    errorMessages.forEach((message) => {
      toast.error(message, toastOptions);
    });
  }

  return (
    <div className="app">
      <header className="globalHeader">
        <Logo href="/" />
        {user && <UserInfo evernoteID={user.name} />}
      </header>
      <div className="uploadUI1">
        <UploadInput onChange={onChange} />
        <Notes items={noteItems} />
      </div>
      <div className="uploadUI2">
        <Button label="アップロード" disabled={isUploading} onClick={onClickUpload} />
        <Messages messages={resultMessages} />
      </div>
      <MediaList dataset={fileDataset} isUploading={isUploading} />
      <UploadedMediaList dataset={uploadedFileDataset} />
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateDiary);
