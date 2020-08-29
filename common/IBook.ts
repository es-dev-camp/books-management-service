import { Timestamp } from './Timestamp';

export type IBook = {
  Title: string;
  ISBN: string;
  Cover: string;
  Thumbnail: string;
  Authors: string[];
  PublishDate: string;
  Publisher: string;
  Comment: string;
  Created: Date;
  CreatedUserId: string | null;
  Modified: Date;
  ModifiedUserId: string | null;
  Location: string;
  OnLoan: boolean | null;
  LastBorrowUserId: string | null;
  // TODO: Union type に firebase.firestore.FieldValue 追加する
  LastBorrowTimestamp: Timestamp | null;
};
