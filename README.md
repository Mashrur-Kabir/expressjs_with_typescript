# Node.js Backend with Express, TypeScript, and PostgreSQL

This project demonstrates creating a **Node.js backend** using:

- **Express** – for building APIs / HTTP server
- **TypeScript** – for strict typing and cleaner code
- **TSX** – to run TypeScript directly without compiling (ideal for development)

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

1. Create `server.ts` and import Express:

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

4. Set up a connection pool:

```ts
import { Pool } from "pg";

const pool = new Pool({
  connectionString: "your_connection_string_here",
});
```

> **Why use a pool?**
> Instead of connecting → querying → disconnecting every time, a pool keeps a few open connections ready to use, saving time and resources.

5. Initialize database tables:

- `users`
- `todos`

---

## Environment Variables

1. Install dotenv:

```bash
npm i dotenv
```

2. Configure dotenv in your project:

```ts
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
```

3. Create `.env` file:

```env
CONNECTION_STR="your_database_connection_string"
```

4. Add `.env` to `.gitignore` to keep credentials safe.

---
