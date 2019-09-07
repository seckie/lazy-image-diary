import * as React from 'react';
import { shallow } from 'enzyme';
import { NotFound } from '../../containers/NotFound';

describe('NotFound', () => {
  describe('render', () => {
    it('render title', () => {
      const TITLE = '404 Not Found';
      const el = shallow(<NotFound  />);
      expect(el.find('h1').text()).toBe(TITLE);
    });
  });
});
