# url-shortener
A REST API for shortening URLs

## Requirements

* MySQL instance with database named 'shrtr' (or whatever you choose)

## Installation

```sh
git clone https://github.com/panutat/url-shortener.git
cd url-shortener
npm install
```
## Configuration

Update with your own MySQL credentials in /config/development.json

```json
{
    "db": {
        "host": "127.0.0.1",
        "user": "root",
        "password": "root",
        "database": "shrtr",
        "cleanupAfterRestart": true,
        "initialAutoIncrement": 11111111
    }
}
```

## Run development server

```sh
npm run dev
```

## Run test

```sh
npm run test
```

## Run linting

```sh
npm run lint
```
