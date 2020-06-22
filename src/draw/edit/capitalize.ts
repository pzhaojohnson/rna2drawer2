import { DrawingInterface as Drawing } from '../DrawingInterface';

export function hasCapitalBaseLetters(drawing: Drawing): boolean {
  let hasCapitals = false;
  drawing.forEachBase(b => {
    if (b.character.toUpperCase() === b.character) {
      hasCapitals = true;
    }
  });
  return hasCapitals;
}

export function capitalizeBaseLetters(drawing: Drawing) {
  drawing.forEachBase(b => {
    b.character = b.character.toUpperCase();
  });
}

export function decapitalizeBaseletters(drawing: Drawing) {
  drawing.forEachBase(b => {
    b.character = b.character.toLowerCase();
  });
}
