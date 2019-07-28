export default interface IBook {
  Title: string;
  ISBN: string;
  Cover: string;
  Authors: string[];
  PublishDate: string;
  Publisher: string;
  Comment: string;
  ShowDetail: boolean;
  Created: Date;
  CreatedUserId: string;
  Modified: Date;
  ModifiedUserId: string;
  Save(): any;
}
