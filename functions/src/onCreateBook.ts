import * as functions from 'firebase-functions';

export const func = functions.firestore
  .document('book/{isbn}')
  .onCreate(async (snap, context) => {
    console.log('triggered onCreate Book (' + context.params.isbn + ')');
    console.log(snap.data());
    return 0;
  });
