import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Notes } from '../../components/Notes/Notes';

describe('Notes component', () => {
  const items = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    <div>
      Ut enim ad minim veniam, <a href="#somewhere">quis nostrud exercitation ullamco</a> laboris nisi ut aliquip ex ea
      commodo consequat.
    </div>
  ];
  it('render', () => {
    const el = shallow(<Notes items={items} />);
    expect(el.find('ul.notes')).toHaveLength(1);
  });
  it('items prop should be passed into each "li" element', () => {
    const el = mount(<Notes items={items} />);
    el.find('li').forEach((item, i) => {
      expect(item.containsMatchingElement(items[i] as any)).toBe(true);
    });
  });
});
