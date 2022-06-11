import * as React from 'react';
import { DottedNote } from 'Forms/notes/DottedNote';

function ExplanatoryNote() {
  return (
    <DottedNote>
      The subsequence will be inserted beginning at the position to insert at.
    </DottedNote>
  );
}

function BaseNumberingNote() {
  return (
    <DottedNote style={{ marginTop: '8px' }} >
      Base numbering must be updated manually after inserting a subsequence.
    </DottedNote>
  );
}

export function TrailingNotes() {
  return (
    <div style={{ marginTop: '18px' }} >
      <ExplanatoryNote />
      <BaseNumberingNote />
    </div>
  );
}
