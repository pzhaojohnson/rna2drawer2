import * as SVG from 'Draw/svg/NodeSVG';

import * as React from 'react';

import { render } from 'react-dom';
import { unmountComponentAtNode } from 'react-dom';

import { act } from 'react-dom/test-utils';
import { Simulate } from 'react-dom/test-utils';

import { NumericAttributeInput } from './NumericAttributeInput';

let container = null;

let svg = null;

let elements = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = SVG.SVG();
  svg.addTo(document.body);

  elements = [
    svg.line(10, 50, 20, 33),
    svg.rect(10, 40),
    svg.line(33.5, -3, 22, 100),
    svg.rect(2, 100),
    svg.rect(2000, 11),
  ];
});

afterEach(() => {
  elements = null;

  svg.remove();
  svg = null;

  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('NumericAttributeInput component', () => {
  test('id prop', () => {
    act(() => render(
      <NumericAttributeInput id='asdfFDsa321' />,
      container,
    ));

    expect(container.firstChild.id).toBe('asdfFDsa321');
  });

  describe('displaying the current value', () => {
    test('when all elements have the same value', () => {
      elements.forEach(ele => ele.attr('stroke-width', 12.08));

      act(() => render(
        <NumericAttributeInput
          elements={elements} attributeName='stroke-width'
        />,
        container,
      ));

      expect(container.firstChild.value).toBe('12.08');
    });

    test('when not all elements have the same value', () => {
      elements.forEach(ele => ele.attr('stroke-width', 12.08));
      elements[1].attr('stroke-width', 12.09); // make different

      act(() => render(
        <NumericAttributeInput
          elements={elements} attributeName='stroke-width'
        />,
        container,
      ));

      expect(container.firstChild.value).toBe('');
    });

    test('when all elements have the same rounded value', () => {
      elements.forEach(ele => ele.attr('width', 21.872));
      elements[1].attr('width', 21.8718);
      elements[2].attr('width', 21.8724);

      act(() => render(
        <NumericAttributeInput
          elements={elements} attributeName='width' places={3}
        />,
        container,
      ));

      expect(container.firstChild.value).toBe('21.872');
    });

    test('when not all elements have the same rounded value', () => {
      elements.forEach(ele => ele.attr('width', 21.872));
      elements[1].attr('width', 21.8713);

      act(() => render(
        <NumericAttributeInput
          elements={elements} attributeName='width' places={3}
        />,
        container,
      ));

      expect(container.firstChild.value).toBe('');
    });

    test('an empty elements array', () => {
      act(() => render(
        <NumericAttributeInput elements={[]} />,
        container,
      ));

      expect(container.firstChild.value).toBe('');
    });

    test('missing elements array and attributeName props', () => {
      act(() => render(
        <NumericAttributeInput />,
        container,
      ));

      expect(container.firstChild.value).toBe('');
    });
  });

  describe('setting the attributes of elements', () => {
    test('blur event', () => {
      act(() => render(
        <NumericAttributeInput elements={elements} attributeName='height' />,
        container,
      ));

      container.firstChild.value = '70';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      expect(elements.every(ele => ele.attr('height') === 70)).toBeTruthy();
    });

    test('Enter key press', () => {
      act(() => render(
        <NumericAttributeInput elements={elements} attributeName='height' />,
        container,
      ));

      container.firstChild.value = '23.8';
      Simulate.change(container.firstChild);
      Simulate.keyUp(container.firstChild, { key: 'Enter' });

      expect(elements.every(ele => ele.attr('height') === 23.8)).toBeTruthy();
    });

    test('onEdit callback prop', () => {
      elements.forEach(ele => ele.attr('width', 20.1));

      let onEdit = jest.fn(() => {
        expect(
          elements.every(ele => ele.attr('width') === 12.97)
        ).toBeTruthy();
      });

      act(() => render(
        <NumericAttributeInput
          elements={elements} attributeName='width' onEdit={onEdit}
        />,
        container,
      ));

      container.firstChild.value = '12.97';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      expect(onEdit).toHaveBeenCalledTimes(1);
      expect(onEdit.mock.calls[0][0].newValue).toBe(12.97);
      expect(onEdit.mock.calls[0][0].oldValue).toBe(20.1);
    });

    test('onBeforeEdit callback prop', () => {
      elements.forEach(ele => ele.attr('width', 3));

      let onBeforeEdit = jest.fn(() => {
        expect(
          elements.every(ele => ele.attr('width') === 3)
        ).toBeTruthy();
      });

      act(() => render(
        <NumericAttributeInput
          elements={elements} attributeName='width' onBeforeEdit={onBeforeEdit}
        />,
        container,
      ));

      container.firstChild.value = '12.2';
      Simulate.change(container.firstChild);
      Simulate.keyUp(container.firstChild, { key: 'Enter' });

      expect(onBeforeEdit).toHaveBeenCalledTimes(1);
      expect(onBeforeEdit.mock.calls[0][0].newValue).toBe(12.2);
      expect(onBeforeEdit.mock.calls[0][0].oldValue).toBe(3);

      // elements were edited
      expect(elements.every(ele => ele.attr('width') === 12.2)).toBeTruthy();
    });

    test('when the input value equals the current value', () => {
      elements.forEach(ele => ele.attr('stroke-width', 2.8));
      let onEdit = jest.fn();

      act(() => render(
        <NumericAttributeInput
          elements={elements} attributeName='stroke-width' onEdit={onEdit}
        />,
        container,
      ));

      container.firstChild.value = '  2.8   '; // extra whitespace
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      expect( // to be unchanged
        elements.every(ele => ele.attr('stroke-width') === 2.8)
      ).toBeTruthy();

      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe('2.8') // was reset
    });

    test('when the input value is less than the minValue prop', () => {
      elements.forEach(ele => ele.attr('stroke-width', 5));

      act(() => render(
        <NumericAttributeInput
          elements={elements} attributeName='stroke-width' minValue={2}
        />,
        container,
      ));

      container.firstChild.value = '-2';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      expect(
        elements.every(ele => ele.attr('stroke-width') === 2) // clamped
      ).toBeTruthy();
    });

    test('when the input value is greater than the maxValue prop', () => {
      elements.forEach(ele => ele.attr('height', 10));

      act(() => render(
        <NumericAttributeInput
          elements={elements} attributeName='height' maxValue={50}
        />,
        container,
      ));

      container.firstChild.value = '100';
      Simulate.change(container.firstChild);
      Simulate.keyUp(container.firstChild, { key: 'Enter' });

      expect(
        elements.every(ele => ele.attr('height') === 50) // clamped
      ).toBeTruthy();
    });

    test('when the current value is the minValue prop', () => {
      elements.forEach(ele => ele.attr('width', 5));
      let onEdit = jest.fn();

      act(() => render(
        <NumericAttributeInput
          elements={elements} attributeName='width' minValue={5}
          onEdit={onEdit}
        />,
        container,
      ));

      container.firstChild.value = '2'; // should get clamped
      Simulate.change(container.firstChild);
      Simulate.keyUp(container.firstChild, { key: 'Enter' });

      // are unchanged
      expect(elements.every(ele => ele.attr('width') === 5)).toBeTruthy();

      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe('5'); // was reset
    });

    test('when the current value is the maxValue prop', () => {
      elements.forEach(ele => ele.attr('height', 33));
      let onEdit = jest.fn();

      act(() => render(
        <NumericAttributeInput
          elements={elements} attributeName='height' maxValue={33}
          onEdit={onEdit}
        />,
        container,
      ));

      container.firstChild.value = '50'; // should get clamped
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      // are unchanged
      expect(elements.every(ele => ele.attr('height') === 33)).toBeTruthy();

      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe('33'); // was reset
    });

    test('when the input value has more places than the places prop', () => {
      act(() => render(
        <NumericAttributeInput
          elements={elements} attributeName='width' places={2}
        />,
        container,
      ));

      container.firstChild.value = '10.123456';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      expect( // to have not been rounded
        elements.every(ele => ele.attr('width') === 10.123456)
      ).toBeTruthy();
    });

    test('blank inputs', () => {
      elements.forEach(ele => ele.attr('width', 12));
      let onEdit = jest.fn();

      act(() => render(
        <NumericAttributeInput
          elements={elements} attributeName='width' onEdit={onEdit}
        />,
        container,
      ));

      container.firstChild.value = '    ';
      Simulate.change(container.firstChild);
      Simulate.keyUp(container.firstChild, { key: 'Enter' });

      // are unchanged
      expect(elements.every(ele => ele.attr('width') === 12)).toBeTruthy();

      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe('12'); // was reset
    });

    test('non-numeric inputs', () => {
      elements.forEach(ele => ele.attr('height', 8));
      let onEdit = jest.fn();

      act(() => render(
        <NumericAttributeInput
          elements={elements} attributeName='height' onEdit={onEdit}
        />,
        container,
      ));

      container.firstChild.value = 'asdf';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      // are unchanged
      expect(elements.every(ele => ele.attr('height') === 8)).toBeTruthy();

      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe('8'); // was reset
    });

    test('nonfinite inputs', () => {
      elements.forEach(ele => ele.attr('width', 15));
      let onEdit = jest.fn();

      act(() => render(
        <NumericAttributeInput
          elements={elements} attributeName='width' onEdit={onEdit}
        />,
        container,
      ));

      container.firstChild.value = 'Infinity';
      Simulate.change(container.firstChild);
      Simulate.keyUp(container.firstChild, { key: 'Enter' });

      // are unchanged
      expect(elements.every(ele => ele.attr('width') === 15)).toBeTruthy();

      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe('15'); // was reset
    });

    test('missing elements array and attributeName props', () => {
      let onEdit = jest.fn();

      act(() => render(
        <NumericAttributeInput onEdit={onEdit} />,
        container,
      ));

      container.firstChild.value = '12';
      Simulate.change(container.firstChild);
      expect(() => Simulate.blur(container.firstChild)).not.toThrow();

      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe(''); // was reset
    });
  });

  test('style prop', () => {
    act(() => render(
      <NumericAttributeInput style={{ margin: '1px 5px 66px 2px' }} />,
      container,
    ));

    expect(container.firstChild.style.margin).toBe('1px 5px 66px 2px');
  });
});
