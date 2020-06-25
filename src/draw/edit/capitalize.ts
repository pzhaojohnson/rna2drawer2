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

export function onlyHasCapitalBaseLetters(drawing: Drawing): boolean {
  let allCapitals = true;
  drawing.forEachBase(b => {
    if (b.character.toUpperCase() !== b.character) {
      allCapitals = false;
    }
  });
  return allCapitals;
}

export function capitalizeBaseLetters(drawing: Drawing) {
  drawing.forEachBase(b => {
    b.character = b.character.toUpperCase();
  });
}

export function decapitalizeBaseLetters(drawing: Drawing) {
  drawing.forEachBase(b => {
    b.character = b.character.toLowerCase();
  });
}
