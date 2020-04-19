import * as React from 'react';
import classNames from 'classnames';
import { IFileData } from '../../models';
import './MediaList.css';

export interface IProps {
  dataset: IFileData[];
  isUploading?: boolean;
}

export const MediaList: React.FC<IProps> = props => {
  let emptyList = new Array(5).fill('');
  emptyList = emptyList.map((item, i) => <li className="media media____empty" key={i} />);

  return (
    <div className="mediaList mediaList____undone">
      <ul className="medias">
        {(!props.dataset || !props.dataset[0]) && emptyList}
        {props.dataset &&
          props.dataset.map((data: IFileData, i: number) => {
            const mediaCName = classNames({
              media: true,
              media____uploading: props.isUploading
            });
            return (
              <li className={mediaCName} key={`media${i}`}>
                <img
                  className="thumb"
                  src={data.path}
                  title={global.escape(data.file.name)}
                  alt={global.escape(data.file.name)}
                />
                <div className="media__name">{data.file.name}</div>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

MediaList.defaultProps = {
  isUploading: false
};
