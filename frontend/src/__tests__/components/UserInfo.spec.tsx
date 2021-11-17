import * as React from 'react';
import { shallow } from 'enzyme';
import { UserInfo } from '../../components/UserInfo/UserInfo';

describe('UserInfo', () => {
  const props = {
    evernoteID: 'id'
  };
  const el = shallow(<UserInfo {...props} />);
  it('render', () => {
    expect(el.find('p.userInfo')).toHaveLength(1);
  });
  it('"evernoteID" prop will be inserted as text', () => {
    expect(new RegExp(`${props.evernoteID}$`).test(el.text())).toBe(true);
  });
});
