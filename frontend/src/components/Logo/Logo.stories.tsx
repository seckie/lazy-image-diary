import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Logo } from './Logo';

const stories = storiesOf('Atoms', module);

stories.add(
  'Logo',
  () => {
    return <Logo />;
  },
  { notes: 'Service Logo' }
);
