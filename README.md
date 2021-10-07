# design-quiz
## 環境構築手順
---
### レポジトリをcloneする
`~$ git clone git@github.com:one-gift/design-quize.git`

----
### docker環境を構築する
以下のコマンドを順番に叩いていく

1. `design-quize ~$ docker-compose run --rm node npm install -D typescript @types/node`

2. `design-quize ~$ docker-compose run --rm node npm install -D ts-node ts-node-dev rimraf npm-run-all`

3. `design-quize ~$ docker-compose run --rm node npm run build`

4. `design-quize ~$ docker-compose up -d`