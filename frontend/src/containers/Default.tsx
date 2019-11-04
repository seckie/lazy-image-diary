import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { TermsOfService } from "../components/TermsOfService";

import actions from "../actions/";

export interface IProps {
  onClickSignIn: () => void;
}

export function mapStateToProps(state: any) {
  return state;
}

export function mapDispatchToProps(dispatch: Dispatch) {
  return {
    onClickSignIn: () => dispatch(actions.signIn())
  };
}

export class Default extends React.Component<IProps> {
  render() {
    return (
      <div className="app">
        <header className="globalHeader">
          <h1 className="logo">Lazy Image Diary</h1>
        </header>
        <div className="lead">
          <p>
            <button
              className="btn btn-evernote-signin"
              onClick={this.props.onClickSignIn}
            >
              Evernote Sign-in
            </button>
          </p>
        </div>
        <TermsOfService />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Default);
