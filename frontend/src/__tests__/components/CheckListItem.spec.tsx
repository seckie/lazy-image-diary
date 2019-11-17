import * as React from 'react';
import { shallow } from 'enzyme';
import {
  CheckListItem,
  CheckListItemStyle,
  IProps as ICheckListeItemProps
} from '../../components/CheckListItem/CheckListItem';

describe('CheckListeItem component', () => {
  describe('props', () => {
    const TEXT = 'text';
    it('text prop should be put as text', () => {
      const props: ICheckListeItemProps = {
        text: TEXT,
        style: CheckListItemStyle.OK
      };
      const el = shallow(<CheckListItem {...props} />);
      expect(el.find('dd').text()).toBe(TEXT);
    });
    it('style prop should change icon style OK', () => {
      const props: ICheckListeItemProps = {
        text: TEXT,
        style: CheckListItemStyle.OK
      };
      const el = shallow(<CheckListItem {...props} />);
      expect(el.find('i').hasClass('fa-check')).toBe(true);
    });
    it('style prop should change icon style NG', () => {
      const props: ICheckListeItemProps = {
        text: TEXT,
        style: CheckListItemStyle.NG
      };
      const el = shallow(<CheckListItem {...props} />);
      expect(el.find('i').hasClass('fa-times')).toBe(true);
    });
  });
  describe('render', () => {
    it('dd.checklist__item', () => {
      const props: ICheckListeItemProps = {
        text: 'text',
        style: CheckListItemStyle.OK
      };
      const el = shallow(<CheckListItem {...props} />);
      expect(el.find('dd.checklist__item')).toHaveLength(1);
    });
  });
});
