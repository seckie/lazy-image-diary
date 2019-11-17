import * as React from 'react';
import { shallow } from 'enzyme';
import { CheckList, IProps as ICheckListProps } from '../../components/CheckList/CheckList';
import {
  CheckListItem,
  CheckListItemStyle,
  IProps as ICheckListItemProps
} from '../../components/CheckListItem/CheckListItem';

describe('CheckListeItem component', () => {
  const LIST: ICheckListItemProps[] = [
    {
      text: 'list item 1',
      style: CheckListItemStyle.OK
    },
    {
      text: 'list item 2',
      style: CheckListItemStyle.NG
    }
  ];
  describe('props', () => {
    const TITLE = 'title';
    const TITLE2 = 'title2';
    const props: ICheckListProps = {
      groups: [
        {
          title: TITLE,
          list: LIST
        },
        {
          title: TITLE2,
          list: LIST
        }
      ]
    };
    const el = shallow(<CheckList {...props} />);
    it('group.title prop should be put as DT element', () => {
      props.groups.forEach((group, i) => {
        expect(
          el
            .find('dt')
            .at(i)
            .text()
        ).toBe(group.title);
      });
    });
    it('group.list prop should be put as DD element', () => {
      const items = el.find(CheckListItem);
      let index = 0;
      props.groups.forEach((group, i) => {
        group.list.forEach((item, j) => {
          const itemEl = items.at(index);
          expect(itemEl.prop('text')).toBe(item.text);
          index++;
        });
      });
    });
  });
  it('render DL.checklist', () => {
    const props: ICheckListProps = {
      groups: [
        {
          title: 'title',
          list: LIST
        }
      ]
    };
    const el = shallow(<CheckList {...props} />);
    expect(el.find('dl.checklist')).toHaveLength(1);
  });
});
