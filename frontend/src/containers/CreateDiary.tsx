import React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';

export function mapStateToProps (state: any) {
  return state;
}

export function mapDispatchToProps (dispatch: Dispatch) {
  return {
  }
}

interface IUser {
  name: string,
  accessToken?: string,
  user?: object
}

const CreateDiary: React.FC = () => {
  const tempUser: IUser = {
    name: 'User A'
  };
  return (
    <div className="App">
      <h1>Upload images</h1>
      <p>Evernote User Name: {tempUser.name}</p>
      <p>
        <input type="file" name="imagefiles[]" id="imagefiles" multiple accept=".jpg,.jpeg,.png,.gif" />
      </p>
      <div id="list">
        <p>
          <a href="/"> &lt;&lt; Back to index</a>
        </p>
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateDiary);
