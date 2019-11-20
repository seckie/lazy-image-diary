import * as React from 'react';
import './Logo.css';

export interface IProps {}

export const Logo: React.FC<IProps> = props => {
  return <h1 className="logo">Lazy Image Diary</h1>;
};
