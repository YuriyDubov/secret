
# Secret  

## Local Setup
### Setup repo
```
$ git clone git@github.com:YuriyDubov/secret.git backend
$ cd backend
$ npm install
```

### Setup DB
```
$ psql -U postgres -f ./db/createDB.sql
```

```
$ psql -d secret -U postgres -f ./db/createTables.sql
```

## Local Run
```
npm run start
```


