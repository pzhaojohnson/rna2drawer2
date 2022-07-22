import { ScrollInterface } from './ScrollInterface';

// seems difficult to test with an actual element on Node.js
let mockElement = null;

let scroll = null;

beforeEach(() => {
  mockElement = {
    scrollLeft: 78,
    scrollTop: 812,
    scrollWidth: 3300,
    scrollHeight: 5024,
  };

  scroll = new ScrollInterface(mockElement);
});

afterEach(() => {
  scroll = null;
  mockElement = null;
});

describe('ScrollInterface class', () => {
  test('left getter and setter', () => {
    scroll.left = 782; // use setter
    expect(scroll.left).toBe(782); // use getter
    expect(mockElement.scrollLeft).toBe(782); // check actual value
  });

  test('top getter and setter', () => {
    scroll.top = 239; // use setter
    expect(scroll.top).toBe(239); // use getter
    expect(mockElement.scrollTop).toBe(239); // check actual value
  });

  test('width getter', () => {
    mockElement.scrollWidth = 3057;
    expect(scroll.width).toBe(3057);
  });

  test('height getter', () => {
    mockElement.scrollHeight = 2889;
    expect(scroll.height).toBe(2889);
  });
});
