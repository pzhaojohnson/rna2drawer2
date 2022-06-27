import { colorValuesAreEqual } from './colorValuesAreEqual';

test('colorValuesAreEqual function', () => {
  // same hex codes
  expect(colorValuesAreEqual('#bb18ca', '#bb18ca')).toBeTruthy();
  // same RGB strings
  expect(colorValuesAreEqual('rgb(20, 58, 120)', 'rgb(20, 58, 120)')).toBeTruthy();
  // same RGB objects
  expect(colorValuesAreEqual({ r: 3, g: 250, b: 100 }, { r: 3, g: 250, b: 100 })).toBeTruthy();

  // different hex codes
  expect(colorValuesAreEqual('#112bc3', '#113bc3')).toBeFalsy();
  // different RGB strings
  expect(colorValuesAreEqual('rgb(50, 12, 37)', 'rgb(50, 11, 37)')).toBeFalsy();
  // different RGB objects
  expect(colorValuesAreEqual({ r: 33, g: 28, b: 59 }, { r: 66, g: 28, b: 59 })).toBeFalsy()

  // hex code and RGB string with same color value
  expect(colorValuesAreEqual('#582c4f', 'rgb(88, 44, 79)')).toBeTruthy();
  // hex code and RGB object with same color value
  expect(colorValuesAreEqual('#56bbc8', { r: 86, g: 187, b: 200 })).toBeTruthy();

  // same hex codes but different letter case
  expect(colorValuesAreEqual('#abd553', '#ABD553')).toBeTruthy();
});
