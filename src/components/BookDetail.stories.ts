import Vue from 'vue';
import { storiesOf } from '@storybook/vue';

import { displayDate } from '@/utilities/filters';
import BookDetail from './BookDetail.vue';

Vue.filter('displayDate', displayDate);

const stories = storiesOf('components/BookDetail', module);

stories
  .addParameters({
    viewport: { defaultViewport: 'iphonex' }
  })
  .add('show', () => ({
    components: { BookDetail },
    template: `<book-detail :current-book="currentBook" :current-user="currentUser" />`,
    data() {
      return {
        currentBook: {
          Title:
            'ユースケース駆動開発実践ガイド オブジェクト指向分析からSpringによる実装まで',
          ISBN: '9784798114453',
          Cover:
            'https://books.google.com/books/content?id=KfRyCwAAQBAJ&printsec=frontcover&img=1&zoom=4&edge=curl&imgtk=AFLRE73mCnn4zG3qQS-2TGZxBG3Tb2NmgGmPcChmYA80VDQ1UR0sf8zNPM8_3S5TfzXYiju8oWKq6PGsniCieZXxwA5fG416r9pykRZSAbR6ti_Di0C3_TvsPMKoXgvAECaOW4SEW_ov&source=gbs_api',
          Thumbnail:
            'https://books.google.com/books/content?id=KfRyCwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE72J-z2QYrgbeZwaCrpujpXmrV3peRF4ZISOUcUZoVgDukUjiBno_x5vYLevw9gK7MNzo0nSsm9xcql5F0nHMFYqucXx4UNEokjYlUnrRPLYhJ6cVa6FNAfRuPcj3bHWlG5H01Li&source=gbs_api',
          Authors: ['Doug Rosenberg', 'Matt Stephens'],
          PublishDate: '2007-10-16',
          Publisher: '翔泳社',
          Comment:
            '実装部分も時流に即したオブジェクト指向分析／設計の指南書 本書は最小限のUMLのコアサブセットと、ユースケースからオブジェクト指向ソフトウェア設計を導出するための思考プロセス（両者はまとめてICONIXと呼ばれています）についてを、空論ではなく実践の視点から説明しています。 ICONIXプロセスはユースケースとUML/オブジェクト指向分析・設計を扱うほかの多くの手法よりもプログラマにはなじみやすいものです。というのも、ICONIXプロセスはプログラマがユースケースを効果的に利用できるように、具体的かつ現実的、そして要求されたシステムの振る舞いを明確に言明するようなユースケースを作成させるからです。 「序文」および「イントロダクション」より',
          CreatedUserId: '4rITIWP8uRONOV8OfxYFNTYyMEY2',
          ModifiedUserId: '4rITIWP8uRONOV8OfxYFNTYyMEY2',
          Location: 'ビジアプ横の本棚',
          OnLoan: false,
          LastBorrowUserId: '',
          LastBorrowTimestamp: null,
          Created: { seconds: 1559190359, nanoseconds: 837000000 },
          Modified: { seconds: 1559190359, nanoseconds: 547000000 },
          ShowDetail: false,
          location: 'ビジアプ横の本棚'
        },
        currentUser: {}
      };
    }
  }));
