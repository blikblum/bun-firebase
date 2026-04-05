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

## Testing with the Firebase Emulator

The project includes a test script that runs against the [Firebase Emulator](https://firebase.google.com/docs/emulator-suite).

### Prerequisites

- Java 11+ is required to run the Firestore emulator.

### Running

1. Start the Firestore emulator in one terminal:

   ```sh
   npm run emulator
   ```

2. Run the tests in another terminal:

   ```sh
   npm run test:node
   # or
   npm run test:bun
   ```

> **Note:** Bun support for firebase may be incomplete and `test:bun` may fail. This is a known issue.

## What it does

`firestore.js` demonstrates the basic Firestore operations:

1. Initializes the Firebase app using environment variables.
2. Connects to the Firestore emulator when `FIRESTORE_EMULATOR_HOST` is set.
3. Adds two documents to a `cities` collection.
4. Reads all documents from the collection and prints them.
5. Deletes the documents that were added.

`test.js` verifies these operations against the emulator:

- Adds documents and asserts references are returned.
- Reads documents back and asserts the correct data.
- Deletes documents and asserts the collection is empty.