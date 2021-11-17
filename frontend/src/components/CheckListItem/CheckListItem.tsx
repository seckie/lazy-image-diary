import * as React from 'react';
import classNames from 'classnames';
import './CheckListItem.css';

export enum CheckListItemStyle {
  OK = 'check',
  NG = 'times'
}

export interface IProps {
  text: string;
  style: CheckListItemStyle;
}

export const CheckListItem: React.FC<IProps> = props => {
  const itemStyle = classNames({
    fas: true,
    'fa-check': props.style === CheckListItemStyle.OK,
    'fa-times': props.style === CheckListItemStyle.NG
  });
  return (
    <dd className="checklist__item">
      <i className={itemStyle}></i>
      {' ' + props.text}
    </dd>
  );
};
