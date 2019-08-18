import {
  SIGN_IN,
  OAUTH_CALLBACK,
  FILE_FIELD_ON_CHANGE,
  FILE_FIELD_NO_FILE
} from '../constants/index';


export interface IAction {
  type: string,
  payload?: any
};

export interface IFileFieldOnChangeAction extends IAction {
  payload: IFileFieldOnChangePayload
};
interface IFileFieldOnChangePayload {
  files: File[]
};

export interface IActions {
  signIn: () => IAction,
  oauthCallback: () => IAction,
  fileFieldOnChange: (e: React.FormEvent) => IAction,
};

 const Actions: IActions = {
  signIn () {
    return {
      type: SIGN_IN
    };
  },
  oauthCallback() {
    return {
      type: OAUTH_CALLBACK
    };
  },
  fileFieldOnChange (e: React.FormEvent) {
    const el: any = e.currentTarget;
    const files = el && el.files;
    if (!files) {
      return {
        type: FILE_FIELD_NO_FILE
      };
    } else {
      return {
        type: FILE_FIELD_ON_CHANGE,
        payload: {
          files
        }
      };
    }
  }
};

export default Actions;
