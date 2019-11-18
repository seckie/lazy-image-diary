import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { TermsOfService } from '../../components/TermsOfService/TermsOfService';

const stories = storiesOf('Organisms', module);

stories.add(
  'TermsOfService',
  () => {
    return <TermsOfService />;
  },
  { notes: 'Terms of service' }
);
