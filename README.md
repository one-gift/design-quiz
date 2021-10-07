# design-quiz
## 環境構築手順
---
### レポジトリをcloneする
```$ git clone git@github.com:one-gift/design-quize.git```

----
### docker環境を構築する
階層を移動すする

```cd design-quiz```

階層を移動したら、以下のコマンドを順番に叩いていく

1. ```$ docker-compose run --rm node npm install -D typescript @types/node```

2. ```$ docker-compose run --rm node npm install -D ts-node ts-node-dev rimraf npm-run-all```

3. ```$ docker-compose run --rm node npm run build```

4. ```$ docker-compose up -d```