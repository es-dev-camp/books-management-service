import * as functions from 'firebase-functions';
import { App } from '@slack/bolt';
import { IBook } from '@common/IBook';

const botToken = functions.config().slack.bot_token;
const app = new App({
  token: botToken,
  signingSecret: functions.config().slack.signing_secret
});
// TODO: Promise<void>型のメソッドにする
// app.error(console.log);

export const func = functions.firestore
  .document('book/{isbn}')
  .onCreate(async (snap, context) => {
    console.log('triggered onCreate Book (' + context.params.isbn + ')');
    await sendMessage(snap.data() as IBook);
    return 0;
  });

async function sendMessage(book: IBook) {
  try {
    const result = await app.client.chat.postMessage({
      token: botToken,
      channel: functions.config().slack.notify_channel_id,
      text: '',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `:new: *${book.Title}*
:book::book::book: 作者: ${book.Authors.join(' ')}
出版社: ${book.Publisher} 出版日: ${book.PublishDate} ${book.Location ? '配置場所: ' + book.Location : '' }
${book.Comment}`
          },
          accessory: {
            type: 'image',
            image_url: book.Thumbnail,
            alt_text: `${book.Title} 's image.`
          }
        }
      ]
    });
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
}
