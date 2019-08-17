import * as functions from 'firebase-functions';
import * as booksManagementEvent from './booksManagementEvent';
import * as moment from 'moment';

export const func = functions.firestore
  .document('book/{isbn}')
  .onWrite((change, context) => {
    console.log('triggered onWrite Book (' + context.params.isbn + ')');

    if (!change.before.exists) {
      const d = change.after.data();
      if (!d) {
        throw new Error('change.after.data() is undefined.');
      }
      const newEvent = createEventData(
        context,
        booksManagementEvent.BookEventType.created,
        d.CreatedUserId
      );
      console.log(newEvent);
      return 0;
    }

    if (!change.after.exists) {
      const d = change.after.data();
      if (!d) {
        throw new Error('change.after.data() is undefined.');
      }
      // note: 削除したユーザが取得できないので空
      const newEvent = createEventData(
        context,
        booksManagementEvent.BookEventType.deleted,
        ''
      );
      console.log(newEvent);
      return 0;
    }

    const beforeData = change.before.data();
    const afterData = change.after.data();
    if (!beforeData || !afterData) {
      throw new Error('dat() is undefined.');
    }

    if (!beforeData.OnLoan !== !afterData.OnLoan) {
      if (afterData.OnLoan) {
        const d = change.after.data();
        if (!d || !d.LastBorrowUserId) {
          throw new Error('change.after.data() is undefined.');
        }
        const newEvent = createEventData(
          context,
          booksManagementEvent.BookEventType.borrowed,
          d.LastBorrowUserId
        );
        console.log(newEvent);
        return 0;
      } else {
        const d = change.after.data();
        if (!d || !d.LastBorrowUserId) {
          throw new Error('change.after.data() is undefined.');
        }
        const newEvent = createEventData(
          context,
          booksManagementEvent.BookEventType.returned,
          d.LastBorrowUserId
        );
        console.log(newEvent);
        return 0;
      }
    } else {
      const d = change.after.data();
      if (!d || !d.ModifiedUserId) {
        throw new Error('change.after.data() is undefined.');
      }
      const newEvent = createEventData(
        context,
        booksManagementEvent.BookEventType.edited,
        d.ModifiedUserId
      );
      console.log(newEvent);
      // NOTE: https://stackoverflow.com/questions/47128440/google-firebase-errorfunction-returned-undefined-expected-promise-or-value?rq=1
      return 0;
    }
  });

function createEventData(
  context: functions.EventContext,
  eventSubType: booksManagementEvent.BookEventType,
  user: string
) {
  const eventTime = moment(context.timestamp);
  const newEvent: booksManagementEvent.bookEvent = {
    book: context.params.isbn,
    ts: {
      seconds: eventTime.unix(),
      nanoseconds: eventTime.unix() * 1000000
    },
    id: context.eventId,
    type: booksManagementEvent.EventType.book,
    subtype: eventSubType,
    user: user
  };
  return newEvent;
}
