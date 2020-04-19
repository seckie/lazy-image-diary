import * as React from 'react';
import { shallow } from 'enzyme';
import { UploadInput } from '../../components/UploadInput/UploadInput';

describe('UploadInput', () => {
  it('render', () => {
    const onChange = jest.fn();
    const el = shallow(<UploadInput onChange={onChange} />);
    expect(el.find('.uploadInput')).toHaveLength(1);
    expect(el.find('label')).toHaveLength(1);
    expect(el.find('input[type="file"]')).toHaveLength(1);
  });
  it('onChange prop should be passed to input element', () => {
    const onChange = jest.fn();
    const el = shallow(<UploadInput onChange={onChange} />);
    const input = el.find('input');
    expect(input.prop('onChange')).toEqual(onChange);
    input.simulate('change');
    expect(onChange).toBeCalled();
  });
});
