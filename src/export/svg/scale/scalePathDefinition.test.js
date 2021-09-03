import { scalePathDefinition } from './scalePathDefinition';
import * as SVG from '@svgdotjs/svg.js';
import { round } from 'Math/round';

function valuesAreClose(v1, v2) {
  if (typeof v1 == 'number') {
    return typeof v2 == 'number' && round(v1, 3) == round(v2, 3);
  } else {
    return v1 == v2;
  }
}

function pathCommandsAreClose(c1, c2) {
  let areClose = true;
  if (c1.length != c2.length) {
    areClose = false;
  }
  c1.forEach((v1, i) => {
    let v2 = c2[i];
    if (!valuesAreClose(v1, v2)) {
      areClose = false;
    }
  });
  return areClose;
}

function pathDefinitionsAreClose(d1, d2) {
  let areClose = true;
  let pa1 = new SVG.PathArray(d1);
  let pa2 = new SVG.PathArray(d2);
  if (pa1.length != pa2.length) {
    areClose = false;
  }
  pa1.forEach((c1, i) => {
    let c2 = pa2[i];
    if (!pathCommandsAreClose(c1, c2)) {
      areClose = false;
    }
  });
  return areClose;
}

test('scalePathDefinition function', () => {
  let d = (
    'M 1 2'
    + 'm 3 4'
    + 'L 5 6'
    + 'l 7 8'
    + 'H 9'
    + 'h 10'
    + 'V 11'
    + 'v 12'
    + 'C 13 14 15 16 17 18'
    + 'c 19 20 21 22 23 24'
    + 'S 25 26 27 28'
    + 's 29 30 31 32'
    + 'Q 33 34 35 36'
    + 'q 37 38 39 40'
    + 'T 41 42'
    + 't 43 44'
    + 'A 45 46 120 1 1 47 48'
    + 'a 49 50 150 0 0 51 52'
    + 'Z'
    + 'z'
  );
  
  // the SVG.js library seems to convert all relative path commands
  // to absolute path commands
  let factor = 2;
  let scaled = (
    'M 2 4'
    + 'M 8 12'
    + 'L 10 12'
    + 'L 24 28'
    + 'H 18'
    + 'H 38'
    + 'V 22'
    + 'V 46'
    + 'C 26 28 30 32 34 36'
    + 'C 72 76 76 80 80 84'
    + 'S 50 52 54 56'
    + 'S 112 116 116 120'
    + 'Q 66 68 70 72'
    + 'Q 144 148 148 152'
    + 'T 82 84'
    + 'T 168 172'
    + 'A 90 92 120 1 1 94 96'
    + 'A 98 100 150 0 0 196 200'
    + 'Z'
    + 'Z'
  );

  // check that can return false
  expect(
    pathDefinitionsAreClose(scaled, d)
  ).toBeFalsy();
  
  expect(
    pathDefinitionsAreClose(scaled, scalePathDefinition(d, factor))
  ).toBeTruthy();
});
