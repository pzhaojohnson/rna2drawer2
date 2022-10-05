import { App } from 'App';

import * as SVG from 'Draw/svg/NodeSVG';

import { appendSequence } from 'Draw/sequences/add/sequence';

import * as React from 'react';

import { render } from 'react-dom';
import { unmountComponentAtNode } from 'react-dom';

import { act } from 'react-dom/test-utils';
import { Simulate } from 'react-dom/test-utils';

import { CharacterField } from './CharacterField';

class DrawingWrapper {
  constructor(drawing) {
    this.drawing = drawing;
  }

  get sequences() {
    return this.drawing.sequences;
  }

  appendSequence(sequenceSpecification) {
    appendSequence(this.drawing, {
      id: sequenceSpecification.id,
      characters: sequenceSpecification.sequence,
    });
  }
}

let app = null;

let drawing = null;

let container = null;

beforeEach(() => {
  app = new App({ SVG });
  app.appendTo(document.body);

  drawing = new DrawingWrapper(app.drawing);

  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;

  drawing = null;

  app.remove();
  app = null;
});

describe('CharacterField component', () => {
  describe('displaying the current character', () => {
    test('when all bases have the same character', () => {
      drawing.appendSequence({ id: '1', sequence: 'HHHHH' });
      let bases = [...drawing.sequences[0].bases];

      act(() => render(
        <CharacterField app={app} bases={bases} />,
        container,
      ));

      let input = container.getElementsByTagName('input')[0];
      expect(input.value).toBe('H');
    });

    test('when not all bases have the same character', () => {
      drawing.appendSequence({ id: 'A', sequence: 'HHHYHH' });
      let bases = [...drawing.sequences[0].bases];

      act(() => render(
        <CharacterField app={app} bases={bases} />,
        container,
      ));

      let input = container.getElementsByTagName('input')[0];
      expect(input.value).toBe('');
    });

    test('an empty array of bases', () => {
      act(() => render(
        <CharacterField app={app} bases={[]} />,
        container,
      ));

      let input = container.getElementsByTagName('input')[0];
      expect(input.value).toBe('');
    });
  });

  describe('setting the characters of bases', () => {
    test('on blur', () => {
      drawing.appendSequence({ id: 'asdf', sequence: 'ASDF' });
      let bases = [...drawing.sequences[0].bases];

      act(() => render(
        <CharacterField app={app} bases={bases} />,
        container,
      ));

      let input = container.getElementsByTagName('input')[0];
      input.value = 'b';
      Simulate.change(input);
      Simulate.blur(input);

      expect(bases.map(b => b.text.text()).join('')).toBe('bbbb');
    });

    test('on Enter key press', () => {
      drawing.appendSequence({ id: 'v', sequence: 'zxZXCV' });
      let bases = [...drawing.sequences[0].bases];

      act(() => render(
        <CharacterField app={app} bases={bases} />,
        container,
      ));

      let input = container.getElementsByTagName('input')[0];
      input.value = '5';
      Simulate.change(input);
      Simulate.keyUp(input, { key: 'Enter' });

      expect(bases.map(b => b.text.text()).join('')).toBe('555555');
    });

    test('blank inputs', () => {
      drawing.appendSequence({ id: '1', sequence: 'ddddd' });
      let bases = [...drawing.sequences[0].bases];

      act(() => render(
        <CharacterField app={app} bases={bases} />,
        container,
      ));

      let input = container.getElementsByTagName('input')[0];
      input.value = '     '; // is all whitespace
      Simulate.change(input);
      Simulate.blur(input);

      // expect the blank input to have been ignored
      expect(bases.map(b => b.text.text()).join('')).toBe('ddddd');

      expect(input.value).toBe('d'); // was reset
    });

    test('multicharacter inputs', () => {
      drawing.appendSequence({ id: '2', sequence: 'abcdef' });
      let bases = [...drawing.sequences[0].bases];

      act(() => render(
        <CharacterField app={app} bases={bases} />,
        container,
      ));

      let input = container.getElementsByTagName('input')[0];
      input.value = 'JHK'; // is more than one character
      Simulate.change(input);
      Simulate.blur(input);

      // expect characters after the first to have been ignored
      expect(bases.map(b => b.text.text()).join('')).toBe('JJJJJJ');
    });

    test('inputs equal to the current character', () => {
      drawing.appendSequence({ id: 'asdf', sequence: 'ccccc' });
      let bases = [...drawing.sequences[0].bases];

      act(() => render(
        <CharacterField app={app} bases={bases} />,
        container,
      ));

      let input = container.getElementsByTagName('input')[0];
      expect(input.value).toBe('c');

      input.value = '  c   '; // has leading and trailing whitespace
      Simulate.change(input);
      Simulate.blur(input);

      // expect the characters of the bases to be unchanged
      expect(bases.map(b => b.text.text()).join('')).toBe('ccccc');

      expect(input.value).toBe('c'); // was reset
    });

    test('an empty array of bases', () => {
      act(() => render(
        <CharacterField app={app} bases={[]} />,
        container,
      ));

      let input = container.getElementsByTagName('input')[0];
      input.value = '9';
      Simulate.change(input);
      expect(() => Simulate.blur(input)).not.toThrow();

      expect(input.value).toBe(''); // was reset
    });
  });
});
