creating a Node.js backend using:
    -Express (for building APIs / HTTP server)
    -TypeScript (for strict typing + cleaner code)
    -TSX (to run TypeScript directly without compiling. ideal for production)

installation~
    -npm init -y
    -remove "type": "commonjs" from package.json
    -npm install express --save
    -npm i -D typescript
    -npx tsc --init
    -uncomment in tsconfig.json:
        "rootDir": "./src",
        "outDir": "./dist", 
    -comment out "//other outputs:", (which are unnecessary in our case)
    -comment out under "//Recommended options:"
        "jsx": "react-jsx",
        "verbatimModuleSyntax": true,

getting started~
    -after creating server.ts and importing express from 'express':
        npm i --save-dev @types/express

running typescript via NODE without converting to js~
    -we need a tool that can compile and run .ts file directly
    -that's why we need tsx. it is a very fast runtime that runs typescript without needing tsc (which only compiles ts). plus, no need for separate dist folder.
    -in package.json, under "scripts" object, add:
        "dev": "npx tsx watch ./src/server.ts" [watch will catch current changes]
    -if not installed, npx will ask permission to install it. press 'y'. if you want it installed globally:
        npx install --save-dev tsx
    -npm run dev
    -""why didn't we use ts-node""?
    -older tool, slower, uses tsc internally, strict typechecking before running

using cloud for data~
    -create project in Neon DB
    -'connect' and copy connection string 

using postgres in a very basic way to act as database~
    -install pg package to create database pool and use connection string:
        npm install pg
    -import {Pool} from "pg"
    -npm i --save-dev @types/pg [for types]
    -const pool = new Pool({
        connectionString: `*connection string from neon db project*`
    })
    -initialize db tables:
        1.users
        2.todos 

dot install and config~
    -npm i dotenv

