function splitLines(s: string): string[] {
  return s.split(/\r\n|\r|\n/);
}

export {
  splitLines,
};
