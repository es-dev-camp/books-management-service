import * as functions from 'firebase-functions';
import { readFileSync } from 'fs';

export function readCommitHash() {
  try {
    return readFileSync('.gitinfo', { encoding: 'utf-8' });
  } catch {
    return '';
  }
}

export const func = functions.https.onRequest((request, response) => {
  response.send(readCommitHash());
});