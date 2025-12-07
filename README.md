# Node.js Backend with Express, TypeScript, PostgreSQL, JWT Auth & RBAC

This project demonstrates creating a simple **Node.js backend** using:

- **Express** – for building APIs / HTTP server
- **TypeScript** – for strict typing and cleaner code
- **TSX** – to run TypeScript directly without compiling (ideal for development)
- **PostgreSQL (Neon DB)** - to store data in cloud database
- **bcryptjs** - Secure password hashing
- **jsonwebtoken (JWT)** - For login authentication
- **Modular approach** - make APIs maintainable, secure, and easy to expand later.

Future-you should be able to read this and instantly remember how everything works.

---

## Installation

1. Initialize the project:

```bash
npm init -y
```

2. Remove `"type": "commonjs"` from `package.json`.

3. Install dependencies:

```bash
npm install express --save
npm i -D typescript
```

4. Initialize TypeScript:

```bash
npx tsc --init
```

5. Update `tsconfig.json`:

- Uncomment:

```json
"rootDir": "./src",
"outDir": "./dist"
```

- Comment out unnecessary sections:

```json
// other outputs
```

- Comment out recommended options (if present):

```json
"jsx": "react-jsx",
"verbatimModuleSyntax": true
```

---

## Getting Started

1. Create `server.ts` and inside `./src` import Express:

```bash
npm i --save-dev @types/express
```

2. **Running TypeScript via Node without compiling to JS**:

- Install `tsx` globally:

```bash
npm install --save-dev tsx
```

- Add a script in `package.json`:

```json
"scripts": {
  "dev": "npx tsx watch ./src/server.ts"
}
```

- Run in development:

```bash
npm run dev
```

> **Why TSX instead of TS-Node?**
> TSX is faster, runs TypeScript directly, and doesn’t require strict pre-compilation like TS-Node.

---

## Using Cloud PostgreSQL

1. Create a project in **Neon DB**.
2. Click **Connect** and copy the connection string.
3. Install the PostgreSQL client:

```bash
npm install pg
npm i --save-dev @types/pg
```

4. Set up a connection pool (in server.ts if you want for now, but inside ./src/config/db.ts, described in config setup below):

```ts
import { Pool } from "pg";

const pool = new Pool({
  connectionString: "your_connection_string_here",
});
```

> **Why use a pool?**
> Instead of connecting → querying → disconnecting every time, a pool keeps a few open connections ready to use, saving time and resources.

5. Initialize database tables (server.ts (optional) but later in db.ts):

- `users`
- `todos`

---

## Environment Variables

1. Install dotenv:

```bash
npm i dotenv
```

2. Configure dotenv in your project (server.ts (optional) but later in ./src/config/index.ts):

```ts
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
```

3. Create `.env` file:

```env
CONNECTION_STR="your_database_connection_string"
PORT=5000
```

4. Add `.env*` and `node_modules` to `.gitignore` to keep credentials safe and avoid pushing unnecessarily large files.

---

## Step-By-Step Modularization

### 1 Config Setup (`/src/config`)

| File       | Purpose                                    |
| ---------- | ------------------------------------------ |
| `index.ts` | loads `dotenv`, exports environment values |
| `db.ts`    | create `Pool`, define tables, export DB    |
|            | export default initDB (to export DB)       |

Reason → keeps server clean, reusable everywhere.

---

### 2 Middleware (`/src/middleware`)

| Middleware  | Use                                         |
| ----------- | ------------------------------------------- |
| `logger.ts` | logs requests for debugging                 |
| `auth.ts`   | verifies jwt for accessing protected routes |

---

### 3 Routing Separation

Instead of writing everything inside `server.ts`:

```
route → controller → service → db
```

| Layer      | Responsibility                           |
| ---------- | ---------------------------------------- |
| Route      | defines endpoint only                    |
| Controller | handles req/res                          |
| Service    | business logic (queries, hashing, logic) |

Example user flow:

```
./src/modules/users → user.routes.ts → user.controller.ts → user.service.ts → DB
```

---

## Authentication (Login System)

Why authentication?

> HTTP is **stateless** — it forgets you every request.
> After login, the server still doesn't know who you are.
> A **JWT token** proves identity on every request.

### Password Hashing

1. Install bcrypt and hash password:

```bash
npm install bcryptjs
npm install --save-dev @types/bcryptjs
```

```ts
const hashedPassword = await bcrypt.hash(password, 10);
```

2. Login check inside ./auth/auth.service.ts

```ts
bcrypt.compare(plainPassword, hashedPasswordFromDB);
```

Why hash?

> If database leaks → attackers **never** see real passwords.

---

## JWT Tokens

1. Generate secret:

```sh
node
> const crypto = require('crypto')
> crypto.randomBytes(64).toString("hex")
```

2. Save in `.env`:

```
JWT_SECRET=yourGeneratedKey
```

3. Set inside config obj in ./config/index.ts:

```ts
const config = {
  connection_str: process.env.CONNECTION_STR,
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET,
};
```

4. Install jwt for dev or prod:

```bash
npm install jsonwebtoken --save-dev
npm install @types/jsonwebtoken --save-dev
```

```bash
npm install jsonwebtoken
```

5. Generate token in `auth.service.ts`:

```ts
const token = jwt.sign(
  { name: user.name, email: user.email, role: user.role },
  config.jwt_secret,
  { expiresIn: "7d" }
);
```

6. Client must send token with request:

```
Authorization: Bearer eyJhbGciOiJI...
```

7. An auth middleware (auth.ts) with a higher order function will:

   > receive this token

   ```ts
   const token = req.headers.authorization?.split(" ")[1];
   ```

   > jwt will verify user's identity and decide if he's authorized for the request (this should take place in a try-catch block)

   ```ts
   const decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload;
   req.user = decoded; //type declared in ./src/types/express/index.d.ts

   if (roles.length && !roles.includes(decoded.role)) {
     return res.status(500).json({
       error: "unauthorized personnel!",
     });
   }

   next();
   ```

---

## RBAC – Role Based Access Control

Why?
Admins should access everything. Normal users should not.

Example:

```ts
router.get("/", auth("admin"), userControllers.getAllUsers);
```

Meaning → only admin role can fetch all users.

Inside `auth.ts`:

- decode token
- attach user to `req.user`
- check `req.user.role` against allowed roles

---

## 🧩 Finish with app.ts + server.ts

### `app.ts`

- imports all routes & middleware

### `server.ts`

```ts
app.listen(PORT, () => console.log("Server running..."));
```

— **clean and scalable!**

---

# Final Project structure and Result:

```bash
ExpressJS/
├── node_modules/
├── src/
│   ├── config/
│   │   ├── db.ts
│   │   └── index.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── logger.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.service.ts
│   │   ├── todo/
│   │   │   ├── todo.controller.ts
│   │   │   ├── todo.routes.ts
│   │   │   └── todo.service.ts
│   │   └── user/
│   │       ├── user.controller.ts
│   │       ├── user.routes.ts
│   │       └── user.service.ts
│   ├── types/express/
│   │   └── index.d.ts
│   ├── app.ts
│   └── server.ts
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── tsconfig.json
```

✔ Modular
✔ Secure
✔ Scalable
✔ Easy to understand later

---
