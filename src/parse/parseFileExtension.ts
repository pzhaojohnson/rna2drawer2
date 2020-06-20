function parseFileExtension(fileName: string): string {
  let ext = fileName.split('.').pop();
  if (ext) {
    return ext;
  } else {
    return '';
  }
}

export default parseFileExtension;
