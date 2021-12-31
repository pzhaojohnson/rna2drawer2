import { TrackedOptionalValue } from './TrackedOptionalValue';

let areEqual = null;

beforeEach(() => {
  areEqual = (v1, v2) => v1 == v2;
});

afterEach(() => {
  areEqual = null;
});

describe('TrackedOptionalValue class', () => {
  it('stores the provided options', () => {
    let options = {
      areEqual: (v1, v2) => v1 == v2,
    };
    let value = new TrackedOptionalValue(options);
    expect(value.options).toBe(options);
  });

  describe('current, previous and next getters', () => {
    test('when there are no tracked values', () => {
      let value = new TrackedOptionalValue({ areEqual });
      expect(value.current).toBeUndefined();
      expect(value.previous).toBeUndefined();
      expect(value.next).toBeUndefined();
    });

    test('when there is one tracked value', () => {
      let value = new TrackedOptionalValue({ areEqual });
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
      let value = new TrackedOptionalValue({ areEqual });
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
      let value = new TrackedOptionalValue({ areEqual });
      value.current = 50;
      expect(value.canGoBackward()).toBeFalsy();
      expect(() => value.goBackward()).not.toThrow();
      // check that goBackward method did not change any values
      expect(value.current).toBe(50);
      expect(value.previous).toBeUndefined();
      expect(value.next).toBeUndefined();
    });

    test('when there are previous values', () => {
      let value = new TrackedOptionalValue({ areEqual });
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
      let value = new TrackedOptionalValue({ areEqual });
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
      let value = new TrackedOptionalValue({ areEqual });
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
      let areEqual = (o1, o2) => o1?.value == o2?.value;
      let value = new TrackedOptionalValue({ areEqual });
      let o1 = { value: 112 };
      let o2 = { value: 112 };
      expect(o1 == o2).toBeFalsy(); // cannot just use equality operator
      value.current = o1;
      value.current = o2;
      expect(value.current).toBe(o1); // did not reassign
      // did not push o1 to previous stack
      expect(value.previous).toBeUndefined();
    });

    test('defined falsy values', () => {
      let areEqual = (v1, v2) => v1 === v2;
      let value = new TrackedOptionalValue({ areEqual });
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
        let value = new TrackedOptionalValue({ areEqual });
        value.current = 'ASDF';
        value.current = 'QWER';
        value.goBackward();
        value.current = undefined;
        expect(value.current).toBeUndefined(); // undefined
        expect(value.previous).toBe('ASDF'); // pushed previous stack
        expect(value.next).toBe('QWER'); // maintained next stack
      });

      test('when the current value is undefined', () => {
        let value = new TrackedOptionalValue({ areEqual });
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
          let value = new TrackedOptionalValue({ areEqual });
          value.current = 60;
          value.current = 88;
          value.goBackward();
          value.current = 77; // set to a different value
          expect(value.current).toBe(77); // was set
          expect(value.previous).toBe(60); // pushed previous stack
          expect(value.next).toBeUndefined(); // cleared next stack
        });

        test('when the current value is the same value', () => {
          let value = new TrackedOptionalValue({ areEqual });
          value.current = 1000;
          value.current = 2000;
          value.goBackward();
          value.current = 1000; // try setting to same value
          expect(value.current).toBe(1000); // maintained current value
          expect(value.previous).toBeUndefined(); // did not push previous stack
          expect(value.next).toBe(2000); // maintained next stack
        });
      });

      describe('when the current value is undefined', () => {
        test('when there are no previous values', () => {
          let value = new TrackedOptionalValue({ areEqual });
          value.current = 90;
          expect(value.current).toBe(90);
          expect(value.previous).toBeUndefined();
          expect(value.next).toBeUndefined();
        });

        test('when the previous value is a different value', () => {
          let value = new TrackedOptionalValue({ areEqual });
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
          let value = new TrackedOptionalValue({ areEqual });
          value.current = 'Q';
          value.current = 'W';
          value.goBackward();
          value.current = undefined; // makes Q the previous value
          value.current = 'Q';
          expect(value.current).toBe('Q');
          expect(value.previous).toBeUndefined(); // popped previous stack
          expect(value.next).toBe('W'); // maintained next stack
        });
      });
    });
  });
});
