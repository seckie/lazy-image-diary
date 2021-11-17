import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { MediaList } from './MediaList';
import sampleImg from '../../assets/sample.jpg';

const stories = storiesOf('Molecules', module);

const dataset: any[] = [
  {
    file: { name: 'file1.jpg' },
    path: sampleImg
  },
  {
    file: { name: 'file2.jpg' },
    path: sampleImg
  },
  {
    file: { name: 'file3.jpg' },
    path: sampleImg
  },
  {
    file: { name: 'file4.jpg' },
    path: sampleImg
  },
  {
    file: { name: 'file5.jpg' },
    path: sampleImg
  },
  {
    file: { name: 'file6.jpg' },
    path: sampleImg
  },
  {
    file: { name: 'file7.jpg' },
    path: sampleImg
  },
  {
    file: { name: 'file8.jpg' },
    path: sampleImg
  },
  {
    file: { name: 'file9.jpg' },
    path: sampleImg
  },
  {
    file: { name: 'file10.jpg' },
    path: sampleImg
  }
];

stories.add(
  'MediaList',
  () => {
    return <MediaList dataset={dataset} />;
  },
  { notes: 'Input field to upload file' }
);
