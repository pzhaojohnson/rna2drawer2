import { splitLines } from './splitLines';

it('line feed character', () => {
  let lines = splitLines('ab\ncd');
  expect(lines.length).toBe(2);
  expect(lines[0]).toBe('ab');
  expect(lines[1]).toBe('cd');
});

it('carriage return character', () => {
  let lines = splitLines('pl\rty ');
  expect(lines.length).toBe(2);
  expect(lines[0]).toBe('pl');
  expect(lines[1]).toBe('ty ');
});

it('carriage return immediately followed by line feed character', () => {
  let lines = splitLines('jh\r\nasdf');
  expect(lines.length).toBe(2);
  expect(lines[0]).toBe('jh');
  expect(lines[1]).toBe('asdf');
});

it('ignores other whitespace characters', () => {
  let lines = splitLines('a sd\tasdk');
  expect(lines.length).toBe(1);
  expect(lines[0]).toBe('a sd\tasdk');
});

it('at very beginning of string', () => {
  let lines = splitLines('\naer');
  expect(lines.length).toBe(2);
  expect(lines[0]).toBe('');
  expect(lines[1]).toBe('aer');
});

it('at very end of string', () => {
  let lines = splitLines('er\r\n');
  expect(lines.length).toBe(2);
  expect(lines[0]).toBe('er');
  expect(lines[1]).toBe('');
});

it('blank lines', () => {
  let lines = splitLines('ab\r\r\n\ncd');
  expect(lines.length).toBe(4);
  expect(lines[0]).toBe('ab');
  expect(lines[1]).toBe('');
  expect(lines[2]).toBe('');
  expect(lines[3]).toBe('cd');
});

it('a mixture', () => {
  let lines = splitLines('\rasd\n\r\n\r\rjio\rqw\nsa\n');
  expect(lines.length).toBe(9);
  expect(lines[0]).toBe('');
  expect(lines[1]).toBe('asd');
  expect(lines[2]).toBe('');
  expect(lines[3]).toBe('');
  expect(lines[4]).toBe('');
  expect(lines[5]).toBe('jio');
  expect(lines[6]).toBe('qw');
  expect(lines[7]).toBe('sa');
  expect(lines[8]).toBe('');
});
