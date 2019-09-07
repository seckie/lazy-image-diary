import * as React from 'react';
import { shallow } from 'enzyme';
import { CreateDiary, mapStateToProps, mapDispatchToProps } from '../../containers/CreateDiary';
import actions from '../../actions';
import { UPLOAD_STATUS } from '../../constants';

describe('CreateDiary', () => {
  describe('mapStateToProps', () => {
    const state = {
      test: 'test'
    };
    it('just return state without mutation', () => {
      expect(mapStateToProps(state)).toEqual(state);
    });
  });
  describe('mapDispatchToProps', () => {
    const dispatch = jest.fn();
    const props = mapDispatchToProps(dispatch);
    const RES = 'sign in response';
    const spy = jest.spyOn(actions, 'fileFieldOnChange').mockImplementation((): any => RES);
    it('onChange() method calls dispatched fileFieldOnChange()', () => {
      const ev: any = {};
      props.onChange(ev);
      expect(spy).toBeCalled();
      expect(dispatch).toBeCalledWith(RES);
    });
  });
  describe('render', () => {
    const props: any = {
      fileDataset: [],
      onChange: jest.fn()
    };
    it('display user.name', () => {
      const el = shallow(<CreateDiary {...props} />);
      expect(el.find('p').at(0).text()).toBe('Evernote User Name: User A');
    });
    it('set onChange to input[type="file"]', () => {
      const localProps = {
        ...props,
        onChange: jest.fn()
      };
      const el = shallow(<CreateDiary {...localProps} />);
      el.find('input[type="file"]').simulate('change');
      expect(localProps.onChange).toBeCalled();
    });
    describe('display media blocks with fileDataset prop', () => {
      const DATA1 = {
        file: { name: 'file1' },
        status: UPLOAD_STATUS.complete,
        path: 'path1'
      };
      const DATA2 = {
        file: { name: 'file2&()\\' },
        status: UPLOAD_STATUS.uploading,
        path: 'path2'
      };
      const localProps: any = {
        props,
        fileDataset: [ DATA1, DATA2 ]
      };
      const el = shallow(<CreateDiary {...localProps} />);
      const medias = el.find('.media');
      it('media has "media--uploading" className during uploading', () => {
        const CNAME = 'media--uploading';
        expect(medias.at(0).hasClass(CNAME)).toBe(false);
        expect(medias.at(1).hasClass(CNAME)).toBe(true);
      });
      it('IMG src attribute should be data.path', () => {
        expect(medias.at(0).find('img').prop('src')).toBe(DATA1.path);
        expect(medias.at(1).find('img').prop('src')).toBe(DATA2.path);
      });
      it('IMG title attribute should be escaped data.file.name', () => {
        expect(medias.at(0).find('img').prop('title')).toBe(escape(DATA1.file.name));
        expect(medias.at(1).find('img').prop('title')).toBe(escape(DATA2.file.name));
      });
      it('IMG alt attribute should be escaped data.file.name', () => {
        expect(medias.at(0).find('img').prop('alt')).toBe(escape(DATA1.file.name));
        expect(medias.at(1).find('img').prop('alt')).toBe(escape(DATA2.file.name));
      });
    });
  });
});
