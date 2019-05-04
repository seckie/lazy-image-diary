import React from 'react';
import './Default.css';

const Default: React.FC = () => {
  return (
    <div className="App">
      <h1>Lazy Image Diary</h1>
      <p><a className="btn.btn-evernote-signin" href="/oauth_signin">Evernote Sign-in</a></p>
      <p>Lazy Image Diary is easy way to make diary on Evernote with your photos. <br />
        | All you need is sign-in with your Evernote account and upload your photos from the upload form. <br />
        | Then you would get auto generated posts with your photos on your Evernote "Diary" notebook.</p>
    </div>
  );
}

export default Default;
