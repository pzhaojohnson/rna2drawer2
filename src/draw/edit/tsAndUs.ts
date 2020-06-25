import { DrawingInterface as Drawing } from '../DrawingInterface';

export function hasTs(drawing: Drawing): boolean {
  let has = false;
  drawing.forEachBase(b => {
    if (b.character === 'T' || b.character === 't') {
      has = true;
    }
  });
  return has;
}

export function hasUs(drawing: Drawing): boolean {
  let has = false;
  drawing.forEachBase(b => {
    if (b.character === 'U' || b.character === 'u') {
      has = true;
    }
  });
  return has;
}

export function tsToUs(drawing: Drawing) {
  drawing.forEachBase(b => {
    if (b.character === 'T') {
      b.character = 'U';
    } else if (b.character === 't') {
      b.character = 'u';
    }
  });
}

export function usToTs(drawing: Drawing) {
  drawing.forEachBase(b => {
    if (b.character === 'U') {
      b.character = 'T';
    } else if (b.character === 'u') {
      b.character = 't';
    }
  });
}
