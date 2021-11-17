import * as React from 'react';
import './Terms.css';

export interface IProps {
  items: React.ReactNode[];
}

export const Terms: React.FC<IProps> = props => {
  return (
    <ul className="terms">
      {props.items.map((item, i) => (
        <li className="terms__item" key={i}>
          {item}
        </li>
      ))}
    </ul>
  );
};
