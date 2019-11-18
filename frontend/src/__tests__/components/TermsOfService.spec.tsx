import * as React from 'react';
import { shallow } from 'enzyme';

import { TermsOfService } from '../../components/TermsOfService/TermsOfService';
import { Terms } from '../../components/Terms/Terms';

describe('TermsOfService component', () => {
  describe('render', () => {
    const el = shallow(<TermsOfService />);
    it('div.termsofservice exists', () => {
      expect(el.find('div.termsofservice')).toHaveLength(1);
    });
    it('Terms exists', () => {
      expect(el.find(Terms)).toHaveLength(1);
    });
  });
});
