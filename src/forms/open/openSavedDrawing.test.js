import { App } from 'App';

import * as SVG from 'Draw/svg/NodeSVG';

import * as fs from 'fs';

import { removeFileExtension } from 'Parse/parseFileExtension';

import { parseRna2drawer1 } from './parseRna2drawer1';

import { openSavedDrawing } from './openSavedDrawing';

function readRna2drawer1(name) {
  return fs.readFileSync('src/forms/open/testinput/rna2drawer1/' + name + '.rna2drawer', 'utf8');
}

function readRna2drawer2(name) {
  return fs.readFileSync('src/forms/open/testinput/rna2drawer2/' + name + '.rna2drawer2', 'utf8');
}

/**
 * Mocks a file object for a drawing.
 *
 * (The text method of File instances doesn't seem to work on Node.js.)
 */
function createDrawingFile(args) {
  let { fileName, fileContents } = args;

  return {
    name: fileName,
    text: () => new Promise(resolve => resolve(fileContents)),
  };
}

// needed for parseRna2drawer1 function to run
Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return { color: 'rgb(0, 0, 0)' };
  }
});

let app = null;

beforeEach(() => {
  app = new App({ SVG });
  app.appendTo(document.body);
});

afterEach(() => {
  app.remove();
  app = null;
});

describe('openSavedDrawing function', () => {
  describe('opening drawings from before the web app', () => {
    test('a valid drawing file', () => {
      let fileName = 'hairpin.rna2drawer';
      let fileContents = readRna2drawer1(removeFileExtension(fileName));
      expect(parseRna2drawer1(fileContents)).toBeTruthy(); // is parsable
      let savedDrawing = createDrawingFile({ fileName, fileContents });

      return openSavedDrawing({ app, savedDrawing }).then(() => {
        expect(app.strictDrawing.isEmpty()).toBeFalsy(); // saved drawing was added
      }).catch(error => {
        throw error; // should not have thrown
      });
    });

    test('an invalid drawing file', () => {
      let fileName = 'baseOutlineWithInvalidStrokeWidth.rna2drawer';
      let fileContents = readRna2drawer1(removeFileExtension(fileName));
      expect(fileContents).toBeTruthy(); // file was read
      expect(parseRna2drawer1(fileContents)).toBeFalsy(); // unparsable
      let savedDrawing = createDrawingFile({ fileName, fileContents });

      return openSavedDrawing({ app, savedDrawing }).then(() => {
        throw new Error(); // should have thrown
      }).catch(() => {
        expect(app.strictDrawing.isEmpty()).toBeTruthy(); // drawing is unchanged
      });
    });
  });

  describe('opening drawings produced by the web app', () => {
    test('a valid drawing file', () => {
      let fileName = 'hairpins.rna2drawer2';
      let fileContents = readRna2drawer2(removeFileExtension(fileName));
      let savedDrawing = createDrawingFile({ fileName, fileContents });

      return openSavedDrawing({ app, savedDrawing }).then(() => {
        expect(app.strictDrawing.isEmpty()).toBeFalsy(); // saved drawing was applied
      }).catch(error => {
        throw error; // should not have thrown
      });
    });

    test('invalid JSON', () => {
      let fileName = 'InvalidJSON.rna2drawer2';
      let fileContents = '{ asdf: 2, qwer: 5 ';
      let savedDrawing = createDrawingFile({ fileName, fileContents });

      return openSavedDrawing({ app, savedDrawing }).then(() => {
        throw new Error(); // should have thrown
      }).catch(() => {
        expect(app.strictDrawing.isEmpty()).toBeTruthy(); // drawing is unchanged
      });
    });

    test('when the saved state in unable to be applied', () => {
      let fileName = 'invalidBaseTextId.rna2drawer2';
      let fileContents = readRna2drawer2(removeFileExtension(fileName));
      expect(JSON.parse(fileContents)).toBeTruthy(); // is parsable
      let savedDrawing = createDrawingFile({ fileName, fileContents });

      return openSavedDrawing({ app, savedDrawing }).then(() => {
        throw new Error(); // should have thrown
      }).catch(() => {
        expect(app.strictDrawing.isEmpty()).toBeTruthy(); // drawing is unchanged
      });
    });
  });

  test('a file with an unrecognized extension', () => {
    let fileName = 'asdfqwer.asdf';
    let fileContents = 'asdfasdf';
    let savedDrawing = createDrawingFile({ fileName, fileContents });

    return openSavedDrawing({ app, savedDrawing }).then(() => {
      throw new Error(); // should have thrown
    }).catch(() => {
      // threw as expected
    });
  });
});
