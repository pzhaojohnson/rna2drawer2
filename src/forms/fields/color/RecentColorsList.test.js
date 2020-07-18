import RecentColorsList from './RecentColorsList';

it('maxLength getter', () => {
  let colors = new RecentColorsList(35);
  expect(colors.maxLength).toBe(35);
});

it('length getter', () => {
  let colors = new RecentColorsList(12);
  colors.push('#aabbcd');
  expect(colors.length).toBe(1);
  colors.push('#1122bc');
  expect(colors.length).toBe(2);
});

it('colorAt method', () => {
  let colors = new RecentColorsList(12);
  colors.push('#aabbcc');
  colors.push('#1123bc');
  colors.push('#AABB34');
  expect(colors.colorAt(0)).toBe('#aabbcc');
  expect(colors.colorAt(1)).toBe('#1123bc');
  expect(colors.colorAt(2)).toBe('#aabb34');
  expect(colors.colorAt(3)).toBe(undefined);
});

describe('push method', () => {
  it('prevents duplications', () => {
    let colors = new RecentColorsList(12);
    colors.push('#aadd12'); // lowercase
    colors.push('#DC21AB'); // uppercase
    expect(colors.length).toBe(2);
    colors.push('#AADD12');
    expect(colors.length).toBe(2);
    colors.push('#DC21AB');
    expect(colors.length).toBe(2);
    expect(colors.slice().includes('#aadd12')).toBeTruthy();
    expect(colors.slice().includes('#dc21ab')).toBeTruthy();
  });

  it('pushes colors to end of list (even with duplications)', () => {
    let colors = new RecentColorsList(12);
    colors.push('#112356');
    expect(colors.colorAt(0)).toBe('#112356');
    colors.push('#bbac22');
    expect(colors.colorAt(1)).toBe('#bbac22');
    colors.push('#6599aa');
    expect(colors.colorAt(2)).toBe('#6599aa');
    colors.push('#5543ac');
    expect(colors.colorAt(3)).toBe('#5543ac');
    colors.push('#bbac22'); // a duplicate
    // moved to end of list and not duplicated
    expect(colors.colorAt(3)).toBe('#bbac22');
    expect(colors.length).toBe(4);
  });

  it('prevents list from exceeding max length', () => {
    let colors = new RecentColorsList(3);
    colors.push('#123456');
    colors.push('#abcdef');
    colors.push('#654321');
    expect(colors.length).toBe(3);
    colors.push('#fedcba');
    expect(colors.length).toBe(3); // max length not exceeded
    // removed first element
    expect(colors.slice().toString()).toBe(['#abcdef', '#654321', '#fedcba'].toString());
    colors.push('#aabbcc');
    expect(colors.length).toBe(3); // max length not exceeded
    // removed first element
    expect(colors.slice().toString()).toBe(['#654321', '#fedcba', '#aabbcc'].toString());
  });
});

it('slice method', () => {
  let colors = new RecentColorsList(15);
  for (let i = 0; i < 6; i++) {
    colors.push('#' + 'aabc' + i + (i + 2));
  }
  let spy = jest.spyOn(colors._hexs, 'slice');
  
  let s = colors.slice(2, 5);
  expect(spy.mock.calls[0][0]).toBe(2);
  expect(spy.mock.calls[0][1]).toBe(5);
  expect(s.toString()).toBe(colors._hexs.slice(2, 5).toString());

  spy.mockClear();
  s = colors.slice();
  expect(spy.mock.calls[0][0]).toBe(undefined);
  expect(spy.mock.calls[0][1]).toBe(undefined);
  expect(s.toString()).toBe(colors._hexs.slice().toString());
});
