import React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';

import actions from '../actions/';

export interface IProps {
  onClickSignIn: () => void
}

export function mapStateToProps(state: any) {
  return state;
}

export function mapDispatchToProps (dispatch: Dispatch) {
  return {
    onClickSignIn: () => dispatch(actions.signIn())
  };
}

export class Default extends React.Component<IProps> {
  render () {
    return (
      <div className="App">
        <h1>Lazy Image Diary</h1>
        <p><button className="btn btn-evernote-signin" onClick={this.props.onClickSignIn}>Evernote Sign-in</button></p>
        <p>Lazy Image Diary is easy way to make diary on Evernote with your photos. <br />
          | All you need is sign-in with your Evernote account and upload your photos from the upload form. <br />
          | Then you would get auto generated posts with your photos on your Evernote "Diary" notebook.</p>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Default);
