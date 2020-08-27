import Snack from './Snack';

describe('Show', () => {
  test('指定した通りの色になること', () => {
    const snack = new Snack();
    snack.Show('test', '', []);
    expect(snack.Color).toEqual('test');
  });
  test('指定した通りのメッセージになること', () => {
    const snack = new Snack();
    snack.Show('', 'メッセージ', []);
    expect(snack.Message).toEqual('メッセージ');
  });
  test('表示状態になること', () => {
    const snack = new Snack();
    snack.Show('', '', []);
    expect(snack.IsVisible).toEqual(true);
  });
  test('top=trueになること', () => {
    const snack = new Snack();
    snack.Show('', '', ['top']);
    expect(snack.IsVisible).toEqual(true);
  });
  test('bottom=trueになること', () => {
    const snack = new Snack();
    snack.Show('', '', ['bottom']);
    expect(snack.IsVisible).toEqual(true);
  });
  test('left=trueになること', () => {
    const snack = new Snack();
    snack.Show('', '', ['left']);
    expect(snack.IsVisible).toEqual(true);
  });
  test('right=trueになること', () => {
    const snack = new Snack();
    snack.Show('', '', ['right']);
    expect(snack.IsVisible).toEqual(true);
  });
  test('4方向全てtrueになること', () => {
    const snack = new Snack();
    snack.Show('', '', ['top', 'bottom', 'left', 'right']);
    expect(snack.IsVisible).toEqual(true);
  });
});
