import {Timestamp} from './Timestamp';
export default interface IBook {
  Title: string;
  ISBN: string;
  Cover: string;
  Authors: string[];
  PublishDate: string;
  Publisher: string;
  Comment: string;
  Created: Date;
  CreatedUserId: string;
  Modified: Date;
  ModifiedUserId: string;
  Location: string;
  OnLoan?: boolean;
  LastBorrowUserId?: string;
  LastBorrowTimestamp?: null | Timestamp;
  Save(): any;
  Rent(userId: string): Promise<void>;
  Return(): Promise<void>;
}
