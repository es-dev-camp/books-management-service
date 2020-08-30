import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import * as corsLib from 'cors';
const cors = corsLib();

import jwt = require('express-jwt');
import jwks = require('jwks-rsa');

const { domain, audience } = functions.config().auth0;

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`,
  }),
  aud: audience,
  issuer: `https://${domain}/`,
  algorithms: ['RS256'],
});

export const auth = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
    jwtCheck(request, response, async () => {
      try {
        // TODO: req, res の型を指定する
        const uid: string = (request as any).user.sub;

        const firebaseToken = await admin.auth().createCustomToken(uid);
        response.json({ firebaseToken });
      } catch (err) {
        console.error(err);
        response.status(500).send({
          message: 'Something went wrong acquiring a Firebase token.',
          error: err,
        });
      }
    });
  });
});
