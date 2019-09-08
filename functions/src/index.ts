import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

import { readFileSync } from 'fs';

function readCommitHash() {
  try {
    return readFileSync('.gitinfo', { encoding: 'utf-8' });
  } catch {
    return '';
  }
}

admin.initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  console.log(`git hash: ${readCommitHash()}`);
  response.send('Hello from Firebase! BooksManagement!');
});

export const onWriteBook = require('./onWriteBook').func;
