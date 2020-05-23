import FiniteStack from './FiniteStack';

it('push and pop', () => {
  let fs = new FiniteStack();
  fs.push('zxcv');
  expect(fs.pop()).toBe('zxcv');
  fs.push(1);
  fs.push(2);
  fs.push(3);
  expect(fs.pop()).toBe(3);
  expect(fs.pop()).toBe(2);
  expect(fs.pop()).toBe(1);
});

it('size getter', () => {
  let fs = new FiniteStack();
  expect(fs.size).toBe(0);
  fs.push('asdf');
  fs.push('qwer');
  expect(fs.size).toBe(2);
  fs.pop();
  expect(fs.size).toBe(1);
});

it('isEmpty method', () => {
  let fs = new FiniteStack();
  expect(fs.isEmpty()).toBeTruthy();
  
  fs.push('asdf');
  expect(fs.isEmpty()).toBeFalsy();
  expect(fs.pop()).toBe('asdf');
  expect(fs.isEmpty()).toBeTruthy();
  
  fs.push('asdf');
  fs.push(2);
  expect(fs.isEmpty()).toBeFalsy();
  expect(fs.pop()).toBe(2);
  expect(fs.isEmpty()).toBeFalsy();
  expect(fs.pop()).toBe('asdf');
  expect(fs.isEmpty()).toBeTruthy();
});

it('popping an empty finite stack', () => {
  let fs = new FiniteStack();
  expect(fs.pop()).toBeFalsy();
  fs.push('asdf');
  fs.push('qwer');
  expect(fs.pop()).toBe('qwer');
  expect(fs.pop()).toBe('asdf');
  expect(fs.pop()).toBeFalsy();

  // popping an empty finite stack multiple times in a row
  expect(fs.pop()).toBeFalsy();
});

describe('peek method', () => {
  it('handles an empty stack', () => {
    let fs = new FiniteStack();
    expect(fs.isEmpty()).toBeTruthy();
    expect(fs.peek()).toBeFalsy();
  });

  it('returns top element without popping', () => {
    let fs = new FiniteStack();
    fs.push('asdf');
    fs.push('qwer');
    expect(fs.size).toBe(2);
    expect(fs.peek()).toBe('qwer');
    expect(fs.size).toBe(2);
  });
});

describe('clear method', () => {
  it('handles empty stack', () => {
    let fs = new FiniteStack();
    expect(fs.isEmpty()).toBeTruthy();
    expect(() => fs.clear()).not.toThrow();
    expect(fs.isEmpty()).toBeTruthy();
  });

  it('clears a nonempty stack', () => {
    let fs = new FiniteStack();
    fs.push('asdf');
    fs.push('zxcv');
    expect(fs.isEmpty()).toBeFalsy();
    fs.clear();
    expect(fs.isEmpty()).toBeTruthy();
  });
});

it('size limit', () => {
  let fs = new FiniteStack();
  
  expect(typeof(fs.sizeLimit)).toBe('number');

  // is an integer
  expect(Math.floor(fs.sizeLimit)).toBe(fs.sizeLimit);

  // is greater than zero
  expect(fs.sizeLimit).toBeGreaterThan(0);
});

it('exceeding the size limit by one element', () => {
  let fs = new FiniteStack();

  // the size limit has yet to be exceeded
  expect(fs.sizeLimitWasExceeded()).toBeFalsy();

  for (let i = 0; i <= fs.sizeLimit; i++) {
    fs.push(i);
  }

  // the size limit has been exceeded by one element
  expect(fs.sizeLimitWasExceeded()).toBeTruthy();

  // remembers that the size limit was exceeded in the past
  for (let i = fs.sizeLimit; i > 0; i--) {
    expect(fs.pop()).toBe(i);
    expect(fs.sizeLimitWasExceeded()).toBeTruthy();
  }

  // the bottom 0 was removed when the size limit was exceeded
  expect(fs.isEmpty()).toBeTruthy();
});

it('exceeding the size limit by more than one element', () => {});
