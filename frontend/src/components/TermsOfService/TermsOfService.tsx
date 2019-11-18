import * as React from 'react';
import './TermsOfService.css';
import { IProps as ITermsProps } from '../Terms/Terms';
import { CheckList, IProps as ICheckListProps } from '../CheckList/CheckList';
import { CheckListItemStyle } from '../CheckListItem/CheckListItem';
import { Terms } from '../Terms/Terms';

export interface IProps {}

export const TermsOfService: React.FC<IProps> = () => {
  const checkListProps: ICheckListProps = {
    groups: [
      {
        title: 'このサービスが取得する権限',
        list: [
          {
            text: 'ノート・ノートブック・タグを作成',
            style: CheckListItemStyle.OK
          },
          {
            text: 'ノート・ノートブック・タグを更新',
            style: CheckListItemStyle.OK
          },
          {
            text: 'ノートブックとタグを一覧化',
            style: CheckListItemStyle.OK
          },
          {
            text: 'ノートを取得',
            style: CheckListItemStyle.OK
          },
          {
            text: 'ノートを取得',
            style: CheckListItemStyle.OK
          }
        ]
      },
      {
        title: 'このサービスが取得しない権限',
        list: [
          {
            text: 'ノートブック・タグを削除',
            style: CheckListItemStyle.NG
          },
          {
            text: 'アカウント情報にアクセス',
            style: CheckListItemStyle.NG
          },
          {
            text: 'ノートを完全に削除',
            style: CheckListItemStyle.NG
          },
          {
            text: 'ユーザアカウント情報を更新',
            style: CheckListItemStyle.NG
          }
        ]
      }
    ]
  };
  const termsItems: ITermsProps = {
    items: [
      <>
        このサービスはあなたの Evernote
        へのアクセス権を要求します。サインイン画面にて権限についてよく確認した上で承認ボタンをクリックしてください
        <CheckList {...checkListProps} />
      </>,
      'このサービスはあなたの "Diary" という名前の Evernote ノートブックを対象に、日付検索を行い該当の日付のノートがあれば内容を取得します。すでにその日付のノートがあればそれを更新し、なければ新しいノートを作る実装になっているためです。取得したノートの内容は、アップロードした画像を適切な箇所に挿入する目的のためだけに利用されます。',
      'あなたの Evernote から取得したノートブックとノートの内容をこのサービスが保存することはありません。',
      'あなたがアップロードした画像をこのサービスが保存することはありません。',
      'これらのポリシーに抵抗がある方はご利用なさらないでください。なお、サービスのソースコードはオープンソースで公開しています。もしコードを読める方はソースを読めばそのような実装になっていることは確認できますし、Evernote API Key を取得しさえすればご自身でこのサービスを動作させることができます。',
      [
        'このサービス自体の所有権と著作権は管理人である ',
        <a href="https://github.com/seckie" target="_blank" rel="noopener noreferrer">
          Naoki Sekiguchi
        </a>,
        ' に帰属しますが、あなたがアップロードしたコンテンツや、あなたのEvernoteコンテンツについての所有権と著作権はあなたにあります。後者について管理人は一切関知しません。'
      ],
      'あなたがこのサービスを使うことによって被ったいかなる結果も、管理人は責任を持ちません。自己責任でご利用ください。',
      [
        'もしサービスやプログラムの不具合を見つけたら ',
        <a href="https://github.com/seckie/lazy-image-diary/issues" target="_blank" rel="noopener noreferrer">
          GitHub の Issue
        </a>,
        ' でご報告いただけると管理人は喜びます。'
      ]
    ]
  };
  return (
    <div className="termsofservice">
      <h2>サービス利用規約</h2>
      <Terms {...termsItems} />
    </div>
  );
};
