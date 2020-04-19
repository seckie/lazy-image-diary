import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Messages } from './Messages';

const stories = storiesOf('Atoms', module);

stories.add(
  'Messages',
  () => {
    const messages = [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      <>
        Ut enim ad minim veniam, <a href="#somewhere">quis nostrud exercitation ullamco</a> laboris nisi ut aliquip ex
        ea commodo consequat.
      </>
    ];
    const errorMessages = [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      <>
        Ut enim ad minim veniam, <a href="#somewhere">quis nostrud exercitation ullamco</a> laboris nisi ut aliquip ex
        ea commodo consequat.
      </>
    ];
    return <Messages messages={messages} errorMessages={errorMessages} />;
  },
  { notes: 'List of messages including errors' }
);
