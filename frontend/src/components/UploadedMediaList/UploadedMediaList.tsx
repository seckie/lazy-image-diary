import * as React from 'react';
import { IFileData } from '../../models';
import './UploadedMediaList.css';

export interface IProps {
  dataset: IFileData[];
}

export const UploadedMediaList: React.FC<IProps> = props => {
  if (props.dataset && props.dataset[0]) {
    return (
      <div className="mediaList mediaList____done">
        <h2 className="mediaList__h">アップロード済み</h2>
        <ul className="medias">
          {props.dataset.map((data: IFileData, i: number) => {
            return (
              <li className="media" key={`media${i}`}>
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
  }
  return <></>;
};
