import * as React from 'react';

import { render } from 'react-dom';
import { unmountComponentAtNode } from 'react-dom';

import { act } from 'react-dom/test-utils';
import { Simulate } from 'react-dom/test-utils';

import { DirectionAnglePropertyInput } from './DirectionAnglePropertyInput';

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

describe('DirectionAnglePropertyInput component', () => {
  test('id prop', () => {
    let props = { id: 'aa55gsfrctqyg' };
    act(() => render(<DirectionAnglePropertyInput {...props} />, container));
    expect(container.firstChild.id).toBe('aa55gsfrctqyg');
  });

  describe('the initially displayed value', () => {
    test('when all objects have the same normalized value', () => {
      let objects = [1, 2, 3, 4, 5].map(() => ({}));
      let propertyName = 'p';
      objects.forEach(o => o[propertyName] = Math.PI);
      objects[1][propertyName] += 2 * Math.PI;
      objects[3][propertyName] -= 4 * Math.PI;
      let props = { objects, propertyName };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));
      expect(container.firstChild.value).toBe('180\xB0');
    });

    test('when not all objects have the same normalized value', () => {
      let objects = [1, 2, 3, 4, 5].map(() => ({}));
      let propertyName = 'p';
      objects.forEach(o => o[propertyName] = Math.PI);
      objects[1][propertyName] += Math.PI / 2;
      let props = { objects, propertyName };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));
      expect(container.firstChild.value).toBe('');
    });

    test('angleFloor prop', () => {
      let objects = [1, 2, 3, 4, 5].map(() => ({}));
      let propertyName = 'p';
      objects.forEach(o => o[propertyName] = Math.PI / 2);
      let angleFloor = -12 * Math.PI;
      let props = { objects, propertyName, angleFloor };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));
      expect(container.firstChild.value).toBe('-2070\xB0');
    });

    test('default angleFloor prop value', () => {
      let objects = [1, 2, 3, 4, 5].map(() => ({}));
      let propertyName = 'p';
      objects.forEach(o => o[propertyName] = -11 * Math.PI / 2);
      let props = { objects, propertyName };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));

      // angleFloor prop should be zero by default
      expect(container.firstChild.value).toBe('90\xB0');
    });

    test('when all objects have the same rounded value', () => {
      let objects = [1, 2, 3, 4, 5, 6].map(() => ({}));
      let propertyName = 'p3';
      objects.forEach(o => o[propertyName] = 2 * Math.PI / 3);
      objects[1][propertyName] += (8 * Math.PI) + 0.0001;
      objects[2][propertyName] -= (4 * Math.PI) + 0.0002;
      let places = 3;
      let props = { objects, propertyName, places };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));
      expect(container.firstChild.value).toBe('120\xB0');
    });

    test('when not all objects have the same rounded value', () => {
      let objects = [1, 2, 3, 4, 5, 6].map(() => ({}));
      let propertyName = 'p3';
      objects.forEach(o => o[propertyName] = 2 * Math.PI / 3);
      objects[1][propertyName] += (8 * Math.PI) + 0.0002;
      let places = 3;
      let props = { objects, propertyName, places };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));
      expect(container.firstChild.value).toBe('');
    });

    test('default places prop value', () => {
      let objects = [1, 2, 3, 4, 5, 6].map(() => ({}));
      let propertyName = 'prop2';
      objects.forEach(o => o[propertyName] = (Math.PI / 3));

      // places prop should be two by default
      objects[1][propertyName] += (2 * Math.PI) + 0.003;
      objects[2][propertyName] -= (4 * Math.PI) + 0.002;

      let props = { objects, propertyName };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));
      expect(container.firstChild.value).toBe('60\xB0');
    });

    test('displayedPlaces prop', () => {
      let objects = [1, 2, 3, 4].map(() => ({}));
      let propertyName = 'prop2';
      objects.forEach(o => o[propertyName] = (Math.PI / 2) + 0.02451);
      let displayedPlaces = 6;
      let props = { objects, propertyName, displayedPlaces };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));
      expect(container.firstChild.value).toBe('91.673247\xB0');
    });

    test('default displayedPlaces prop value', () => {
      let objects = [1, 2, 3, 4].map(() => ({}));
      let propertyName = 'prop2';
      objects.forEach(o => o[propertyName] = (Math.PI / 2) + 0.02451);
      let props = { objects, propertyName };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));

      // displayedPlaces prop should be zero by default
      expect(container.firstChild.value).toBe('92\xB0');
    });

    test('when not all property values are numeric', () => {
      let objects = [1, 2, 3, 4, 5, 6, 7].map(() => ({}));
      let propertyName = 'p';
      objects.forEach(o => o[propertyName] = Math.PI / 2);
      objects[1][propertyName] = 'asdf';
      objects[3][propertyName] = null;
      objects[4][propertyName] = undefined;
      let props = { objects, propertyName };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));
      expect(container.firstChild.value).toBe('');
    });

    test('an empty objects array', () => {
      let objects = [];
      let propertyName = 'prop1';
      let props = { objects, propertyName };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));
      expect(container.firstChild.value).toBe('');
    });

    test('an objects array containing one object', () => {
      let objects = [{}];
      let propertyName = 'p2';
      objects[0][propertyName] = Math.PI / 2;
      let props = { objects, propertyName };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));
      expect(container.firstChild.value).toBe('90\xB0');
    });

    test('missing objects array prop', () => {
      let propertyName = 'prop';
      let props = { propertyName };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));
      expect(container.firstChild.value).toBe('');
    });

    test('missing propertyName prop', () => {
      let objects = [1, 2, 3, 4].map(() => ({}));
      objects.forEach(o => o['p1'] = Math.PI / 3);
      let props = { objects };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));
      expect(container.firstChild.value).toBe('');
    });
  });

  describe('editing objects', () => {
    test('on blur', () => {
      let objects = [1, 2, 3, 4].map(() => ({}));
      let propertyName = 'p2';
      objects.forEach(o => o[propertyName] = Math.PI / 3);
      let props = { objects, propertyName };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));

      container.firstChild.value = '45';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      objects.forEach(o => {
        expect(o[propertyName]).toBeCloseTo(Math.PI / 4);
      });
    });

    test('on Enter key press', () => {
      let objects = [1, 2, 3, 4, 5].map(() => ({}));
      let propertyName = 'prop';
      objects.forEach(o => o[propertyName] = Math.PI / 3);
      let props = { objects, propertyName };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));

      container.firstChild.value = '-45';
      Simulate.change(container.firstChild);
      Simulate.keyUp(container.firstChild, { key: 'Enter' });

      objects.forEach(o => {
        expect(o[propertyName]).toBeCloseTo(7 * Math.PI / 4);
      });
    });

    test('onEdit callback prop', () => {
      let objects = [1, 2, 3, 4, 5].map(() => ({}));
      let propertyName = 'prop';
      objects.forEach(o => o[propertyName] = Math.PI / 6);

      let onEdit = jest.fn(() => objects.forEach(o => {
        // expect to have been edited
        expect(o[propertyName]).toBeCloseTo(5 * Math.PI / 6);
      }));

      let props = { objects, propertyName, onEdit };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));

      container.firstChild.value = '150';
      Simulate.change(container.firstChild);
      Simulate.keyUp(container.firstChild, { key: 'Enter' });

      expect(onEdit).toHaveBeenCalledTimes(1);
      expect(onEdit.mock.calls[0][0].newValue).toBeCloseTo(5 * Math.PI / 6);
      expect(onEdit.mock.calls[0][0].oldValue).toBeCloseTo(Math.PI / 6);
    });

    test('onBeforeEdit callback prop', () => {
      let objects = [1, 2, 3, 4, 5].map(() => ({}));
      let propertyName = 'prop';
      objects.forEach(o => o[propertyName] = Math.PI / 6);

      let onBeforeEdit = jest.fn(() => objects.forEach(o => {
        // expect to have not been edited
        expect(o[propertyName]).toBeCloseTo(Math.PI / 6);
      }));

      let props = { objects, propertyName, onBeforeEdit };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));

      container.firstChild.value = '150';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      expect(onBeforeEdit).toHaveBeenCalledTimes(1);
      let call1 = onBeforeEdit.mock.calls[0];
      expect(call1[0].newValue).toBeCloseTo(5 * Math.PI / 6);
      expect(call1[0].oldValue).toBeCloseTo(Math.PI / 6);
    });

    test('when a degree character is included in the input value', () => {
      let objects = [1, 2, 3, 4].map(() => ({}));
      let propertyName = 'p2';
      objects.forEach(o => o[propertyName] = 2 * Math.PI / 3);
      let props = { objects, propertyName };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));

      container.firstChild.value = '135\xB0'; // should be same as "135"
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      objects.forEach(o => {
        expect(o[propertyName]).toBeCloseTo(3 * Math.PI / 4);
      });
    });

    test('when the input value normalizes to current values', () => {
      let objects = [1, 2, 3, 4, 5, 6].map(() => ({}));
      let propertyName = 'p1';
      objects.forEach(o => o[propertyName] = Math.PI / 2);
      objects[1][propertyName] += 4 * Math.PI;
      objects[2][propertyName] -= 12 * Math.PI;
      let onEdit = jest.fn();
      let props = { objects, propertyName, onEdit };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));

      container.firstChild.value = '-270'; // normalizes to Math.PI / 2
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe('90\xB0'); // was reset
    });

    test('blank inputs', () => {
      let objects = [1, 2, 3].map(() => ({}));
      let propertyName = 'p';
      objects.forEach(o => o[propertyName] = Math.PI / 3);
      let onEdit = jest.fn();
      let props = { objects, propertyName, onEdit };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));

      container.firstChild.value = '     ';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe('60\xB0'); // was reset
    });

    test('non-numeric inputs', () => {
      let objects = [1, 2, 3].map(() => ({}));
      let propertyName = 'prop2';
      objects.forEach(o => o[propertyName] = Math.PI / 2);
      let onEdit = jest.fn();
      let props = { objects, propertyName, onEdit };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));

      container.firstChild.value = 'asdf';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe('90\xB0'); // was reset
    });

    test('nonfinite inputs', () => {
      let objects = [1, 2, 3].map(() => ({}));
      let propertyName = 'prop1';
      objects.forEach(o => o[propertyName] = Math.PI);
      let onEdit = jest.fn();
      let props = { objects, propertyName, onEdit };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));

      container.firstChild.value = 'Infinity'; // might loop infinitely
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe('180\xB0'); // was reset
    });

    test('an empty objects array', () => {
      let objects = [];
      let propertyName = 'p';
      let onEdit = jest.fn();
      let props = { objects, propertyName, onEdit };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));

      container.firstChild.value = '80';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe(''); // was reset
    });

    test('an objects array containing one object', () => {
      let objects = [{}];
      let propertyName = 'prop';
      objects[0][propertyName] = 80;
      let props = { objects, propertyName };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));

      container.firstChild.value = '270';
      Simulate.change(container.firstChild);
      Simulate.keyUp(container.firstChild, { key: 'Enter' });

      expect(objects[0][propertyName]).toBeCloseTo(3 * Math.PI / 2);
    });

    test('missing objects array prop', () => {
      let propertyName = 'p';
      let onEdit = jest.fn();
      let props = { propertyName, onEdit };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));

      container.firstChild.value = '50';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe(''); // was reset
    });

    test('missing propertyName prop', () => {
      let objects = [1, 2, 3, 4, 5].map(() => ({ 'p': Math.PI }));
      let onEdit = jest.fn();
      let props = { objects, onEdit };
      act(() => render(<DirectionAnglePropertyInput {...props} />, container));

      container.firstChild.value = '35';
      Simulate.change(container.firstChild);
      Simulate.blur(container.firstChild);

      expect(onEdit).not.toHaveBeenCalled();
      expect(container.firstChild.value).toBe(''); // was reset
    });
  });

  test('style prop', () => {
    let props = { style: { margin: '88px 2px 23px 54px' } };
    act(() => render(<DirectionAnglePropertyInput {...props} />, container));
    expect(container.firstChild.style.margin).toBe('88px 2px 23px 54px');
  });
});
