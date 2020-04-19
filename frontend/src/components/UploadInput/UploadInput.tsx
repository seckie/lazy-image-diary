import * as React from 'react';
import './UploadInput.css';

export interface IProps {
  onChange: (e: React.FormEvent) => void;
}

export const UploadInput: React.FC<IProps> = props => {
  return (
    <p className="uploadInput">
      <label htmlFor="imagefiles">画像ファイルを選択</label>
      <input
        type="file"
        name="imagefiles[]"
        id="imagefiles"
        multiple
        accept=".jpg,.jpeg,.png,.gif"
        onChange={props.onChange}
      />
    </p>
  );
};
