import * as React from 'react';
import './Notes.css';

export interface IProps {
  items: React.ReactNode[];
}

export const Notes: React.FC<IProps> = props => {
  return (
    <ul className="notes">
      {props.items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
};
