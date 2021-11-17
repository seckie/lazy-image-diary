import * as React from 'react';
import classNames from 'classnames';
import './Button.css';

export enum ButtonStyle {
  evernote = 'button____evernote'
}

export interface IProps {
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
  styles?: ButtonStyle[];
}

export const Button: React.FC<IProps> = props => {
  const cName: string = classNames({
    button: true,
    button____evernote: props.styles!.includes(ButtonStyle.evernote)
  });
  return (
    <button className={cName} disabled={props.disabled} onClick={props.onClick}>
      {props.label}
    </button>
  );
};

Button.defaultProps = {
  disabled: false
};

Button.defaultProps = {
  styles: []
};
