import React from "react";
import "./Lead.css";

interface IProps {
  onClickSignIn: () => void;
}

export const Lead: React.FC<IProps> = props => {
  return (
    <div className="lead">
      <p className="lead__text">
        画像をアップロードするだけで、あなたの Evernote
        に日記ができあがるサービスです。
        <br />
        Evernote
        ノートブックに日毎に1つのノートが作られ、画像が撮影日時順に自動的に並べられます。
        <br />
        日々、写真を撮影し、Lazy Image Diary を使って日常を記録しましょう。
      </p>
      <p className="lead__btn">
        <button
          className="btn btn-evernote-signin"
          onClick={props.onClickSignIn}
        >
          Sign-in with Evernote
        </button>
      </p>
    </div>
  );
};
