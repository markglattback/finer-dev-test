# Finer Vision Dev Test

This is a customised version of the dev test, using a [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) in place of the Laravel framework.

## Prerequisite

This project's API routes require a working MySQl service and does not include local setup files. Please provide the MySQL connection configuration in the config file descrived below.

## Quick Start

Create a knex config file in the application's root directory.

```typescript
// config/knex.ts

export default {
  client: "mysql",
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_DB,
  },
};
```

Create a .env file in the application's root directory.

```bash
MYSQL_HOST=your_hostname
MYSQL_USER=your_user
MYSQL_PWD=your_password
MYSQL_DB=your_database
```

Install dependencies

```bash
npm install
```

Start the local server

```bash
npm run dev
```
