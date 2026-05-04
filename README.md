# ToDo App

シンプルなToDoアプリです。タスクの追加・完了チェック・削除の3機能のみ。

## 特徴

- 純粋なHTML / CSS / JavaScript（フレームワーク不要）
- データは `localStorage` に保存（サーバー不要）
- ダークモード自動対応
- 日本語UI

## ローカルで動かす

`index.html` をブラウザで開くだけ。

## Vercelへのデプロイ

### 方法1: Vercel CLI

```bash
npm i -g vercel
cd todo-app
vercel
```

質問に答えるだけでデプロイ完了します。

### 方法2: GitHub経由

1. このフォルダをGitHubリポジトリにpush
2. [vercel.com](https://vercel.com) でリポジトリをImport
3. 設定はそのまま（静的サイトとして自動検出されます）
4. Deployをクリック

## ファイル構成

```
todo-app/
├── index.html      # マークアップ
├── style.css       # スタイル
├── script.js       # ロジック
├── package.json
├── vercel.json
└── README.md
```
