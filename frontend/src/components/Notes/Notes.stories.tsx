import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Notes } from './Notes';

const stories = storiesOf('Atoms', module);

stories.add(
  'Notes',
  () => {
    const items = [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      <>
        Ut enim ad minim veniam, <a href="#somewhere">quis nostrud exercitation ullamco</a> laboris nisi ut aliquip ex
        ea commodo consequat.
      </>
    ];
    return <Notes items={items} />;
  },
  { notes: 'List of notes' }
);
