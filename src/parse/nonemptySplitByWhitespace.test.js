import { nonemptySplitByWhitespace } from './nonemptySplitByWhitespace';

it('a space character', () => {
  let splits = nonemptySplitByWhitespace('ab cd');
  expect(splits.length).toBe(2);
  expect(splits[0]).toBe('ab');
  expect(splits[1]).toBe('cd');
});

it('a tab character', () => {
  let splits = nonemptySplitByWhitespace('jk\tpoo');
  expect(splits.length).toBe(2);
  expect(splits[0]).toBe('jk');
  expect(splits[1]).toBe('poo');
});

it('a newline character', () => {
  let splits = nonemptySplitByWhitespace('ll\nasd');
  expect(splits.length).toBe(2);
  expect(splits[0]).toBe('ll');
  expect(splits[1]).toBe('asd');
});

it('a carriage return character', () => {
  let splits = nonemptySplitByWhitespace('qwer\ras');
  expect(splits.length).toBe(2);
  expect(splits[0]).toBe('qwer');
  expect(splits[1]).toBe('as');
});

it('a carriage return immediately followed by a newline character', () => {
  let splits = nonemptySplitByWhitespace('a\r\nddd');
  expect(splits.length).toBe(2);
  expect(splits[0]).toBe('a');
  expect(splits[1]).toBe('ddd');
});

it('filters out empty substrings at beginning and end', () => {
  let splits = nonemptySplitByWhitespace(' eerr\tasd\n');
  expect(splits.length).toBe(2);
  expect(splits[0]).toBe('eerr');
  expect(splits[1]).toBe('asd');
});

it('filters out empty substrings between whitespace characters', () => {
  let splits = nonemptySplitByWhitespace('as  wef\t\n\r\n\r ee\t\r\nqewe');
  expect(splits.length).toBe(4);
  expect(splits[0]).toBe('as');
  expect(splits[1]).toBe('wef');
  expect(splits[2]).toBe('ee');
  expect(splits[3]).toBe('qewe');
});

it('multiple whitespace characters', () => {
  let splits = nonemptySplitByWhitespace('\nas  ere\t\t\nasd\r  asd  e\tas ');
  expect(splits.length).toBe(6);
  expect(splits[0]).toBe('as');
  expect(splits[1]).toBe('ere');
  expect(splits[2]).toBe('asd');
  expect(splits[3]).toBe('asd');
  expect(splits[4]).toBe('e');
  expect(splits[5]).toBe('as');
});
