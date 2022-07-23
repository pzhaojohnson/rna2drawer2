import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { unmountComponentAtNode } from 'react-dom';

import { App } from 'App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';
import { addNumbering } from 'Draw/bases/numberings/add';
import { removeNumbering } from 'Draw/bases/numberings/add';
import { areAllUnnumbered } from 'Draw/bases/numberings/areAllUnnumbered';
import { updateBaseNumberings } from 'Draw/sequences/updateBaseNumberings';
import { numberingOffset } from 'Draw/sequences/numberingOffset';

import { NumberingCheckbox } from './NumberingCheckbox';

let app = null;
let drawing = null;
let sequence = null;
let bases = null;

let container = null;

beforeEach(() => {
  app = new App({ SVG: { SVG: NodeSVG } });
  app.appendTo(document.body);

  drawing = app.strictDrawing.drawing;
  sequence = appendSequence(drawing, { id: 'asdf', characters: 'asdfASDFqwerQWER' });

  bases = [
    sequence.atPosition(2),
    sequence.atPosition(6),
    sequence.atPosition(7),
    sequence.atPosition(10),
  ];

  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;

  bases = null;
  sequence = null;
  drawing = null;

  app.remove();
  app = null;
});

describe('NumberingCheckbox component', () => {
  describe('rendering', () => {
    test('when the bases are numbered', () => {
      bases.forEach((base, i) => addNumbering(base, i));
      expect(bases.every(base => base.numbering)).toBeTruthy();
      expect(() => {
        act(() => {
          render(<NumberingCheckbox app={app} bases={bases} />, container);
        });
      }).not.toThrow();
    });

    test('when the bases are not numbered', () => {
      bases.forEach(base => removeNumbering(base));
      expect(bases.every(base => !base.numbering)).toBeTruthy();
      expect(() => {
        act(() => {
          render(<NumberingCheckbox app={app} bases={bases} />, container);
        });
      }).not.toThrow();
    });
  });

  test('removing base numbering', () => {
    bases.forEach((base, i) => addNumbering(base, i));
    expect(bases.every(base => base.numbering)).toBeTruthy();
    let comp = new NumberingCheckbox({ app, bases });
    comp.handleChange({ target: { checked: false } });
    expect(bases.every(base => !base.numbering)).toBeTruthy(); // removed numbering
    app.undo();
    // new Base instances may have been created on undo
    let correspondingBases = bases.map(base => drawing.bases().find(b => b.id == base.id));
    expect(correspondingBases.every(base => base.numbering)).toBeTruthy(); // pushed undo
  });

  describe('adding base numbering', () => {
    test('when the numbering offset is zero', () => {
      updateBaseNumberings(sequence, { offset: 0, increment: 5, anchor: 0 });
      expect(numberingOffset(sequence)).toBe(0);
      let base = sequence.atPosition(3);
      expect(base.numbering).toBeFalsy();
      let comp = new NumberingCheckbox({ app, bases: [base] });
      comp.handleChange({ target: { checked: true } });
      expect(base.numbering).toBeTruthy(); // added numbering
      expect(base.numbering.text.text()).toBe('3');
    });

    test('when the numbering offset is nonzero', () => {
      updateBaseNumberings(sequence, { offset: -52, increment: 6, anchor: 3 });
      expect(numberingOffset(sequence)).toBe(-52);
      let base = sequence.atPosition(5);
      expect(base.numbering).toBeFalsy();
      let comp = new NumberingCheckbox({ app, bases: [base] });
      comp.handleChange({ target: { checked: true } });
      expect(base.numbering).toBeTruthy(); // added numbering
      expect(base.numbering.text.text()).toBe('-47');
    });

    test('when the numbering offset is undefined', () => {
      // remove any base numberings
      sequence.bases.forEach(b => removeNumbering(b));
      expect(areAllUnnumbered(sequence.bases)).toBeTruthy();
      expect(numberingOffset(sequence)).toBeUndefined();
      let base = sequence.atPosition(6);
      expect(base.numbering).toBeFalsy();
      let comp = new NumberingCheckbox({ app, bases: [base] });
      comp.handleChange({ target: { checked: true } });
      expect(base.numbering).toBeTruthy(); // added numbering
      // defaulted to a numbering offset of zero
      expect(base.numbering.text.text()).toBe('6');
    });

    test('when the base must be found from among multiple sequences', () => {
      appendSequence(drawing, { id: 'asdf', characters: 'asdfASDFasdf' });
      let sequence = appendSequence(drawing, { id: 'qwer', characters: 'QWERQWERqwerqwer' });
      appendSequence(drawing, { id: 'ZXCV', characters: 'ZXCV' });
      expect(drawing.sequences.indexOf(sequence)).toBeGreaterThan(0);
      updateBaseNumberings(sequence, { offset: 23, increment: 6, anchor: 0 });
      let base = sequence.atPosition(8);
      expect(base.numbering).toBeFalsy();
      let comp = new NumberingCheckbox({ app, bases: [base] });
      comp.handleChange({ target: { checked: true } });
      expect(base.numbering).toBeTruthy(); // added numbering
      // had to have found the sequence to apply its numbering offset
      expect(base.numbering.text.text()).toBe('31');
    });

    it('pushes undo', () => {
      bases.forEach(base => removeNumbering(base));
      expect(bases.every(base => !base.numbering)).toBeTruthy();
      let comp = new NumberingCheckbox({ app, bases });
      comp.handleChange({ target: { checked: true } });
      expect(bases.every(base => base.numbering)).toBeTruthy(); // added numbering
      app.undo();
      // new Base instances may have been created on undo
      let correspondingBases = bases.map(base => drawing.bases().find(b => b.id == base.id));
      expect(correspondingBases.every(base => !base.numbering)).toBeTruthy(); // pushed undo
    });
  });
});
