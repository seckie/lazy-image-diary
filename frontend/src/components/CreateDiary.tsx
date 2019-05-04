import React from 'react';
import './Default.css';

interface IUser {
  name: string
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

export default CreateDiary;
