import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Terms, IProps as ITermsProps } from '../../components/Terms/Terms';
import { CheckList, IProps as ICheckListProps } from '../../components/CheckList/CheckList';
import { CheckListItemStyle } from '../../components/CheckListItem/CheckListItem';

const stories = storiesOf('Molecules', module);

const LIST = [
  { text: 'list text 1', style: CheckListItemStyle.OK },
  { text: 'list text 2', style: CheckListItemStyle.NG }
];
const checkListProps: ICheckListProps = {
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
stories.add(
  'Terms',
  () => {
    const props: ITermsProps = {
      items: [
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </p>,
        <p>
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>,
        <CheckList {...checkListProps} />
      ]
    };
    return <Terms {...props} />;
  },
  {
    notes: 'List component that should be used as Terms-of-service'
  }
);
