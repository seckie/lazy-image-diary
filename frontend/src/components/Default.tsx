import React from 'react';
import axios from 'axios';
import {API_OAUTH_URL, LOCAL_OAUTH_CALLBACK_URL} from '../constants/index'

export interface IResponseData {
  authorizeUrl: string;
  oauthToken: string;
  oauthTokenSecret: string;
}

class Default extends React.Component {
  componentDidMount () {
    this.onClickSignIn = this.onClickSignIn.bind(this);
  }
  onClickSignIn () {
    const url = `${API_OAUTH_URL}/?callback_url=${encodeURIComponent(LOCAL_OAUTH_CALLBACK_URL)}`;
    axios.get(url).then(res => {
      const data: IResponseData = res.data;
      window.sessionStorage.setItem('oauthToken', data.oauthToken);
      window.sessionStorage.setItem('oauthTokenSecret', data.oauthTokenSecret);
      window.location.href = data.authorizeUrl;
    }, error => {
      console.log(error);
    });
  }
  render () {
    return (
      <div className="App">
        <h1>Lazy Image Diary</h1>
        <p><a className="btn.btn-evernote-signin" href="#" onClick={this.onClickSignIn}>Evernote Sign-in</a></p>
        <p>Lazy Image Diary is easy way to make diary on Evernote with your photos. <br />
          | All you need is sign-in with your Evernote account and upload your photos from the upload form. <br />
          | Then you would get auto generated posts with your photos on your Evernote "Diary" notebook.</p>
      </div>
    );
  }
}

export default Default;
