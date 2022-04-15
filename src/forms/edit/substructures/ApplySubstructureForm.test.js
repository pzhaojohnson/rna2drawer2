import { App } from 'App';
import * as SVG from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';
import { updateBaseNumberings } from 'Draw/sequences/updateBaseNumberings';
import { numberingOffset } from 'Draw/sequences/numberingOffset';
import { addSecondaryBond } from 'Draw/bonds/straight/add';
import { addTertiaryBond } from 'Draw/bonds/curved/add';

import { ApplySubstructureForm } from './ApplySubstructureForm';

let container = null;
let app = null;
let form = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  app = new App({ SVG });
  app.appendTo(container);

  form = new ApplySubstructureForm({
    unmount: () => {},
    history: {
      goBackward: () => {},
      canGoBackward: () => false,
      goForward: () => {},
      canGoForward: () => false,
    },
    app,
  });
});

afterEach(() => {
  form = null;
  app = null;

  container.remove();
  container = null;
});

describe('ApplySubstructureForm', () => {
  test('submit method', () => {
    // test multiple sequences
    appendSequence(app.strictDrawing.drawing, { id: '1', characters: 'asdfASDF' });
    appendSequence(app.strictDrawing.drawing, { id: 'qwer', characters: 'QWERqqwwee' });
    appendSequence(app.strictDrawing.drawing, { id: 'C', characters: 'cccccc' });

    let sequence = app.strictDrawing.layoutSequence();

    // test nonzero numbering offset
    updateBaseNumberings(sequence, { offset: 6, increment: 3, anchor: 2 });
    expect(numberingOffset(sequence)).toBe(6);

    // preexisting secondary and tertiary bonds to possibly be removed
    addSecondaryBond(app.strictDrawing.drawing, sequence.bases[3], sequence.bases[9]),
    addSecondaryBond(app.strictDrawing.drawing, sequence.bases[4], sequence.bases[8]),
    addTertiaryBond(app.strictDrawing.drawing, sequence.bases[10], sequence.bases[12]),
    addTertiaryBond(app.strictDrawing.drawing, sequence.bases[11], sequence.bases[13]),

    // empty substructure
    expect(() => {
      form.submit({
        substructure: '',
        startPosition: '10',
      });
    }).toThrow();

    // blank substructure
    expect(() => {
      form.submit({
        substructure: '     \t   \n\n   ',
        startPosition: '10',
      });
    }).toThrow();

    // invalid dot-bracket notation for substructure
    expect(() => {
      form.submit({
        substructure: '(((...))',
        startPosition: '10',
      });
    }).toThrow();

    // empty start position
    expect(() => {
      form.submit({
        substructure: '....',
        startPosition: '',
      });
    }).toThrow();

    // blank start position
    expect(() => {
      form.submit({
        substructure: '....',
        startPosition: '  \t\t     \n  ',
      });
    }).toThrow();

    // nonnumeric start position
    expect(() => {
      form.submit({
        substructure: '....',
        startPosition: 'asdf',
      });
    }).toThrow();

    // out of bounds start and end positions
    expect(numberingOffset(sequence)).toBe(6);
    expect(sequence.length).toBe(24);
    expect(() => {
      form.submit({
        substructure: '....',
        startPosition: '6', // just below bounds
      });
    }).toThrow();
    expect(() => {
      form.submit({
        substructure: '....',
        startPosition: '31', // just above bounds
      });
    }).toThrow();
    expect(() => {
      form.submit({
        substructure: '....', // goes just beyond bounds
        startPosition: '28',
      });
    }).toThrow();

    // valid inputs
    expect(() => {
      form.submit({
        substructure: '(((.{{..))).}}.',
        startPosition: '10',
        removeTertiaryBonds: true,
      });
    }).not.toThrow();
  });
});
