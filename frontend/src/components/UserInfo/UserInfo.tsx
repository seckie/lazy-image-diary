import * as React from 'react';
import './UserInfo.css';

export interface IProps {
  evernoteID: string;
}

export const UserInfo: React.FC<IProps> = props => {
  return <p className="userInfo">{props.evernoteID && `Evernote ID: ${props.evernoteID}`}</p>;
};
