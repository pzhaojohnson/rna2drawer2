import { generateHTMLCompatibleUUID } from './generateHTMLCompatibleUUID';

const uuidRegExp = (
  /[A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12}/
);

test('generateHTMLCompatibleUUID function', () => {
  let id = generateHTMLCompatibleUUID();

  // first character must be a letter
  expect(id.charAt(0)).toMatch(/[A-Za-z]/);

  expect(id).toMatch(uuidRegExp);
});
