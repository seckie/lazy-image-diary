import React from 'react';
import ReactDOM from 'react-dom';
import Default from './Default';

xit('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Default />, div);
  ReactDOM.unmountComponentAtNode(div);
});
