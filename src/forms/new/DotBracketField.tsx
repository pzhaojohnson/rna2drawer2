import * as React from 'react';
import parsingDetailsStyles from './ParsingDetails.css';

interface Props {
  initialValue: string;
  set: (s: string) => void;
  toggleParsingDetails: () => void;
  flexGrow: number;
}

export function DotBracketField(props: Props): React.ReactElement {
  return (
    <div style={{ flexGrow: props.flexGrow, display: 'flex', flexDirection: 'column' }} >
      <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'row' }} >
        <p className={'unselectable-text'} style={{ fontSize: '12px' }} >
          Structure:
        </p>
        <p
          className={'unselectable-text'}
          style={{ marginLeft: '4px', flexGrow: 1, fontSize: '12px', color: 'rgba(0,0,0,0.4)' }}
        >
          (Optional)
        </p>
        <p
          className={parsingDetailsStyles.detailsToggle}
          onClick={() => props.toggleParsingDetails()}
          style={{
            marginRight: '4px',
            fontSize: '12px',
            color: 'rgba(0,0,255,0.8)',
            cursor: 'pointer',
          }}
        >
          Details
        </p>
      </div>
      <textarea
        value={props.initialValue}
        onChange={event => props.set(event.target.value)}
        spellCheck={'false'}
        placeholder={
          ' ...the structure in dot-bracket notation, e.g., "((((....))))"\n\n'
          + ' ...also called "Vienna" format'
        }
        style={{
          flexGrow: 1,
          margin: '4px 0px 0px 0px',
          fontSize: '12px',
        }}
      />
    </div>
  );
}
