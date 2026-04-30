## Description

Basic CRUD for PUCPR project

## Environment variables

Create a `.env` file based on `.env.example`.

- `JWT_SECRET` is mandatory and used by both JWT signing and validation.
- Do not keep the placeholder JWT secret from `.env.example`.
- Use `DB_SYNCHRONIZE=false` in production.

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
