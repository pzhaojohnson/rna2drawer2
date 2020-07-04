export function capitalizeFirstLetter(s: string): string {
  if (s.length == 0) {
    return '';
  } else {
    return s.charAt(0).toUpperCase() + s.substring(1);
  }
}

export default capitalizeFirstLetter;
