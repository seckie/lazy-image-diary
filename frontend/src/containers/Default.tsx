import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { TermsOfService } from '../components/TermsOfService/TermsOfService';
import { Lead } from '../components/Lead/Lead';
import { Logo } from '../components/Logo/Logo';

import actions from '../actions/';

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
          <Logo />
        </header>
        <Lead onClickSignIn={this.props.onClickSignIn} />
        <TermsOfService />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Default);
