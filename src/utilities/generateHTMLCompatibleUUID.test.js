import { generateHTMLCompatibleUUID } from './generateHTMLCompatibleUUID';

const uuidRegExp = (
  /[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}/
);

test('generateHTMLCompatibleUUID function', () => {
  let id = generateHTMLCompatibleUUID();

  // first character must be a letter to be a valid HTML element ID
  expect(id.charAt(0)).toBe('i');

  // is a UUID
  expect(id).toMatch(uuidRegExp);
  expect(id.length).toBe(37);
});
