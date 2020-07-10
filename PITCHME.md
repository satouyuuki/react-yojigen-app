# 自己紹介
ゆうき(企画者)
---
# 伝えたいこと
どのようにしてサービスを完成させたか

---
# 作りたかったもの
非エンジニアとエンジニアをつなぐプラットフォーム
理由: 何か作りたいけど作りたいものがないエンジニア向けに非エンジニアの不満から何かアイデアを生み出せないかと思ったから。

---
# 出来たもの

掲示板(笑)

---
# 使用した技術

* フロントエンド: React
* バックエンド: Express(nodejs版のlaravelやrailsのようなもの)
* インフラ/db: Heroku/postgres

---
# 進め方

---
ローカルでは全て違うポート番号のlocalhostで作成します
<img src="assets/AddPitchme.png"/> 

---
本番ではExpressは静的ファイルを提供するサーバー＋対象のURLにアクセスが来たらjsonを返すサーバーとしての役割を果たす
<img src="assets/AddPitchme.png"/>  

* 初期
  * json-server+Express+postman
* 中期
  * json-server+Express+postman+React
* 末期
  * postgresDB+Express+React

---
# 本番デプロイ時

---
# コード側
* Express側
  * Procfileの作成(Expressサーバーの起動コマンド)
  * .envファイルに環境変数を記載
* React側
  * static.jsonの作成(heroku標準のwebpackから切り替えるため)

---
# heroku側
* githubとherokuの連携(任意)
* add-onの追加(postgres)
* 環境変数の追加(postgres環境変数とaccessToken変数)

---?code=package.json&lang=javascript&title=Express側のpackage.json
@[8](デプロイ時にReactのコードをbuildするように設定)

---?code=server.js&lang=javascript&title=Expressに追加
@[15](Expressサーバーは静的ファイルを出力)
@[385-387](これがないとlocalでは動くが、本番環境では動かない)

---
# 最後に
最後までありがとうございました。