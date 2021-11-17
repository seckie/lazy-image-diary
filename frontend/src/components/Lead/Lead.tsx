import React from 'react';
import './Lead.css';
import { Button, ButtonStyle } from '../Button/Button';

export interface IProps {
  onClickSignIn: () => void;
}

export const Lead: React.FC<IProps> = props => {
  return (
    <div className="lead">
      <p className="lead__text">
        画像をアップロードするだけで、あなたの Evernote に日記ができあがるサービスです。
        <br />
        Evernote ノートブックに日毎に1つのノートが作られ、画像が撮影日時順に自動的に並べられます。
        <br />
        日々、写真を撮影し、Lazy Image Diary を使って日常を記録しましょう。
      </p>
      <p className="lead__btn">
        <Button onClick={props.onClickSignIn} styles={[ButtonStyle.evernote]} label="Sign-in with Evernote" />
      </p>
    </div>
  );
};
