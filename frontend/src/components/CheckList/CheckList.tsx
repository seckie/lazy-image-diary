import * as React from 'react';
import { CheckListItem, IProps as ICheckListItem } from '../CheckListItem/CheckListItem';
import './CheckList.css';

export interface CheckListGroup {
  title: string;
  list: ICheckListItem[];
}

export interface IProps {
  groups: CheckListGroup[];
}

export const CheckList: React.FC<IProps> = props => {
  const groups = props.groups.map((group, i) => {
    return (
      <React.Fragment key={i}>
        <dt className="checklist__title">{group.title}</dt>
        {group.list.map((item, j) => (
          <CheckListItem {...item} key={j} />
        ))}
      </React.Fragment>
    );
  });
  return <dl className="checklist">{groups}</dl>;
};
