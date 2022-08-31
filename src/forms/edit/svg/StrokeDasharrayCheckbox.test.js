import * as SVG from 'Draw/svg/NodeSVG';
import { strokeDasharrayValueEqualsNone as equalsNone } from 'Values/svg/strokeDasharrayValueEqualsNone';

import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { Simulate } from 'react-dom/test-utils';
import { unmountComponentAtNode } from 'react-dom';

import { StrokeDasharrayCheckbox } from './StrokeDasharrayCheckbox';

let container = null;
let svg = null;
let elements = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = SVG.SVG();
  svg.addTo(container);

  elements = [
    svg.circle(20),
    svg.rect(5, 100),
    svg.line(1, 200, -20, 33),
    svg.path('M 2 2 Q 50 60 200 33.5'),
    svg.ellipse(10, 3),
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

describe('StrokeDasharrayCheckbox component', () => {
  describe('initial checked state', () => {
    test('a missing elements array', () => {
      act(() => {
        render(<StrokeDasharrayCheckbox />, container);
      });
      expect(container.firstChild.checked).toBe(false);
    });

    test('an empty elements array', () => {
      act(() => {
        render(<StrokeDasharrayCheckbox elements={[]} />, container);
      });
      expect(container.firstChild.checked).toBe(false);
    });

    test('when all elements have dashed values', () => {
      elements.forEach(ele => ele.attr('stroke-dasharray', '4 2'));
      // assign some different values
      elements[1].attr('stroke-dasharray', '1');
      elements[2].attr('stroke-dasharray', '10 20 3.5 6');
      act(() => {
        render(<StrokeDasharrayCheckbox elements={elements} />, container);
      });
      expect(container.firstChild.checked).toBe(true);
    });

    test('when not all elements have dashed values', () => {
      // first assign all dashed values
      elements.forEach(ele => ele.attr('stroke-dasharray', '2'));
      act(() => {
        render(<StrokeDasharrayCheckbox elements={elements} />, container);
      });
      expect(container.firstChild.checked).toBe(true);
      // assign one an undashed value
      elements[1].attr('stroke-dasharray', 'none');
      act(() => {
        render(<StrokeDasharrayCheckbox elements={elements} />, container);
      });
      expect(container.firstChild.checked).toBe(false);
    });
  });

  test('checking the checkbox', () => {
    // first assign undashed values to all elements
    elements.forEach(ele => ele.attr('stroke-dasharray', 'none'));
    let values = elements.map(ele => ele.attr('stroke-dasharray'));
    expect(values.every(equalsNone)).toBeTruthy();
    // assign some dashed values
    elements[2].attr('stroke-dasharray', '3.3 5 16 22');

    act(() => {
      render(<StrokeDasharrayCheckbox elements={elements} />, container);
    });
    expect(container.firstChild.checked).toBe(false);

    // check the checkbox
    container.firstChild.checked = true;
    Simulate.change(container.firstChild);

    // all elements should now have dashed values
    values = elements.map(ele => ele.attr('stroke-dasharray'));
    expect(values.some(equalsNone)).toBeFalsy();
    // check that the default dashed value used is reasonable
    expect(elements[0].attr('stroke-dasharray')).toBe('3 1');
    // preexisting dashed values were maintained
    expect(elements[2].attr('stroke-dasharray')).toBe('3.3 5 16 22');
  });

  test('unchecking the checkbox', () => {
    // first assign dashed values to all elements
    elements.forEach(ele => ele.attr('stroke-dasharray', '3 1'));
    let values = elements.map(ele => ele.attr('stroke-dasharray'));
    expect(values.some(equalsNone)).toBeFalsy();

    act(() => {
      render(<StrokeDasharrayCheckbox elements={elements} />, container);
    });
    expect(container.firstChild.checked).toBe(true);

    // uncheck the checkbox
    container.firstChild.checked = false;
    Simulate.change(container.firstChild);

    // all elements should have been assigned undashed values
    elements.forEach(ele => {
      expect(ele.attr('stroke-dasharray')).toBe('none');
    });
  });

  test('defaultDashedValue prop', () => {
    // first assign undashed values to all elements
    elements.forEach(ele => ele.attr('stroke-dasharray', 'none'));
    let values = elements.map(ele => ele.attr('stroke-dasharray'));
    expect(values.every(equalsNone)).toBeTruthy();

    act(() => {
      render(
        <StrokeDasharrayCheckbox
          elements={elements} defaultDashedValue='5 5.5 12 8 1 6.21'
        />,
        container,
      );
    });
    expect(container.firstChild.checked).toBe(false);

    // check the checkbox
    container.firstChild.checked = true;
    Simulate.change(container.firstChild);

    // should have all been assigned the provided value
    elements.forEach(ele => {
      expect(ele.attr('stroke-dasharray')).toBe('5 5.5 12 8 1 6.21');
    });
  });
});
