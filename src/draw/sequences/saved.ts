import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';
import { Sequence } from 'Draw/sequences/Sequence';
import { Base } from 'Draw/bases/Base';
import { findTextByUniqueId } from 'Draw/saved/svg';
import { addSavedCircleHighlighting, addSavedCircleOutline } from 'Draw/bases/annotate/circle/save';
import { addSavedNumbering } from 'Draw/bases/number/save';
import { values as baseValues } from 'Draw/bases/values';

export type SavedState = { [key: string]: unknown }

function assertIsSavedSequence(saved: SavedState): void | never {
  if (saved.className != 'Sequence') {
    throw new Error('Saved state is not for a sequence.');
  }
}

function assertIsSavedBase(saved: SavedState): void | never {
  if (saved.className != 'Base') {
    throw new Error('Saved state is not for a base.');
  }
}

function recreateBase(drawing: Drawing, saved: SavedState): Base | never {
  assertIsSavedBase(saved);
  let t = findTextByUniqueId(drawing.svg, saved.textId);
  let b = new Base(t);
  if (saved.highlighting) {
    addSavedCircleHighlighting(b, saved.highlighting as SavedState);
  }
  if (saved.outline) {
    addSavedCircleOutline(b, saved.outline as SavedState);
  }
  if (saved.numbering) {
    addSavedNumbering(b, saved.numbering as SavedState);
  }
  return b;
}

function updateRecommendedDefaults(saved: SavedState) {
  if (typeof saved.numberingAnchor == 'number') {
    Sequence.recommendedDefaults.numberingAnchor = saved.numberingAnchor;
  }
  if (typeof saved.numberingIncrement == 'number') {
    Sequence.recommendedDefaults.numberingIncrement = saved.numberingIncrement;
  }
}

export function appendSavedSequence(drawing: Drawing, saved: SavedState): Sequence | never {
  assertIsSavedSequence(saved);
  
  if (typeof saved.id != 'string') {
    throw new Error('Saved state is missing the ID of the sequence.');
  }
  let seq = new Sequence(saved.id);
  
  // set before adding the bases to the sequence since
  // these setters may update base numberings
  if (typeof saved.numberingOffset == 'number') {
    seq.numberingOffset = saved.numberingOffset;
  }
  if (typeof saved.numberingAnchor == 'number') {
    seq.numberingAnchor = saved.numberingAnchor;
  }
  if (typeof saved.numberingIncrement == 'number') {
    seq.numberingIncrement = saved.numberingIncrement;
  }
  
  if (!(saved.bases instanceof Array)) {
    throw new Error('Saved state is missing the bases of the sequence.');
  }
  saved.bases.forEach((s: SavedState) => {
    let b = recreateBase(drawing, s);
    seq.bases.push(b);
    Base.recommendedDefaults = baseValues(b);
  });
  
  drawing.sequences.push(seq);
  updateRecommendedDefaults(saved);
  return seq;
}