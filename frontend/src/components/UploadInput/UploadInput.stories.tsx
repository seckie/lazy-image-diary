import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { UploadInput } from './UploadInput';

const stories = storiesOf('Atoms', module);

stories.add(
  'UploadInput',
  () => {
    const onChange = (e: any) => action(e);
    return <UploadInput onChange={onChange} />;
  },
  { notes: 'Input field to upload file' }
);
