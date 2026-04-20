## Description

Basic CRUD for PUCPR project

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Docker use

MySQL is published on host port **3307** (not 3306) so it does not clash with a local MySQL on 3306. From tools on your machine, connect to `localhost:3307`. The Nest container still talks to `mysql:3306` on the internal network.

```bash
# start API + MySQL
$ docker compose up --build

# stop and remove containers
$ docker compose down

# stop and also remove MySQL persisted volume
$ docker compose down -v
```
