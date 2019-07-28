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
  Save(): any;
}
