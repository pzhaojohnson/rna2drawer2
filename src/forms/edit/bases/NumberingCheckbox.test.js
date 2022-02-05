import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { unmountComponentAtNode } from 'react-dom';

import { App } from 'App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';
import { addNumbering } from 'Draw/bases/number/add';
import { removeNumbering } from 'Draw/bases/number/add';
import { areUnnumbered } from 'Draw/bases/number/areUnnumbered';
import { updateBaseNumberings } from 'Draw/sequences/updateBaseNumberings';
import { numberingOffset } from 'Draw/sequences/numberingOffset';

import { NumberingCheckbox } from './NumberingCheckbox';

let app = null;
let drawing = null;
let sequence = null;
let base = null;

let container = null;

beforeEach(() => {
  app = new App({ SVG: { SVG: NodeSVG } });
  app.appendTo(document.body);

  drawing = app.strictDrawing.drawing;
  sequence = appendSequence(drawing, { id: 'asdf', characters: 'asdfASDFqwerQWER' });
  base = sequence.atPosition(6);

  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;

  base = null;
  sequence = null;
  drawing = null;

  app.remove();
  app = null;
});

describe('NumberingCheckbox component', () => {
  describe('rendering', () => {
    test('when the base is numbered', () => {
      addNumbering(base, 10);
      expect(base.numbering).toBeTruthy();
      expect(() => {
        act(() => {
          render(<NumberingCheckbox app={app} base={base} />, container);
        });
      }).not.toThrow();
    });

    test('when the base is not numbered', () => {
      removeNumbering(base);
      expect(base.numbering).toBeFalsy();
      expect(() => {
        act(() => {
          render(<NumberingCheckbox app={app} base={base} />, container);
        });
      }).not.toThrow();
    });
  });

  test('removing base numbering', () => {
    addNumbering(base, 50);
    expect(base.numbering).toBeTruthy();
    let comp = new NumberingCheckbox({ app, base });
    comp.handleChange({ target: { checked: false } });
    expect(base.numbering).toBeFalsy(); // removed numbering
    app.undo();
    // new Base instances may have been created on undo
    let correspondingBase = drawing.bases().find(b => b.id == base.id);
    expect(correspondingBase.numbering).toBeTruthy(); // pushed undo
  });

  describe('adding base numbering', () => {
    test('when the numbering offset is zero', () => {
      updateBaseNumberings(sequence, { offset: 0, increment: 5, anchor: 0 });
      expect(numberingOffset(sequence)).toBe(0);
      let base = sequence.atPosition(3);
      expect(base.numbering).toBeFalsy();
      let comp = new NumberingCheckbox({ app, base });
      comp.handleChange({ target: { checked: true } });
      expect(base.numbering).toBeTruthy(); // added numbering
      expect(base.numbering.text.text()).toBe('3');
    });

    test('when the numbering offset is nonzero', () => {
      updateBaseNumberings(sequence, { offset: -52, increment: 6, anchor: 3 });
      expect(numberingOffset(sequence)).toBe(-52);
      let base = sequence.atPosition(5);
      expect(base.numbering).toBeFalsy();
      let comp = new NumberingCheckbox({ app, base });
      comp.handleChange({ target: { checked: true } });
      expect(base.numbering).toBeTruthy(); // added numbering
      expect(base.numbering.text.text()).toBe('-47');
    });

    test('when the numbering offset is undefined', () => {
      // remove any base numberings
      sequence.bases.forEach(b => removeNumbering(b));
      expect(areUnnumbered(sequence.bases)).toBeTruthy();
      expect(numberingOffset(sequence)).toBeUndefined();
      let base = sequence.atPosition(6);
      expect(base.numbering).toBeFalsy();
      let comp = new NumberingCheckbox({ app, base });
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
      let comp = new NumberingCheckbox({ app, base });
      comp.handleChange({ target: { checked: true } });
      expect(base.numbering).toBeTruthy(); // added numbering
      // had to have found the sequence to apply its numbering offset
      expect(base.numbering.text.text()).toBe('31');
    });

    it('pushes undo', () => {
      removeNumbering(base);
      expect(base.numbering).toBeFalsy();
      let comp = new NumberingCheckbox({ app, base });
      comp.handleChange({ target: { checked: true } });
      expect(base.numbering).toBeTruthy(); // added numbering
      app.undo();
      // new Base instances may have been created on undo
      let correspondingBase = drawing.bases().find(b => b.id == base.id);
      expect(correspondingBase.numbering).toBeFalsy(); // pushed undo
    });
  });
});
