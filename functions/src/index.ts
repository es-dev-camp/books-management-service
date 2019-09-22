import * as admin from 'firebase-admin';

admin.initializeApp();

export const gitHash = require('./gitHash').func;

export const onWriteBook = require('./onWriteBook').func;

export const auth = require('./auth0').auth;