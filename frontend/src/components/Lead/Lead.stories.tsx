import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Lead, IProps } from './Lead';

const stories = storiesOf('Atoms', module);

stories.add(
  'Lead',
  () => {
    const props: IProps = {
      onClickSignIn: action('Sign-in')
    };
    return <Lead {...props} />;
  },
  { notes: 'Lead text' }
);
