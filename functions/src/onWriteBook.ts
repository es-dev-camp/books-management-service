import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

// FIXME: firebase deploy 時に @common/booksManagementEvent が解釈できないため、相対パス指定に戻している
// src/model/Audit.ts などの定義と何が違う？
import * as booksManagementEvent from '../../common/booksManagementEvent';
import * as moment from 'moment';
import { IBook } from '@common/IBook';

const db = admin.firestore();

export const func = functions.firestore
  .document('book/{isbn}')
  .onWrite(async (change, context) => {
    console.log('triggered onWrite Book (' + context.params.isbn + ')');

    if (!change.before.exists) {
      const d = change.after.data() as Partial<IBook>;
      if (!d) {
        throw new Error('change.after.data() is undefined.');
      }
      await createEventData(
        context,
        booksManagementEvent.BookEventType.created,
        d.CreatedUserId ? d.CreatedUserId : ''
      );
      return 0;
    }

    if (!change.after.exists) {
      const d = change.after.data() as Partial<IBook>;
      if (!d) {
        throw new Error('change.after.data() is undefined.');
      }
      // note: 削除したユーザが取得できないので空
      await createEventData(
        context,
        booksManagementEvent.BookEventType.deleted,
        ''
      );
      return 0;
    }

    const beforeData = change.before.data() as Partial<IBook>;
    const afterData = change.after.data() as Partial<IBook>;
    if (!beforeData || !afterData) {
      throw new Error('dat() is undefined.');
    }

    if (!beforeData.OnLoan !== !afterData.OnLoan) {
      if (afterData.OnLoan) {
        const d = change.after.data() as Partial<IBook>;
        if (!d || !d.LastBorrowUserId) {
          throw new Error('change.after.data() is undefined.');
        }
        await createEventData(
          context,
          booksManagementEvent.BookEventType.borrowed,
          d.LastBorrowUserId
        );
        return 0;
      } else {
        const d = change.after.data() as Partial<IBook>;
        if (!d || !d.LastBorrowUserId) {
          throw new Error('change.after.data() is undefined.');
        }
        await createEventData(
          context,
          booksManagementEvent.BookEventType.returned,
          d.LastBorrowUserId
        );
        return 0;
      }
    } else {
      const d = change.after.data() as Partial<IBook>;
      if (!d || !d.ModifiedUserId) {
        throw new Error('change.after.data() is undefined.');
      }
      await createEventData(
        context,
        booksManagementEvent.BookEventType.edited,
        d.ModifiedUserId
      );
      // NOTE: https://stackoverflow.com/questions/47128440/google-firebase-errorfunction-returned-undefined-expected-promise-or-value?rq=1
      return 0;
    }
  });

async function createEventData(
  context: functions.EventContext,
  eventSubType: booksManagementEvent.BookEventType,
  userId: string
) {
  const eventTime = moment(context.timestamp);
  const ts = new admin.firestore.Timestamp(
    eventTime.unix(),
    // 2019-08-17T11:57:11.479215Z
    parseInt(context.timestamp.substr(20, 6)) * 1000
  );
  const newEvent: booksManagementEvent.bookEvent = {
    book: context.params.isbn,
    ts: ts,
    id: context.eventId,
    type: booksManagementEvent.EventType.book,
    subtype: eventSubType,
    user: userId
  };
  const result = await db.collection('audit').add(newEvent);
  console.log(`Successfully added book event log (${result.id})`);
  return newEvent;
}
