import { isJSON } from './isJSON';

describe('isJSON function', () => {
  test('JSON of a small object', () => {
    let s = '{ "qwer": 8 }';
    expect(isJSON(s)).toBe(true);
  });

  test('JSON of a large object', () => {
    let s = `{
      "browsers": {
        "firefox": {
          "name": "Firefox",
          "pref_url": "about:config",
          "releases": {
            "1": {
              "release_date": "2004-11-09",
              "status": "retired",
              "engine": "Gecko",
              "engine_version": "1.7"
            }
          }
        }
      }
    }`;
    expect(isJSON(s)).toBe(true);
  });

  test('JSON of an empty object', () => {
    expect(isJSON('{}')).toBe(true);
  });

  test('not JSON', () => {
    expect(isJSON('')).toBe(false);
    expect(isJSON('     ')).toBe(false);
    expect(isJSON('asdf')).toBe(false);
  });
});
