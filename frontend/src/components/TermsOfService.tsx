import React from "react";
import "./TermsOfService.css";

export interface IProps {}

export const TermsOfService: React.FC<IProps> = () => {
  return (
    <div className="termsofservice">
      <h2>サービス利用規約</h2>
      <ul className="terms">
        <li className="terms__item">
          このサービスはあなたの Evernote
          へのアクセス権を要求します。サインイン画面にて権限についてよく確認した上で承認ボタンをクリックしてください
          <dl className="checklist">
            <dt className="checklist__title">このサービスが取得する権限</dt>
            <dd className="checklist__item">
              <i className="fas fa-check"></i> ノート・ノートブック・タグを作成
            </dd>
            <dd className="checklist__item">
              <i className="fas fa-check"></i> ノート・ノートブック・タグを更新
            </dd>
            <dd className="checklist__item">
              <i className="fas fa-check"></i> ノートブックとタグを一覧化
            </dd>
            <dd className="checklist__item">
              <i className="fas fa-check"></i> ノートを取得
            </dd>
            <dt className="checklist__title">このサービスが取得しない権限</dt>
            <dd className="checklist__item">
              <i className="fas fa-times"></i> ノートブック・タグを削除
            </dd>
            <dd className="checklist__item">
              <i className="fas fa-times"></i> アカウント情報にアクセス
            </dd>
            <dd className="checklist__item">
              <i className="fas fa-times"></i> ノートを完全に削除
            </dd>
            <dd className="checklist__item">
              <i className="fas fa-times"></i> ユーザアカウント情報を更新
            </dd>
          </dl>
        </li>
        <li className="terms__item">
          このサービスはあなたの "Diary" という名前の Evernote
          ノートブックを対象に、日付検索を行い該当の日付のノートがあれば内容を取得します。すでにその日付のノートがあればそれを更新し、なければ新しいノートを作る実装になっているためです。取得したノートの内容は、アップロードした画像を適切な箇所に挿入する目的のためだけに利用されます。
        </li>
        <li className="terms__item">
          あなたの Evernote
          から取得したノートブックとノートの内容をこのサービスが保存することはありません。
        </li>
        <li className="terms__item">
          あなたがアップロードした画像をこのサービスが保存することはありません。
        </li>
        <li className="terms__item">
          これらのポリシーに抵抗がある方はご利用なさらないでください。なお、サービスのソースコードはオープンソースで公開しています。もしコードを読める方はソースを読めばそのような実装になっていることは確認できますし、Evernote
          API Key
          を取得しさえすればご自身でこのサービスを動作させることができます。
        </li>
        <li className="terms__item">
          このサービス自体の所有権と著作権は管理人である{" "}
          <a
            href="https://github.com/seckie"
            target="_blank"
            rel="noopener noreferrer"
          >
            Naoki Sekiguchi
          </a>{" "}
          に帰属しますが、あなたがアップロードしたコンテンツや、あなたのEvernoteコンテンツについての所有権と著作権はあなたにあります。後者について管理人は一切関知しません。
        </li>
        <li className="terms__item">
          あなたがこのサービスを使うことによって被ったいかなる結果も、管理人は責任を持ちません。自己責任でご利用ください。
        </li>
        <li className="terms__item">
          もしサービスやプログラムの不具合を見つけたら{" "}
          <a
            href="https://github.com/seckie/lazy-image-diary/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub の Issue
          </a>{" "}
          でご報告いただけると管理人は喜びます。
        </li>
      </ul>
    </div>
  );
};
