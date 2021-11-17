import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Button, ButtonStyle, IProps } from './Button';

const stories = storiesOf('Atoms', module);

stories.add(
  'Button',
  () => {
    const props: IProps = {
      onClick: action('onClick')
    };
    const propsDefault: IProps = {
      ...props,
      label: 'Default style button'
    };
    const propsDisabled: IProps = {
      ...props,
      disabled: true,
      label: 'Disabled style button'
    };
    const propsEvernote: IProps = {
      ...props,
      label: 'Evernote Sign-In style button',
      styles: [ButtonStyle.evernote]
    };
    return (
      <>
        <p>
          <Button {...propsDefault} />
        </p>
        <p>
          <Button {...propsDisabled} />
        </p>
        <p>
          <Button {...propsEvernote} />
        </p>
      </>
    );
  },
  { notes: 'Button' }
);
