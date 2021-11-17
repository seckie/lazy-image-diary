import * as React from 'react';
import { shallow } from 'enzyme';
import { Terms, IProps as ITermsProps } from '../../components/Terms/Terms';

describe('Terms component', () => {
  describe('props', () => {
    it('items props should render as ReactNode', () => {
      const TEXT = 'text';
      const TEXT2 = 'text2';
      const props: ITermsProps = {
        items: [<p>{TEXT}</p>, <p>{TEXT2}</p>]
      };
      const el = shallow(<Terms {...props} />);
      const items = el.find('p');
      expect(items.at(0).text()).toBe(TEXT);
      expect(items.at(1).text()).toBe(TEXT2);
    });
  });
  it('render ul.terms', () => {
    const props: ITermsProps = {
      items: ['']
    };
    const el = shallow(<Terms {...props} />);
    expect(el.type()).toBe('ul');
    expect(el.hasClass('terms')).toBe(true);
  });
});
