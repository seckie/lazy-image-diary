import * as React from 'react';
import { shallow } from 'enzyme';
import { Logo } from '../../components/Logo/Logo';

describe('Logo component', () => {
  it('render', () => {
    const el = shallow(<Logo />);
    expect(el.hasClass('logo')).toBe(true);
  });
});
