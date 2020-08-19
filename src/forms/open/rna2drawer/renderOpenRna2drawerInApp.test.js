import renderOpenRna2drawerInApp from './renderOpenRna2drawerInApp';
import App from '../../../App';
import NodeSVG from '../../../draw/NodeSVG';
import * as fs from 'fs';
import { parseRna2drawer1 } from './parseRna2drawer1';

function readRna2drawer1(name) {
  return fs.readFileSync('testinput/rna2drawer1/' + name + '.rna2drawer', 'utf8');
}

function readRna2drawer2(name) {
  return fs.readFileSync('testinput/rna2drawer2/' + name + '.rna2drawer2', 'utf8');
}

// need for parseRna2drawer1 function to work
Object.defineProperty(window, 'getComputedStyle', {
  value: ele => {
    return { color: 'rgb(0, 0, 0)' };
  }
});

let app = null;
let form = null;

beforeEach(() => {
  app = new App(() => NodeSVG());
  let spy = jest.spyOn(app, 'renderForm');
  renderOpenRna2drawerInApp(app);
  let factory = spy.mock.calls[0][0];
  form = factory();
});

describe('opening a .rna2drawer file', () => {
  it('valid file', () => {
    let saved = readRna2drawer1('hairpin');
    expect(parseRna2drawer1(saved)).toBeTruthy(); // is parsable
    let opened = form.props.submit(saved, 'rna2drawer');
    expect(opened).toBeTruthy();
    expect(app.strictDrawing.isEmpty()).toBeFalsy(); // saved drawing was added
  });

  it('file is unparsable', () => {
    let saved = readRna2drawer1('baseOutlineWithInvalidStrokeWidth');
    expect(form.props.submit(saved, 'rna2drawer')).toBeFalsy();
    expect(app.strictDrawing.isEmpty()).toBeTruthy(); // drawing is unchanged
  });
});

describe('opening a .rna2drawer2 file', () => {
  it('valid file', () => {
    let saved = readRna2drawer2('hairpins');
    let spy = jest.spyOn(app.strictDrawing, 'refreshIds');
    let opened = form.props.submit(saved, 'rna2drawer2');
    expect(opened).toBeTruthy();
    expect(app.strictDrawing.isEmpty()).toBeFalsy(); // saved drawing was applied
    expect(spy).toHaveBeenCalled(); // required for SVG ID generator to work correctly
  });

  it('invalid JSON string', () => {
    let saved = '{ asdf: 2, qwer: 5 ';
    let opened = form.props.submit(saved, 'rna2drawer2');
    expect(opened).toBeFalsy();
    expect(app.strictDrawing.isEmpty()).toBeTruthy(); // drawing is unchanged
  });

  it('saved state in unable to be applied', () => {
    let saved = readRna2drawer2('invalidBaseTextId');
    expect(JSON.parse(saved)).toBeTruthy(); // can be parsed
    let opened = form.props.submit(saved, 'rna2drawer2');
    expect(opened).toBeFalsy();
    expect(app.strictDrawing.isEmpty()).toBeTruthy(); // drawing is unchanged
  });
});

it('opening a file with an unrecognized extension', () => {
  expect(form.props.submit('blah blah', 'blah')).toBeFalsy();
});
