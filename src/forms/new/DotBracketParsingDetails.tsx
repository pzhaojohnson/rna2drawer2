import * as React from 'react';

export function DotBracketParsingDetails(): React.ReactElement {
  return (
    <div style={{ width: '360px', margin: '16px 0px 0px 12px' }} >
      <p className={'unselectable-text'} style={{ fontWeight: 600, fontSize: '14px', color: 'rgba(0,0,0,1)' }} >
        Structure Parsing Details
      </p>
      <div style={{ marginLeft: '8px' }} >
        <p className={'unselectable-text'} style={{ marginTop: '6px', fontSize: '12px' }} >
          Periods "." indicate unpaired bases.
        </p>
        <p className={'unselectable-text'} style={{ marginTop: '8px', fontSize: '12px' }} >
          Matching parentheses "( )" indicate base pairs in the secondary structure.
        </p>
        <p className={'unselectable-text'} style={{ marginTop: '8px', fontSize: '12px' }} >
          {'Pseudoknotted base pairs are specified by "[ ]", "{ }", or "< >".'}
        </p>
        <p className={'unselectable-text'} style={{ marginTop: '8px', fontSize: '12px' }} >
          All other characters and whitespace are ignored.
        </p>
      </div>
    </div>
  );
}
