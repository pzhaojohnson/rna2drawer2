/**
 * Splits the data string by whitespace, commas and semicolons
 * and filters out any resulting empty strings.
 */
export function splitDataNonempty(data: string): string[] {
  // split by whitespace, commas and semicolons
  let values = data.split(/[\s|,|;]+/);

  // filter out empty strings
  values = values.filter(v => v.length > 0);

  return values;
}
