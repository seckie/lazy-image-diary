import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { CheckListItem, CheckListItemStyle } from './CheckListItem';

const stories = storiesOf('Atoms', module);

stories.add(
  'CheckListItem',
  () => {
    return (
      <dl>
        <CheckListItem text="OK item" style={CheckListItemStyle.OK} />
        <CheckListItem text="NG item" style={CheckListItemStyle.NG} />
      </dl>
    );
  },
  { notes: 'CheckListItem is a part of CheckList compoment. Renders DD element with icon.' }
);
