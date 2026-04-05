# bun-firebase

Minimal example of [Firebase Firestore](https://firebase.google.com/docs/firestore) running with [Bun](https://bun.sh), using the `firebase` client SDK.

## Setup

1. Install dependencies:

   ```sh
   bun install
   # or
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your Firebase project credentials:

   ```sh
   cp .env.example .env
   ```

   You can find these values in your Firebase project settings under **Project Settings → General → Your apps → SDK setup and configuration**.

## Usage

Run with Bun:

```sh
bun run start:bun
```

Run with Node.js (requires Node.js 20.6+):

```sh
npm run start:node
```

## What it does

`firestore.js` demonstrates the basic Firestore operations:

1. Initializes the Firebase app using environment variables.
2. Adds two documents to a `cities` collection.
3. Reads all documents from the collection and prints them.
4. Deletes the documents that were added.