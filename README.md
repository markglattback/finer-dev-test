# Finer Vision Dev Test

This is a customised version of the dev test, using a [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) in place of the Laravel framework.

## Quick Start

Create a knex config file in the application's root directory

```typescript
// ./config/knex.ts

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

Install dependencies

```bash
npm install
```

Start the local server

```bash
npm run dev
```
