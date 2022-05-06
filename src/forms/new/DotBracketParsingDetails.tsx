import * as React from 'react';
import styles from './ParsingDetails.css';

export function DotBracketParsingDetails(): React.ReactElement {
  return (
    <div className={styles.parsingDetails} style={{ width: '360px', margin: '24px 0px 0px 12px' }} >
      <h3 className={styles.header} >
        Structure Parsing Details
      </h3>
      <div style={{ marginLeft: '8px' }} >
        <p style={{ marginTop: '6px' }} >
          Periods "." indicate unpaired bases.
        </p>
        <p style={{ marginTop: '8px' }} >
          Matching parentheses "( )" indicate base pairs in the secondary structure.
        </p>
        <p style={{ marginTop: '8px' }} >
          {'Pseudoknotted base pairs are specified by "[ ]", "{ }", or "< >".'}
        </p>
        <p style={{ marginTop: '8px' }} >
          All other characters and whitespace are ignored.
        </p>
      </div>
    </div>
  );
}
