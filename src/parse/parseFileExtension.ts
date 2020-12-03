function parseFileExtension(fileName: string): string {
  if (fileName.includes('.')) {
    let ext = fileName.split('.').pop();
    return ext ?? '';
  } else {
    return '';
  }
}

export function removeFileExtension(fileName: string): string {
  let ext = parseFileExtension(fileName);
  let nm = fileName.substring(0, fileName.length - ext.length);
  if (nm.length > 0 && nm.charAt(nm.length - 1) == '.') {
    nm = nm.substring(0, nm.length - 1);
  }
  return nm;
}

export default parseFileExtension;
