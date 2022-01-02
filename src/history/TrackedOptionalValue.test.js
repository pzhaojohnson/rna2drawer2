import { TrackedOptionalValue } from './TrackedOptionalValue';

let options = null;

beforeEach(() => {
  options = {
    areEqual: (v1, v2) => v1 == v2,
    maxPreviousStackSize: 50,
  };
});

afterEach(() => {
  options = null;
});

describe('TrackedOptionalValue class', () => {
  it('stores the provided options', () => {
    let options = {
      areEqual: (v1, v2) => v1 == v2,
      maxPreviousStackSize: 50,
    };
    let value = new TrackedOptionalValue(options);
    expect(value.options).toBe(options);
  });

  test('maxPreviousStackSize option', () => {
    let options = {
      areEqual: (v1, v2) => v1 == v2,
      maxPreviousStackSize: 3,
    };
    let value = new TrackedOptionalValue(options);
    // assign 5 values
    [1, 2, 3, 4, 5].forEach(n => value.current = n);
    expect(value.current).toBe(5);
    // try going backward 4 times
    [1, 2, 3, 4].forEach(n => value.goBackward());
    expect(value.current).toBe(2); // did not remember 1
    // go forward 3 times
    [1, 2, 3].forEach(n => value.goForward());
    // next stack was able to hold as many values as previous stack
    expect(value.current).toBe(5);
    // can also directly inspect previous and next stacks
    expect(value._previousStack.maxLength).toBe(3);
    expect(value._nextStack.maxLength).toBe(3);
  });

  describe('current, previous and next getters', () => {
    test('when there are no tracked values', () => {
      let value = new TrackedOptionalValue(options);
      expect(value.current).toBeUndefined();
      expect(value.previous).toBeUndefined();
      expect(value.next).toBeUndefined();
    });

    test('when there is one tracked value', () => {
      let value = new TrackedOptionalValue(options);
      value.current = 'asdf';
      expect(value.current).toBe('asdf');
      expect(value.previous).toBeUndefined();
      expect(value.next).toBeUndefined();
      value.current = undefined;
      expect(value.current).toBeUndefined();
      expect(value.previous).toBe('asdf');
      expect(value.next).toBeUndefined();
      // not possible for the next value to be defined
      // and the current and previous values to be undefined
    });

    test('when there are multiple tracked values', () => {
      let value = new TrackedOptionalValue(options);
      value.current = 10;
      value.current = 15;
      value.current = 'Q';
      value.current = 'zxcv';
      value.current = 38;
      value.current = 'QWER';
      value.current = 'A';
      // previous stack has multiple values and next stack is empty
      expect(value.current).toBe('A');
      expect(value.previous).toBe('QWER');
      expect(value.next).toBeUndefined();
      value.goBackward();
      value.goBackward();
      value.goBackward();
      // previous and next stacks have multiple values
      expect(value.current).toBe('zxcv');
      expect(value.previous).toBe('Q');
      expect(value.next).toBe(38);
      value.goBackward();
      value.goBackward();
      value.goBackward();
      // previous stack is empty and next stack has multiple values
      expect(value.current).toBe(10);
      expect(value.previous).toBeUndefined();
      expect(value.next).toBe(15);
    });
  });

  describe('goBackward and canGoBackward methods', () => {
    test('when there are no previous values', () => {
      let value = new TrackedOptionalValue(options);
      value.current = 50;
      expect(value.canGoBackward()).toBeFalsy();
      expect(() => value.goBackward()).not.toThrow();
      // check that goBackward method did not change any values
      expect(value.current).toBe(50);
      expect(value.previous).toBeUndefined();
      expect(value.next).toBeUndefined();
    });

    test('when there are previous values', () => {
      let value = new TrackedOptionalValue(options);
      value.current = 33;
      value.current = 64;
      value.current = 'A';
      value.current = 'Q';
      expect(value.canGoBackward()).toBeTruthy();
      value.goBackward();
      expect(value.current).toBe('A');
      expect(value.previous).toBe(64);
      expect(value.next).toBe('Q');
    });
  });

  describe('goForward and canGoForward methods', () => {
    test('when there are no next values', () => {
      let value = new TrackedOptionalValue(options);
      value.current = 100;
      value.current = 'Asdf';
      expect(value.canGoForward()).toBeFalsy();
      expect(() => value.goForward()).not.toThrow();
      // check that goForward method did not change any values
      expect(value.current).toBe('Asdf');
      expect(value.previous).toBe(100);
      expect(value.next).toBeUndefined();
    });

    test('when there are next values', () => {
      let value = new TrackedOptionalValue(options);
      value.current = -10;
      value.current = -14;
      value.current = 'G';
      value.current = 'GGG';
      value.goBackward();
      value.goBackward();
      value.goBackward();
      expect(value.canGoForward()).toBeTruthy();
      value.goForward();
      expect(value.current).toBe(-14);
      expect(value.previous).toBe(-10);
      expect(value.next).toBe('G');
    });
  });

  describe('current setter', () => {
    it('uses the provided areEqual callback', () => {
      let options = {
        areEqual: (o1, o2) => o1?.value == o2?.value,
        maxPreviousStackSize: 60,
      };
      let value = new TrackedOptionalValue(options);
      let o1 = { value: 112 };
      let o2 = { value: 112 };
      expect(o1 == o2).toBeFalsy(); // cannot just use equality operator
      value.current = o1;
      value.current = o2;
      expect(value.current).toBe(o2); // still reassigned
      // but did not push previous stack
      expect(value.previous).toBeUndefined();
    });

    test('defined falsy values', () => {
      let options = {
        areEqual: (v1, v2) => v1 === v2,
        maxPreviousStackSize: 200,
      };
      let value = new TrackedOptionalValue(options);
      expect(value.current).toBeUndefined();
      expect(value.previous).toBeUndefined();
      value.current = null;
      expect(value.current).toBeNull();
      expect(value.previous).toBeUndefined();
      value.current = 0;
      expect(value.current).toBe(0);
      expect(value.previous).toBeNull();
      value.current = '';
      expect(value.current).toBe('');
      expect(value.previous).toBe(0);
      value.current = false;
      expect(value.current).toBe(false);
      expect(value.previous).toBe('');
    });

    describe('setting to undefined', () => {
      test('when the current value is defined', () => {
        let value = new TrackedOptionalValue(options);
        value.current = 'ASDF';
        value.current = 'QWER';
        value.goBackward();
        value.current = undefined;
        expect(value.current).toBeUndefined(); // undefined
        expect(value.previous).toBe('ASDF'); // pushed previous stack
        expect(value.next).toBe('QWER'); // maintained next stack
      });

      test('when the current value is undefined', () => {
        let value = new TrackedOptionalValue(options);
        value.current = 55;
        value.current = 99;
        value.goBackward();
        value.current = undefined;
        value.current = undefined; // try setting to undefined again
        expect(value.current).toBeUndefined();
        expect(value.previous).toBe(55); // maintained previous stack
        expect(value.next).toBe(99); // maintained next stack
      });
    });

    describe('setting to a defined value', () => {
      describe('when the current value is defined', () => {
        test('when the current value is a different value', () => {
          let value = new TrackedOptionalValue(options);
          value.current = 60;
          value.current = 88;
          value.goBackward();
          value.current = 77; // set to a different value
          expect(value.current).toBe(77); // was set
          expect(value.previous).toBe(60); // pushed previous stack
          expect(value.next).toBeUndefined(); // cleared next stack
        });

        test('when the current value is the same value', () => {
          let options = {
            areEqual: (o1, o2) => o1.value == o2.value,
            maxPreviousStackSize: 25,
          };
          let value = new TrackedOptionalValue(options);
          let o1 = { value: 1000 };
          let o2 = { value: 2000 };
          let o3 = { value: 1000 };
          value.current = o1;
          value.current = o2;
          value.goBackward();
          value.current = o3; // different object but same value
          expect(value.current).toBe(o3); // still reassigned
          expect(value.previous).toBeUndefined(); // but did not push previous stack
          expect(value.next).toBe(o2); // and maintained next stack
        });
      });

      describe('when the current value is undefined', () => {
        test('when there are no previous values', () => {
          let value = new TrackedOptionalValue(options);
          value.current = 90;
          expect(value.current).toBe(90);
          expect(value.previous).toBeUndefined();
          expect(value.next).toBeUndefined();
        });

        test('when the previous value is a different value', () => {
          let value = new TrackedOptionalValue(options);
          value.current = 1012;
          value.current = 1088;
          value.goBackward();
          value.current = undefined; // makes 1012 the previous value
          value.current = 3000;
          expect(value.current).toBe(3000); // was set
          expect(value.previous).toBe(1012); // maintained previous stack
          expect(value.next).toBeUndefined(); // cleared next stack
        });

        test('when the previous value is the same value', () => {
          let options = {
            areEqual: (o1, o2) => o1.value == o2.value,
            maxPreviousStackSize: 100,
          };
          let value = new TrackedOptionalValue(options);
          let o1 = { value: 'Q' };
          let o2 = { value: 'W' };
          let o3 = { value: 'Q' };
          value.current = o1;
          value.current = o2;
          value.goBackward();
          value.current = undefined; // makes o1 the previous value
          value.current = o3;
          expect(value.current).toBe(o3); // assigned to o3
          expect(value.previous).toBeUndefined(); // popped o1
          expect(value.next).toBe(o2); // maintained next stack
        });
      });
    });
  });
});
