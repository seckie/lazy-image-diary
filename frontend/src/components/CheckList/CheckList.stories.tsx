import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { CheckList, IProps as ICheckListProps } from '../CheckList/CheckList';
import { CheckListItemStyle } from '../CheckListItem/CheckListItem';

const stories = storiesOf('Molecules', module);

stories.add(
  'CheckList',
  () => {
    const LIST = [
      { text: 'list text 1', style: CheckListItemStyle.OK },
      { text: 'list text 2', style: CheckListItemStyle.NG }
    ];
    const props: ICheckListProps = {
      groups: [
        {
          title: 'List title 1',
          list: LIST
        },
        {
          title: 'List title 2',
          list: LIST
        }
      ]
    };
    return <CheckList {...props} />;
  },
  { notes: 'CheckList component' }
);
