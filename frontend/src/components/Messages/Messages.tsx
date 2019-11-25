import * as React from 'react';

export interface IProps {
  messages?: React.ReactNode[];
  errorMessages?: React.ReactNode[];
}

export const Messages: React.FC<IProps> = props => {
  return (
    <ul className="messages">
      {props.messages &&
        props.messages.map((message, i) => {
          return (
            <li className="messages__item" key={i}>
              <i className="fas fa-check"></i> {message}
            </li>
          );
        })}
      {props.errorMessages &&
        props.errorMessages.map((message, i) => {
          return (
            <li className="messages__item" key={i}>
              <i className="fas fa-times"></i> {message}
            </li>
          );
        })}
    </ul>
  );
};
