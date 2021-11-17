import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { UserInfo } from './UserInfo';

const stories = storiesOf('Atoms', module);

stories.add(
  'UserInfo',
  () => {
    return <UserInfo evernoteID="John Doe" />;
  },
  { notes: 'Show user infomation in header' }
);
