# design-quiz
## 環境構築手順
---
### レポジトリをcloneする
`$ git clone git@github.com:one-gift/design-quiz.git`

----
### docker環境を構築する(一回のみ)
階層を移動すする

`$ cd design-quiz`

階層を移動したら、以下のコマンドを順番に叩いていく

```
$ docker-compose run --rm node npm install -D typescript @types/node
$ docker-compose run --rm node npm install -D ts-node ts-node-dev rimraf npm-run-all
$ docker-compose run --rm node npm run build
$ docker-compose up -d
```

### 起動&停止&コンパイル

```
# 起動(作業開始時に実行)
$ docker-compose start

# 停止(作業が終わったら停止しときましょう)
$ docker-compose stop

# コンパイル(tsファイル)
$ docker-compose run --rm node npm run build
```

梶塚が変更しました
八木澤追加