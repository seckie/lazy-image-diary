import { readFile, uploadFile } from '../../services/file';
import { UPLOAD_STATUS } from '../../constants';

describe('file service', () => {
  describe('readFile()', () => {
    const EV: any = {
      target: {
        result: 'foo'
      }
    };
    const readAsDataURL = jest.fn(function () {
      this.onload(EV);
    });
    const fakeFileReaderInstance = { readAsDataURL };
    const fakeFileReader = jest.fn(() => fakeFileReaderInstance);
    const blob = new Blob(
      [ { fileContents: 'foo' } as any ],
      { type: 'text/plain' }
    );
    const FILE_NAME = 'name';
    const file = new File([blob], FILE_NAME);
    let originalFileReader: any;
    let res: any;
    beforeEach(() => {
      originalFileReader = FileReader;
      Object.defineProperty(window, 'FileReader', {
        value: fakeFileReader
      });
    });
    afterEach(() =>{
      Object.defineProperty(window, 'FileReader', {
        value: originalFileReader
      });
    });
    it('return Promise', () => {
      res = readFile(file);
      expect(res instanceof Promise).toBe(true);
    });
    it('FileReader to be called', () => {
      res = readFile(file);
      expect(fakeFileReader).toBeCalled();
    });
    it('readAsDataURL to be called with "file"', () => {
      res = readFile(file);
      expect(readAsDataURL).toBeCalledWith(file);
    });
    it('resolve with "file", "path" and "status" data', async () => {
      const expected = {
        file,
        path: EV.target.result,
        status: UPLOAD_STATUS.uploading
      };
      res = await readFile(file);
      expect(res).toEqual(expected);
    });
  });
});
