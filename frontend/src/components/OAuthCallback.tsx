import React from 'react';
import queryString from 'query-string';
import axios from 'axios';
import history from 'history';
import {API_OAUTH_CALLBACK_URL} from '../constants/';

export interface IResponse {
  accessToken: string,
  user: object
}
export interface IProps {
  history: history.History
}

class OAuthCallback extends React.Component<IProps> {
  componentDidMount () {
    const query = queryString.parse(window.location.search);
    const newQuery = {
      oauthToken: window.sessionStorage.getItem('oauthToken'),
      oauthTokenSecret: window.sessionStorage.getItem('oauthTokenSecret'),
      oauth_verifier: query.oauth_verifier
    };
    const url = `${API_OAUTH_CALLBACK_URL}?${queryString.stringify(newQuery)}`;
    axios.get(url).then((res) => {
      const data = res.data;
      console.log(data.user); // TODO: save user data to store
      window.sessionStorage.removeItem('oauthToken');
      window.sessionStorage.removeItem('oauthTokenSecret');
      window.sessionStorage.setItem('accessToken', data.accessToken)
      this.props.history.replace('/create-diary');
    });
  }
  render () {
    return <></>;
  }
}

export default OAuthCallback;
