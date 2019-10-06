import { Timestamp } from './Timestamp';

export default interface IBook {
  Title: string;
  ISBN: string;
  Cover: string;
  Authors: string[];
  PublishDate: string;
  Publisher: string;
  Comment: string;
  Created: Date;
  CreatedUserId: string | null;
  CreatedInfo: string;
  Modified: Date;
  ModifiedUserId: string | null;
  ModifiedInfo: string;
  Location: string;
  OnLoan: boolean | null;
  LastBorrowUserId: string | null;
  // TODO: Union type に firebase.firestore.FieldValue 追加する
  LastBorrowTimestamp: Timestamp | null;
  Save(): any;
  Rent(userId: string): Promise<void>;
  Return(): Promise<void>;
}
