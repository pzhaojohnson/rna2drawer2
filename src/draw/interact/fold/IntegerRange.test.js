import IntegerRange from './IntegerRange';

it('start and end getters', () => {
  let ir = new IntegerRange(12, 99);
  expect(ir.start).toBe(12);
  expect(ir.end).toBe(99);
});

describe('contains method', () => {
  let ir = new IntegerRange(-6, 33);

  it('for integer', () => {
    expect(ir.contains(-7)).toBeFalsy(); // just outside
    expect(ir.contains(-6)).toBeTruthy(); // just inside
    expect(ir.contains(33)).toBeTruthy(); // just outside
    expect(ir.contains(34)).toBeFalsy(); // just inside
  });

  it('for range', () => {
    expect(ir.contains(new IntegerRange(-6, 33))).toBeTruthy(); // just inside
    expect(ir.contains(new IntegerRange(-7, 10))).toBeFalsy(); // just outside
    expect(ir.contains(new IntegerRange(20, 34))).toBeFalsy(); // just outside
  });
});

it('overlapsWith method', () => {
  let ir = new IntegerRange(22, 87);
  expect(ir.overlapsWith(new IntegerRange(11, 21))).toBeFalsy(); // just outside
  expect(ir.overlapsWith(new IntegerRange(10, 22))).toBeTruthy();
  expect(ir.overlapsWith(new IntegerRange(87, 112))).toBeTruthy();
  expect(ir.overlapsWith(new IntegerRange(88, 120))).toBeFalsy(); // just outside
});

it('startsBefore method', () => {
  let ir = new IntegerRange(16, 59);
  expect(ir.startsBefore(new IntegerRange(16, 40))).toBeFalsy();
  expect(ir.startsBefore(new IntegerRange(17, 42))).toBeTruthy();
});

it('endsBefore method', () => {
  let ir = new IntegerRange(-20, 21);
  expect(ir.endsBefore(new IntegerRange(21, 33))).toBeFalsy();
  expect(ir.endsBefore(new IntegerRange(22, 29))).toBeTruthy();
});

it('startsAfter method', () => {
  let ir = new IntegerRange(12, 18);
  expect(ir.startsAfter(new IntegerRange(6, 11))).toBeTruthy();
  expect(ir.startsAfter(new IntegerRange(2, 12))).toBeFalsy();
});

it('endsAfter method', () => {
  let ir = new IntegerRange(18, 39);
  expect(ir.endsAfter(new IntegerRange(27, 38))).toBeTruthy();
  expect(ir.endsAfter(new IntegerRange(30, 39))).toBeFalsy();
});

describe('fromStartToEnd method', () => {
  it('for range of size greater than one', () => {
    let ir = new IntegerRange(5, 10);
    let result = '';
    ir.fromStartToEnd(i => result += i);
    expect(result).toBe('5678910');
  });

  it('for range of size one', () => {
    let ir = new IntegerRange(12, 12);
    let result = '';
    ir.fromStartToEnd(i => result += i);
    expect(result).toBe('12');
  });

  it('does not loop infinitely if start is greater than end', () => {
    let ir = new IntegerRange(16, 8);
    ir.fromStartToEnd(() => {});
  });
});

describe('fromEndToStart method', () => {
  it('for range of size greater than one', () => {
    let ir = new IntegerRange(12, 16);
    let result = '';
    ir.fromEndToStart(i => result += i);
    expect(result).toBe('1615141312');
  });

  it('for range of size one', () => {
    let ir = new IntegerRange(21, 21);
    let result = '';
    ir.fromEndToStart(i => result += i);
    expect(result).toBe('21');
  });

  it('does not loop infinitely if start is greater than end', () => {
    let ir = new IntegerRange(20, 10);
    ir.fromEndToStart(() => {});
  });
});
