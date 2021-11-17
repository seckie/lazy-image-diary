import * as React from 'react';
import { shallow } from 'enzyme';
import { Logo } from '../../components/Logo/Logo';

describe('Logo component', () => {
  it('render', () => {
    const el = shallow(<Logo />);
    expect(el.hasClass('logo')).toBe(true);
  });
  it('Passing "href" prop to render with <a/>', () => {
    const HREF = 'href';
    const el = shallow(<Logo href={HREF} />);
    expect(el.find('a').prop('href')).toBe(HREF);
  });
  it('Not passing "href" prop to render without <a/>', () => {
    const el = shallow(<Logo />);
    expect(el.find('a')).not.toHaveLength(1);
  });
});
