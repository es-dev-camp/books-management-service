# book-management-service

![](https://github.com/es-dev-camp/books-management-service/workflows/deploy/badge.svg) ![](https://github.com/es-dev-camp/books-management-service/workflows/nightly/badge.svg) ![](https://github.com/es-dev-camp/books-management-service/workflows/build/badge.svg) [![codecov](https://codecov.io/gh/es-dev-camp/books-management-service/branch/master/graph/badge.svg)](https://codecov.io/gh/es-dev-camp/books-management-service)

## 開発環境構築

### 事前準備

下記のコマンドが使える状態になっている必要があります。

* `node`
    * 10.x.y 系が望ましいです(firebase functions のランタイムが10系のため)
    * [Node.js 公式過去リリース](https://nodejs.org/dist/latest-v10.x/) から入手するか [nvm](https://github.com/nvm-sh/nvm) (もしくは [nvm-windows](https://github.com/coreybutler/nvm-windows)) を使ってインストールして下さい(長期的にNode.jsを触るのであればnvmがオススメです)
* `yarn`
    * [yarn](https://legacy.yarnpkg.com/lang/ja/)
* `firebase`
    * [Firebase CLI](https://firebase.google.com/docs/cli?hl=ja)

### セットアップ

1. プロジェクトルートで `yarn install:all`
1. Firebase にログイン `firebase login`
    * もし book-management-service のプロジェクトに参照できないアカウントにログインしている場合は、ログアウトの上切り替える `firebase logout`
1. `firebase projects:list` で自分のアカウントに紐付いている Firebase プロジェクトを確認しつつ、 book-management-service の Firebase プロジェクトに `(current)` が付いている(プロジェクトが選択されている)ことを確認する
    * もしそうなっていない場合は `firebase use <project-id>` で指されているプロジェクトを変更する
1. プロジェクトメンテナに確認して、各種シークレットをプロジェクトルートに `.env` ファイルとして保存する

### 開発

次のコマンドを別々のターミナルで実行する。

* プロジェクトルートで `yarn serve`
* コマンドプロンプトを別途開いて `yarn serve:functions`
