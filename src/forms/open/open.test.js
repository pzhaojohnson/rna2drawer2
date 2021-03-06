import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import * as fs from 'fs';
import { open } from './open';
import { parseRna2drawer1 } from './parseRna2drawer1';

function readRna2drawer1(name) {
  return fs.readFileSync('testinput/rna2drawer1/' + name + '.rna2drawer', 'utf8');
}

function readRna2drawer2(name) {
  return fs.readFileSync('testinput/rna2drawer2/' + name + '.rna2drawer2', 'utf8');
}

// needed for parseRna2drawer1 function to run
Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return { color: 'rgb(0, 0, 0)' };
  }
});

let app = null;

beforeEach(() => {
  app = new App(() => NodeSVG());
});

describe('opening a .rna2drawer file', () => {
  it('valid file', () => {
    let contents = readRna2drawer1('hairpin');
    expect(parseRna2drawer1(contents)).toBeTruthy(); // is parsable
    let opened = open(app, { extension: 'rna2drawer', contents: contents });
    expect(opened).toBeTruthy();
    expect(app.strictDrawing.isEmpty()).toBeFalsy(); // saved drawing was added
  });

  it('file is unparsable', () => {
    let contents = readRna2drawer1('baseOutlineWithInvalidStrokeWidth');
    expect(contents).toBeTruthy(); // file was read
    expect(parseRna2drawer1(contents)).toBeFalsy(); // unparsable
    let opened = open(app, { extension: 'rna2drawer', contents: contents });
    expect(opened).toBeFalsy();
    expect(app.strictDrawing.isEmpty()).toBeTruthy(); // drawing is unchanged
  });
});

describe('opening a .rna2drawer2 file', () => {
  it('valid file', () => {
    let contents = readRna2drawer2('hairpins');
    let spy = jest.spyOn(app.strictDrawing, 'refreshIds');
    let opened = open(app, { extension: 'rna2drawer2', contents: contents });
    expect(opened).toBeTruthy();
    expect(app.strictDrawing.isEmpty()).toBeFalsy(); // saved drawing was applied
    expect(spy).toHaveBeenCalled(); // required for SVG ID generator to work correctly
  });

  it('invalid JSON string', () => {
    let contents = '{ asdf: 2, qwer: 5 ';
    let opened = open(app, { extension: 'rna2drawer2', contents: contents });
    expect(opened).toBeFalsy();
    expect(app.strictDrawing.isEmpty()).toBeTruthy(); // drawing is unchanged
  });

  it('saved state in unable to be applied', () => {
    let contents = readRna2drawer2('invalidBaseTextId');
    expect(JSON.parse(contents)).toBeTruthy(); // is parsable
    let opened = open(app, { extension: 'rna2drawer2', contents: contents });
    expect(opened).toBeFalsy();
    expect(app.strictDrawing.isEmpty()).toBeTruthy(); // drawing is unchanged
  });
});

it('opening a file with an unrecognized extension', () => {
  let opened = open(app, { extension: 'asdf', contents: 'asdfasdf' });
  expect(opened).toBeFalsy();
});
