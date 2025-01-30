# LENS CLOSET

## 使用技術一覧

<p style="display: inline">
　<!-- フロントエンドの言語一覧 -->
    <img src="https://img.shields.io/badge/-HTML-FF5733.svg?logo=html5&logoColor=FFFFFF&style=for-the-badge">
    <img src="https://img.shields.io/badge/-CSS-2965f1.svg?logo=css3&logoColor=white&style=for-the-badge">
    <img src="https://img.shields.io/badge/-TypeScript-007ACC.svg?logo=typescript&logoColor=white&style=for-the-badge">
    <!-- フレームワーク -->
    <img src="https://img.shields.io/badge/-React-61DAFB.svg?logo=react&logoColor=black&style=for-the-badge">  
  <img src="https://img.shields.io/badge/-Next.js-000000.svg?logo=nextdotjs&style=for-the-badge">
  <!-- DB -->
  <img src="https://img.shields.io/badge/-Supabase-3ECF8E.svg?logo=supabase&logoColor=white&style=for-the-badge">
  <!-- インフラ -->
  <img src="https://img.shields.io/badge/-Vercel-000000.svg?logo=vercel&style=for-the-badge">
</p>

## 概要

### アプリを作ったきっかけ

エンジニアとして 2 年目を迎え、さらなる知識の習得を目指して技術記事を閲覧しておりますが、検索上位にあるものは初心者向けの内容が多く、既知の情報が大半を占めております。一方、公式ドキュメントは高度であり、直接理解することが難しいと感じております。このような状況を改善するため、記事に対してコメントや難易度評価が可能なブログサイトを作ることにしました。これにより、自分が知りたい知識をキーワードで検索し、難易度が近いものから読み始めることが可能になる思いました。

### アプリ機能説明

・記事一覧、詳細の表示、検索を行うことができる。

・記事にたいしてコメントができ、そのコメントの編集、削除をすることができる。

### 今後の実装予定

・記事の投稿：ログインユーザーが CMS で自由な投稿を可能とする。

・記事の有料化：投稿記事を有料化。ログインユーザーのみ、購入し、閲覧を可能とする。

・記事の難易度をユーザーが評価：難易度による検索やソートを可能とする。

・プロフィール画面の実装：ユーザーの投稿記事、購入記事、過去のコメントをまとめて参照することを可能とする。

### アプリ表示側イメージ

![スクリーンショット 2025-01-08 1 48 23](/public/top_page.png)

記事詳細画面
![スクリーンショット 2025-01-10 1 53 01](/public/blog_page.png)

ログイン画面
![スクリーンショット 2025-01-10 1 54 46](/public/login.png)

### アプリ URL

追記予定

## 開発環境の構築方法

### 構築環境

Node.js

1. git clone

```
git clone https://github.com/zameemallik/zamee_portfolio_blogs.git blogProtfolio
```

2. 環境変数ファイルの作成

```
cd blogProtfolio
cp .env.example .env
```

3. Supabase から URL と API_KEY を取得し.env に記載

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_API_KEY=
```

4. パッケージインストール

```
npm install
```

5. local サーバー起動

```
npm run dev
```
