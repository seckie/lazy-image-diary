import axios, { AxiosRequestConfig } from 'axios';
import { readFile, uploadFile } from '../../services/file';
import { UPLOAD_STATUS, API_CREATE_IMAGE_NOTE_URL } from '../../constants';
jest.mock('axios', () => {
  return jest.fn().mockImplementation((opt) => {
    return new Promise((resolve, reject) => {
      if (opt.headers.authorization) {
        resolve('resolved');
      } else {
        reject('rejected');
      }
    });
  });
});

describe('file service', () => {
  const blob = new Blob(
    [ { fileContents: 'foo' } as any ],
    { type: 'text/plain' }
  );
  const blob2 = new Blob(
    [ { fileContents: 'bar' } as any ],
    { type: 'text/plain' }
  );
  const FILE_NAME = 'name';
  const FILE_NAME2 = 'name2';
  const lastModifiedTimestamp = (new Date('2019-09-01')).getTime();
  const lastModifiedTimestamp2 = (new Date('2019-09-02')).getTime();
  const file = new File([blob], FILE_NAME, {
    lastModified: lastModifiedTimestamp
  });
  const file2 = new File([blob], FILE_NAME2, {
    lastModified: lastModifiedTimestamp
  });
  const TOKEN = 'token';
  let res: any;

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
    let originalFileReader: any;
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

  describe('uploadFile()', () => {
    const formData = new FormData();
    formData.append('fileData', file);
    formData.append('fileData', file2);
    const lastModified = [
      lastModifiedTimestamp.toString(),
      lastModifiedTimestamp2.toString()
    ];
    formData.append('fileLastModified', JSON.stringify(lastModified));
    const opt: AxiosRequestConfig = {
      method: 'post',
      url: API_CREATE_IMAGE_NOTE_URL,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'authorization': TOKEN 
      }
    };
    let res: any;
    it('return Promise', () => {
      res = uploadFile([file, file2], TOKEN);
      expect(res instanceof Promise).toBe(true);
    });
    it('call axios with the POST args', () => {
      res = uploadFile([file, file2], TOKEN);
      expect(axios).toBeCalledWith(
        expect.objectContaining(opt)
      );
    });
    it('return resolved axios response', async () => {
      res = await uploadFile([file, file2], TOKEN);
      expect(res).toBe('resolved');
    });
    it('return rejected axios response', async () => {
      await uploadFile([file, file2], '').catch((e) => {
        expect(e).toBe('rejected');
      })
    });
  });
});
