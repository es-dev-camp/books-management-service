export default class Snack {
  public Top = true;
  public Bottom = false;
  public Left = false;
  public Right = false;
  public IsVisible = false;
  public Color = 'info';
  public Message = '';

  public Show(color: string, message: string, args: string[]): void {
    this.Initialize();

    for (const loc of args) {
      if (loc === 'top') {
        this.Top = true;
        continue;
      }
      if (loc === 'bottom') {
        this.Bottom = true;
        continue;
      }
      if (loc === 'left') {
        this.Left = true;
        continue;
      }
      if (loc === 'right') {
        this.Right = true;
        continue;
      }
    }
    this.Color = color;
    this.Message = message;
    this.IsVisible = true;
  }

  private Initialize(): void {
    this.IsVisible = false;
    this.Top = true;
    this.Bottom = false;
    this.Left = false;
    this.Right = false;
    this.Color = 'info';
    this.Message = '';
  }
}
