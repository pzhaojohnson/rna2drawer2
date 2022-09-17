import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a UUID that would be a valid ID for an HTML element (i.e.,
 * starts with a letter and is composed of only letters, numbers and
 * dashes).
 */
export function generateHTMLSafeUUID(): string {
  return 'i' + uuidv4();
}
