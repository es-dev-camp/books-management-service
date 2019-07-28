export default class User {
  public IsSignin: boolean = false;
  public Name: string | null = 'Anonymous';
  public Id: string = '';
  public Email: string | null = '';
  public ImageUrl: string | null = '/img/anonymous.png';
}
