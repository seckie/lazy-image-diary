import React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import history from 'history';

import actions from '../actions';

export function mapStateToProps (state: any) {
  return state;
}
export function mapDispatchToProps (dispatch: Dispatch) {
  return {
    oauthCallback: () => dispatch(actions.oauthCallback())
  }
}

export interface IProps {
  history: history.History,
  oauthCallback: () => void,
  accessToken: string,
  user: object
}

export class OAuthCallback extends React.Component<IProps> {
  componentDidMount () {
    this.props.oauthCallback();
  }
  componentDidUpdate(prevProps: IProps) {
    if (this.props.accessToken) {
      this.props.history.replace('/create-diary');
    }
  }
  render () {
    return <></>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OAuthCallback);
