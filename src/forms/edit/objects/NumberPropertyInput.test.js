import * as React from 'react';

import { render } from 'react-dom';
import { unmountComponentAtNode } from 'react-dom';

import { act } from 'react-dom/test-utils';
import { Simulate } from 'react-dom/test-utils';

import { NumberPropertyInput } from './NumberPropertyInput';

let container = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('NumberPropertyInput component', () => {
  test('id prop', () => {
    act(() => render(
      <NumberPropertyInput id='aaAA123321FDS' />,
      container,
    ));

    expect(container.firstChild.id).toBe('aaAA123321FDS');
  });

  describe('displaying the current value', () => {
    test('when all objects have the same value', () => {
      let objects = [1, 2, 3, 4, 5].map(() => ({ 'prop1': 5.12 }));

      act(() => render(
        <NumberPropertyInput objects={objects} propertyName='prop1' />,
        container,
      ));

      expect(container.firstChild.value).toBe('5.12');
    });

    test('when not all objects have the same value', () => {
      let objects = [1, 2, 3, 4, 5].map(() => ({ 'prop1': 5.12 }));
      objects[3]['prop1'] = 5.11;

      act(() => render(
        <NumberPropertyInput objects={objects} propertyName='prop1' />,
        container,
      ));

      expect(container.firstChild.value).toBe('');
    });

    test('when all objects have the same rounded value', () => {
      let objects = [1, 2, 3, 4].map(() => ({ 'p1': 3.8827 }));
      objects[1]['p1'] = 3.88266;
      objects[2]['p1'] = 3.88273;

      act(() => render(
        <NumberPropertyInput objects={objects} propertyName='p1' places={4} />,
        container,
      ));

      expect(container.firstChild.value).toBe('3.8827');
    });

    test('when not all objects have the same rounded value', () => {
      let objects = [1, 2, 3, 4].map(() => ({ 'p1': 3.8827 }));
      objects[1]['p1'] = 3.88263;

      act(() => render(
        <NumberPropertyInput objects={objects} propertyName='p1' places={4} />,
        container,
      ));

      expect(container.firstChild.value).toBe('');
    });

    test('when some objects have non-number values', () => {
      let objects = [1, 2, 3, 4, 5, 6].map(() => ({ 'p2': 6 }));
      objects[1]['p2'] = '6';
      objects[2]['p2'] = null;
      objects[4]['p2'] = undefined;

      act(() => render(
        <NumberPropertyInput objects={objects} propertyName='p2' />,
        container,
      ));

      expect(container.firstChild.value).toBe('');
    });

    test('an empty objects array', () => {
      act(() => render(
        <NumberPropertyInput objects={[]} propertyName='p1' />,
        container,
      ));

      expect(container.firstChild.value).toBe('');
    });

    test('missing objects array prop', () => {
      act(() => render(
        <NumberPropertyInput propertyName='p' />,
        container,
      ));

      expect(container.firstChild.value).toBe('');
    });

    test('missing propertyName prop', () => {
      let objects = [1, 2, 3].map(() => ({ 'p': 1 }));

      act(() => render(
        <NumberPropertyInput objects={objects} />,
        container,
      ));

      expect(container.firstChild.value).toBe('');
    });
  });

  describe('setting object properties', () => {
    test('on blur', () => {
      let objects = [1, 2, 3, 4].map(() => ({ 'prop2': 4 }));

      act(() => render(
        <NumberPropertyInput objects={objects} propertyName='prop2' />,
        container,
      ));

      container.firstChild.value = '9';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      expect(objects.map(o => o['prop2'])).toEqual([9, 9, 9, 9]);
    });

    test('on Enter key press', () => {
      let objects = [1, 2, 3, 4, 5].map(() => ({ 'p3': 2 }));

      act(() => render(
        <NumberPropertyInput objects={objects} propertyName='p3' />,
        container,
      ));

      container.firstChild.value = '7';
      Simulate.change(container.firstChild);
      Simulate.keyUp(container.firstChild, { key: 'Enter' });

      expect(objects.map(o => o['p3'])).toEqual([7, 7, 7, 7, 7]);
    });

    test('onEdit callback prop', () => {
      let objects = [1, 2, 3].map(() => ({ 'p': 10 }));

      let onEdit = jest.fn(() => {
        expect(objects.map(o => o['p'])).toEqual([2.2, 2.2, 2.2]);
      });

      act(() => render(
        <NumberPropertyInput
          objects={objects} propertyName='p' onEdit={onEdit}
        />,
        container,
      ));

      container.firstChild.value = '2.2';
      Simulate.change(container.firstChild);
      Simulate.keyUp(container.firstChild, { key: 'Enter' });

      // were edited
      expect(objects.map(o => o['p'])).toEqual([2.2, 2.2, 2.2]);

      expect(onEdit).toHaveBeenCalledTimes(1);
      expect(onEdit.mock.calls[0][0].newValue).toBe(2.2);
      expect(onEdit.mock.calls[0][0].oldValue).toBe(10);
    });

    test('onBeforeEdit callback prop', () => {
      let objects = [1, 2, 3, 4].map(() => ({ 'p5': 8.2 }));

      let onBeforeEdit = jest.fn(() => {
        expect(objects.map(o => o['p5'])).toEqual([8.2, 8.2, 8.2, 8.2]);
      });

      act(() => render(
        <NumberPropertyInput
          objects={objects} propertyName='p5' onBeforeEdit={onBeforeEdit}
        />,
        container,
      ));

      container.firstChild.value = '3';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      // were edited
      expect(objects.map(o => o['p5'])).toEqual([3, 3, 3, 3]);

      expect(onBeforeEdit).toHaveBeenCalledTimes(1);
      expect(onBeforeEdit.mock.calls[0][0].newValue).toBe(3);
      expect(onBeforeEdit.mock.calls[0][0].oldValue).toBe(8.2);
    });

    test('when the input value is the same as the current value', () => {
      let objects = [1, 2, 3, 4].map(() => ({ 'prop': 8 }));
      let onEdit = jest.fn();

      act(() => render(
        <NumberPropertyInput
          objects={objects} propertyName='prop' onEdit={onEdit}
        />,
        container,
      ));

      container.firstChild.value = '   8    '; // extra whitespace
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      // are unchanged
      expect(objects.map(o => o['prop'])).toEqual([8, 8, 8, 8]);

      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe('8'); // was reset
    });

    test('when the input value is less than the minValue prop', () => {
      let objects = [1, 2, 3].map(() => ({ 'p1': 6 }));

      act(() => render(
        <NumberPropertyInput
          objects={objects} propertyName='p1' minValue={3}
        />,
        container,
      ));

      container.firstChild.value = '-1';
      Simulate.change(container.firstChild);
      Simulate.keyUp(container.firstChild, { key: 'Enter' });

      expect(objects.map(o => o['p1'])).toEqual([3, 3, 3]); // clamped
    });

    test('when the input value is greater than the maxValue prop', () => {
      let objects = [1, 2, 3, 4].map(() => ({ 'p2': 11 }));

      act(() => render(
        <NumberPropertyInput
          objects={objects} propertyName='p2' maxValue={50}
        />,
        container,
      ));

      container.firstChild.value = '200';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      // value was clamped
      expect(objects.map(o => o['p2'])).toEqual([50, 50, 50, 50]);
    });

    test('when the current value equals the minValue prop', () => {
      let objects = [1, 2, 3].map(() => ({ 'p': 5 }));
      let onEdit = jest.fn();

      act(() => render(
        <NumberPropertyInput
          objects={objects} propertyName='p' minValue={5} onEdit={onEdit}
        />,
        container,
      ));

      container.firstChild.value = '1';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      expect(objects.map(o => o['p'])).toEqual([5, 5, 5]); // unchanged
      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe('5'); // was reset
    });

    test('when the current value equals the maxValue prop', () => {
      let objects = [1, 2, 3].map(() => ({ 'p': 10 }));
      let onEdit = jest.fn();

      act(() => render(
        <NumberPropertyInput
          objects={objects} propertyName='p' maxValue={10} onEdit={onEdit}
        />,
        container,
      ));

      container.firstChild.value = '20';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      // are unchanged
      expect(objects.map(o => o['p'])).toEqual([10, 10, 10]);

      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe('10'); // was reset
    });

    test('when the input value has more places than the places prop', () => {
      let objects = [1, 2, 3, 4].map(() => ({ 'p1': 3 }));

      act(() => render(
        <NumberPropertyInput objects={objects} propertyName='p1' places={2} />,
        container,
      ));

      container.firstChild.value = '4.654321';
      Simulate.change(container.firstChild);
      Simulate.keyUp(container.firstChild, { key: 'Enter' });

      expect(objects.map(o => o['p1'])).toEqual(
        [4.654321, 4.654321, 4.654321, 4.654321] // not rounded
      );
    });

    test('blank inputs', () => {
      let objects = [1, 2, 3].map(() => ({ 'p': 3 }));
      let onEdit = jest.fn();

      act(() => render(
        <NumberPropertyInput
          objects={objects} propertyName='p' onEdit={onEdit}
        />,
        container,
      ));

      container.firstChild.value = '      ';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      expect(objects.map(o => o['p'])).toEqual([3, 3, 3]); // unchanged
      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe('3'); // was reset
    });

    test('non-numeric inputs', () => {
      let objects = [1, 2, 3].map(() => ({ 'p': 5 }));
      let onEdit = jest.fn();

      act(() => render(
        <NumberPropertyInput
          objects={objects} propertyName='p' onEdit={onEdit}
        />,
        container,
      ));

      container.firstChild.value = 'qwer';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      expect(objects.map(o => o['p'])).toEqual([5, 5, 5]); // unchanged
      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe('5'); // was reset
    });

    test('nonfinite inputs', () => {
      let objects = [1, 2, 3].map(() => ({ 'p': 2 }));
      let onEdit = jest.fn();

      act(() => render(
        <NumberPropertyInput
          objects={objects} propertyName='p' onEdit={onEdit}
        />,
        container,
      ));

      container.firstChild.value = 'Infinity';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      expect(objects.map(o => o['p'])).toEqual([2, 2, 2]); // unchanged
      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe('2'); // was reset
    });

    test('an empty objects array', () => {
      let onEdit = jest.fn();

      act(() => render(
        <NumberPropertyInput objects={[]} propertyName='p' onEdit={onEdit} />,
        container,
      ));

      container.firstChild.value = '2';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe(''); // was reset
    });

    test('missing objects array prop', () => {
      let onEdit = jest.fn();

      act(() => render(
        <NumberPropertyInput propertyName='p' onEdit={onEdit} />,
        container,
      ));

      container.firstChild.value = '3';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe(''); // was reset
    });

    test('missing propertyName prop', () => {
      let objects = [1, 2, 3].map(() => ({ 'p': 2 }));
      let onEdit = jest.fn();

      act(() => render(
        <NumberPropertyInput objects={objects} onEdit={onEdit} />,
        container,
      ));

      container.firstChild.value = '8';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe(''); // was reset
    });
  });

  test('style prop', () => {
    act(() => render(
      <NumberPropertyInput style={{ margin: '2px 10px 20px 17px' }} />,
      container,
    ));

    expect(container.firstChild.style.margin).toBe('2px 10px 20px 17px');
  });
});
