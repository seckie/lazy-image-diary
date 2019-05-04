import {IActions} from '../actions/';
import {SIGN_IN, OAUTH_CALLBACK} from '../constants/';

export interface IState {
  // TODO: modelへ持っていく
  accessToken: string,
  user: object
}

export default function Reducer (state: IState, action: IActions) {
  switch (action.type) {
    case SIGN_IN:    
      return state;
    case OAUTH_CALLBACK:    
      return {
        ...state,
        accessToken: action.payload.accessToken,
        user: action.payload.user
      };
    default:
      return state;
  }
};
