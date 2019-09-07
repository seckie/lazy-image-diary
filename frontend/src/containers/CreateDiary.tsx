import React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import classNames from 'classnames';

import actions from '../actions/';
import { IFileData } from '../reducers/';
import { UPLOAD_STATUS } from '../constants/';

export function mapStateToProps (state: any) {
  return state;
}

export function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onChange: (e: React.FormEvent) => dispatch(actions.fileFieldOnChange(e))
  };
}

interface IUser {
  name: string,
  accessToken?: string,
  user?: object
}

interface IProps {
  fileDataset: IFileData[],
  onChange: () => void
}

export const CreateDiary: React.FC<IProps> = (props) => {
  const tempUser: IUser = {
    name: 'User A'
  };
  return (
    <div className="App">
      <h1>Upload images</h1>
      <p>Evernote User Name: {tempUser.name}</p>
      <p>
        <input type="file" name="imagefiles[]" id="imagefiles" multiple accept=".jpg,.jpeg,.png,.gif" onChange={props.onChange} />
      </p>
      <div id="list">
        {props.fileDataset.map((data: IFileData, i: number) => {
          const mediaCName = classNames({
            'media': true,
            'media--uploading': data.status === UPLOAD_STATUS.uploading
          });
          return (
            <p className={mediaCName} key={`media${i}`}>
              <img className="thumb" src={data.path} title={global.escape(data.file.name)} alt={global.escape(data.file.name)} />
            </p>
          );
        })}
      </div>
      <p>
        <a href="/"> &lt;&lt; Back to index</a>
      </p>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateDiary);
