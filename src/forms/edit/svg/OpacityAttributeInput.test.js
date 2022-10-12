import * as SVG from 'Draw/svg/NodeSVG';

import * as React from 'react';

import { render } from 'react-dom';
import { unmountComponentAtNode } from 'react-dom';

import { act } from 'react-dom/test-utils';
import { Simulate } from 'react-dom/test-utils';

import { OpacityAttributeInput } from './OpacityAttributeInput';

let container = null;

let svg = null;

let elements = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = SVG.SVG();
  svg.addTo(document.body);

  // all elements use all the opacity attributes
  // (i.e., opacity, stroke-opacity and fill-opacity)
  elements = [
    svg.circle(20),
    svg.rect(10, 50),
    svg.path('M 2 30 Q 0 -20 500 44'),
    svg.ellipse(10, 3),
    svg.circle(10),
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

describe('OpacityAttributeInput component', () => {
  test('id prop', () => {
    let props = { id: 'asdfFDSA123455555' };
    act(() => render(<OpacityAttributeInput {...props} />, container));
    expect(container.firstChild.id).toBe('asdfFDSA123455555');
  });

  describe('the initially displayed value', () => {
    test('when all elements have the same value', () => {
      let attributeName = 'opacity';
      elements.forEach(ele => ele.attr(attributeName, 0.78));
      let props = { elements, attributeName };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      expect(container.firstChild.value).toBe('78%');
    });

    test('when not all elements have the same value', () => {
      let attributeName = 'opacity';
      elements.forEach(ele => ele.attr(attributeName, 0.78));
      elements[1].attr(attributeName, 0.77); // make different
      let props = { elements, attributeName };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      expect(container.firstChild.value).toBe('%');
    });

    test('when all elements have the same rounded value', () => {
      let attributeName = 'stroke-opacity';
      elements.forEach(ele => ele.attr(attributeName, 0.583));
      elements[1].attr(attributeName, 0.5834);
      elements[2].attr(attributeName, 0.5828);
      let places = 3;
      let props = { elements, attributeName, places };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      expect(container.firstChild.value).toBe('58.3%');
    });

    test('when not all elements have the same rounded value', () => {
      let attributeName = 'stroke-opacity';
      elements.forEach(ele => ele.attr(attributeName, 0.583));
      elements[1].attr(attributeName, 0.5836);
      let places = 3;
      let props = { elements, attributeName, places };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      expect(container.firstChild.value).toBe('%');
    });

    test('missing places prop', () => {
      let attributeName = 'fill-opacity';
      elements.forEach(ele => ele.attr(attributeName, 0.58));
      elements[1].attr(attributeName, 0.583); // should round to 0.58
      elements[2].attr(attributeName, 0.57622);
      let props = { elements, attributeName };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      expect(container.firstChild.value).toBe('58%');
    });

    test('when the places prop is less than two', () => {
      let attributeName = 'opacity';
      elements.forEach(ele => ele.attr(attributeName, 0.61));
      elements[1].attr(attributeName, 0.7);
      elements[2].attr(attributeName, 0.82);
      let places = 0;
      let props = { elements, attributeName, places };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      expect(container.firstChild.value).toBe('100%');
    });

    test('an empty elements array', () => {
      let elements = [];
      let attributeName = 'stroke-opacity';
      let props = { elements, attributeName };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      expect(container.firstChild.value).toBe('%');
    });

    test('an elements array containing one element', () => {
      let elements = [svg.circle(50)];
      let attributeName = 'stroke-opacity';
      elements[0].attr(attributeName, 0.82);
      let props = { elements, attributeName };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      expect(container.firstChild.value).toBe('82%');
    });

    test('missing elements array prop', () => {
      let attributeName = 'stroke-opacity';
      let props = { attributeName };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      expect(container.firstChild.value).toBe('%');
    });

    test('missing attributeName prop', () => {
      let props = { elements };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      expect(container.firstChild.value).toBe('%');
    });
  });

  describe('editing the SVG elements', () => {
    test('on blur', () => {
      let attributeName = 'opacity';
      elements.forEach(ele => ele.attr(attributeName, 1));
      let props = { elements, attributeName };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      container.firstChild.value = '35';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);
      elements.forEach(ele => expect(ele.attr(attributeName)).toBe(0.35));
    });

    test('on Enter key press', () => {
      let attributeName = 'stroke-opacity';
      elements.forEach(ele => ele.attr(attributeName, 1));
      let props = { elements, attributeName };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      container.firstChild.value = '51';
      Simulate.change(container.firstChild);
      Simulate.keyUp(container.firstChild, { key: 'Enter' });
      elements.forEach(ele => expect(ele.attr(attributeName)).toBe(0.51));
    });

    test('when the input value includes a percentage sign', () => {
      let attributeName = 'opacity';
      elements.forEach(ele => ele.attr(attributeName, 1));
      let props = { elements, attributeName };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      container.firstChild.value = '35%'; // should be same as "35"
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);
      elements.forEach(ele => expect(ele.attr(attributeName)).toBe(0.35));
    });

    test('onEdit callback prop', () => {
      let attributeName = 'stroke-opacity';
      elements.forEach(ele => ele.attr(attributeName, 0.07));

      let onEdit = jest.fn(() => {
        // expect to have been edited
        elements.forEach(ele => expect(ele.attr(attributeName)).toBe(0.47));
      });

      let props = { elements, attributeName, onEdit };
      act(() => render(<OpacityAttributeInput {...props} />, container));

      container.firstChild.value = '47';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      expect(onEdit).toHaveBeenCalledTimes(1);
      expect(onEdit.mock.calls[0][0].newValue).toBe(0.47);
      expect(onEdit.mock.calls[0][0].oldValue).toBe(0.07);
    });

    test('onBeforeEdit callback prop', () => {
      let attributeName = 'stroke-opacity';
      elements.forEach(ele => ele.attr(attributeName, 0.07));

      let onBeforeEdit = jest.fn(() => {
        // expect to have not been edited
        elements.forEach(ele => expect(ele.attr(attributeName)).toBe(0.07));
      });

      let props = { elements, attributeName, onBeforeEdit };
      act(() => render(<OpacityAttributeInput {...props} />, container));

      container.firstChild.value = '47';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      expect(onBeforeEdit).toHaveBeenCalledTimes(1);
      expect(onBeforeEdit.mock.calls[0][0].newValue).toBe(0.47);
      expect(onBeforeEdit.mock.calls[0][0].oldValue).toBe(0.07);
    });

    test('when the input value would not change the SVG elements', () => {
      let attributeName = 'fill-opacity';
      elements.forEach(ele => ele.attr(attributeName, 0.32));
      let onEdit = jest.fn();
      let props = { elements, attributeName, onEdit };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      container.firstChild.value = '   32  '; // extra whitespace
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);
      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe('32%'); // was reset
    });

    test('when the input value is less than zero', () => {
      let attributeName = 'fill-opacity';
      elements.forEach(ele => ele.attr(attributeName, 0.32));
      let props = { elements, attributeName };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      container.firstChild.value = '-10'; // should clamp to zero
      Simulate.change(container.firstChild);
      Simulate.keyUp(container.firstChild, { key: 'Enter' });
      elements.forEach(ele => expect(ele.attr(attributeName)).toBe(0));
    });

    test('when the input value is greater than 100%', () => {
      let attributeName = 'fill-opacity';
      elements.forEach(ele => ele.attr(attributeName, 0.32));
      let props = { elements, attributeName };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      container.firstChild.value = '200'; // should clamp to 100%
      Simulate.change(container.firstChild);
      Simulate.keyUp(container.firstChild, { key: 'Enter' });
      elements.forEach(ele => expect(ele.attr(attributeName)).toBe(1));
    });

    test('when the input value is zero', () => {
      let attributeName = 'opacity';
      elements.forEach(ele => ele.attr(attributeName, 0.32));
      let props = { elements, attributeName };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      container.firstChild.value = '0';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);
      elements.forEach(ele => expect(ele.attr(attributeName)).toBe(0));
    });

    test('when the input value is 100%', () => {
      let attributeName = 'stroke-opacity';
      elements.forEach(ele => ele.attr(attributeName, 0.32));
      let props = { elements, attributeName };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      container.firstChild.value = '100';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);
      elements.forEach(ele => expect(ele.attr(attributeName)).toBe(1));
    });

    test('when the input value has more places than the places prop', () => {
      let attributeName = 'fill-opacity';
      let places = 3;
      let props = { elements, attributeName, places };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      container.firstChild.value = '28.926'; // should not round
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);
      elements.forEach(ele => {
        expect(ele.attr(attributeName)).toBeCloseTo(0.28926, 5)
      });
    });

    test('blank inputs', () => {
      let attributeName = 'opacity';
      elements.forEach(ele => ele.attr(attributeName, 0.6));
      let onEdit = jest.fn();
      let props = { elements, attributeName, onEdit };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      container.firstChild.value = '     ';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);
      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe('60%'); // was reset
    });

    test('non-numeric inputs', () => {
      let attributeName = 'opacity';
      elements.forEach(ele => ele.attr(attributeName, 0.4));
      let onEdit = jest.fn();
      let props = { elements, attributeName, onEdit };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      container.firstChild.value = 'asdf';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);
      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe('40%'); // was reset
    });

    test('nonfinite inputs', () => {
      let attributeName = 'opacity';
      elements.forEach(ele => ele.attr(attributeName, 0.3));
      let props = { elements, attributeName };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      container.firstChild.value = 'Infinity'; // should clamp to 100%
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);
      elements.forEach(ele => expect(ele.attr(attributeName)).toBe(1));
    });

    test('an empty elements array', () => {
      let elements = [];
      let attributeName = 'fill-opacity';
      let onEdit = jest.fn();
      let props = { elements, attributeName, onEdit };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      container.firstChild.value = '44';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);
      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe('%'); // was reset
    });

    test('an elements array containing one element', () => {
      let elements = [svg.circle(100)];
      let attributeName = 'fill-opacity';
      elements[0].attr(attributeName, 0.97);
      let props = { elements, attributeName };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      container.firstChild.value = '48';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);
      expect(elements[0].attr(attributeName)).toBe(0.48);
    });

    test('missing elements array prop', () => {
      let attributeName = 'stroke-opacity';
      let onEdit = jest.fn();
      let props = { attributeName, onEdit };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      container.firstChild.value = '52';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);
      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe('%'); // was reset
    });

    test('missing attributeName prop', () => {
      let onEdit = jest.fn();
      let props = { elements, onEdit };
      act(() => render(<OpacityAttributeInput {...props} />, container));
      container.firstChild.value = '17';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);
      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe('%'); // was reset
    });
  });

  test('style prop', () => {
    let props = { style: { margin: '2px 1px 55px 30px' } };
    act(() => render(<OpacityAttributeInput {...props} />, container));
    expect(container.firstChild.style.margin).toBe('2px 1px 55px 30px');
  });
});
