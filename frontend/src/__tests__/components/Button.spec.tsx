import * as React from 'react';
import { shallow } from 'enzyme';
import { Button, IProps as IButtonProps, ButtonStyle } from '../../components/Button/Button';

describe('Button component', () => {
  describe('props', () => {
    it('label prop should be set as button label', () => {
      const LABEL = 'label';
      const props: IButtonProps = {
        label: LABEL
      };
      const el = shallow(<Button {...props} />);
      expect(el.text()).toBe(props.label);
    });
    it('disable prop should be set to "disabled" prop', () => {
      const props: IButtonProps = {
        disabled: true
      };
      const el = shallow(<Button {...props} />);
      expect(el.prop('disabled')).toEqual(props.disabled);
    });
    it('onClick prop should be set to "onClick" prop', () => {
      const props: IButtonProps = {
        onClick: jest.fn()
      };
      const el = shallow(<Button {...props} />);
      expect(el.prop('onClick')).toEqual(props.onClick);
      el.simulate('click');
      expect(props.onClick).toBeCalled();
    });
    it('styles prop should change className', () => {
      const styles = [ButtonStyle.evernote];
      const props: IButtonProps = {
        styles
      };
      const el = shallow(<Button {...props} />);
      styles.forEach(style => {
        expect(el.hasClass(style)).toBe(true);
      });
    });
  });
  describe('render', () => {
    it('button.button', () => {
      const el = shallow(<Button />);
      expect(el.find('button')).toHaveLength(1);
    });
  });
});
