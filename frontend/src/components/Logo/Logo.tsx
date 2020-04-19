import * as React from 'react';
import './Logo.css';

export interface IProps {
  href?: string;
}

export const Logo: React.FC<IProps> = props => {
  const title = 'Lazy Image Diary';
  const content = props.href ? <a href={props.href}>{title}</a> : title;
  return <h1 className="logo">{content}</h1>;
};
