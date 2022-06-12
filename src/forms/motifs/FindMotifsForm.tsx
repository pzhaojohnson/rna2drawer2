import type { App } from 'App';
import { SequenceInterface as Sequence } from 'Draw/sequences/SequenceInterface';
import { numberingOffset } from 'Draw/sequences/numberingOffset';
import type { Base } from 'Draw/bases/Base';

import * as React from 'react';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';

import styles from './FindMotifsForm.css';
import { TextInput } from 'Forms/inputs/text/TextInput';
import { TextInputField } from 'Forms/inputs/text/TextInputField';
import { CheckboxField } from 'Forms/inputs/checkbox/CheckboxField';
import { Props as CheckboxFieldProps } from 'Forms/inputs/checkbox/CheckboxField';
import { FieldDescription } from 'Forms/inputs/labels/FieldDescription';

import { isBlank } from 'Parse/isBlank';
import { motifsMatch } from './motifsMatch';
import { round } from 'Math/round';
import { compareNumbersDescending } from 'Array/sort';

import { centerViewOnBases } from './centerViewOnBases';
import { BaseBlinker } from './BaseBlinker';

export type FormProps = {

  // a reference to the whole app
  app: App;

  unmount: () => void;
  history: FormHistoryInterface;
};

type Options = {
  treatMotifAsRegExp: boolean;
  UT: boolean;
  IUPAC: boolean;
  allowedMismatch: number;
};

type FormState = {
  motif: string;

  showOptions: boolean;
  options: Options;
};

function deepCopyFormState(state: FormState): FormState {
  return {
    ...state,
    options: { ...state.options },
  };
}

let prevFormState: FormState = {
  motif: '',
  showOptions: false,
  options: {
    treatMotifAsRegExp: false,
    UT: true,
    IUPAC: false,
    allowedMismatch: 0,
  },
};

type MotifInputProps = {
  value: string;

  // called on blur and pressing the Enter key
  onSubmit: (event: { target: { value: string } }) => void;
};

class MotifInput extends React.Component<MotifInputProps> {
  state: {
    value: string;
  };

  constructor(props: MotifInputProps) {
    super(props);

    this.state = {
      value: props.value,
    };
  }

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }} >
        <TextInput
          value={this.state.value}
          onChange={event => this.setState({ value: event.target.value })}
          onBlur={() => this.submit()}
          onKeyUp={event => {
            if (event.key.toLowerCase() == 'enter') {
              this.submit();
            }
          }}
          spellCheck={false}
          style={{ width: 'auto' }} // allow element to stretch
        />
        <FieldDescription style={{ margin: '6px 0 0 16px' }} >
          ...a motif to search for "CUGCCA"
        </FieldDescription>
      </div>
    );
  }

  submit() {
    let value = this.state.value.trim();
    this.setState({ value });
    this.props.onSubmit({ target: { value } });
  }
}

type OptionsToggleProps = {
  onClick: () => void;
};

function OptionsToggle(props: OptionsToggleProps) {
  return (
    <button
      className={styles.optionsToggle}
      onClick={props.onClick}
    >
      Options
    </button>
  );
}

function TreatMotifAsRegExpField(props: CheckboxFieldProps) {
  return (
    <CheckboxField
      label='Treat Motif as a Regular Expression'
      checked={props.checked}
      onChange={props.onChange}
      style={{ alignSelf: 'start' }}
    />
  );
}

function UTField(props: CheckboxFieldProps) {
  return (
    <CheckboxField
      label='Match Us and Ts'
      checked={props.checked}
      onChange={props.onChange}
      style={{ alignSelf: 'start' }}
    />
  );
}

function IUPACField(props: CheckboxFieldProps) {
  return (
    <CheckboxField
      label='Use IUPAC single letter codes'
      checked={props.checked}
      onChange={props.onChange}
      style={{ alignSelf: 'start' }}
    />
  );
}

type AllowedMismatchFieldProps = {
  value: number;

  // called on blur and pressing the Enter key
  onSubmit: (event: { target: { value: number } }) => void;
};

class AllowedMismatchField extends React.Component<AllowedMismatchFieldProps> {
  state: {
    value: string;
  };

  constructor(props: AllowedMismatchFieldProps) {
    super(props);

    this.state = {
      value: this.percentageValue(props.value),
    };
  }

  render() {
    return (
      <TextInputField
        label='Mismatch Allowed'
        value={this.state.value}
        onChange={event => this.setState({ value: event.target.value })}
        onBlur={() => this.submit()}
        onKeyUp={event => {
          if (event.key.toLowerCase() == 'enter') {
            this.submit();
          }
        }}
        input={{
          spellCheck: false,
          style: { width: '5ch', textAlign: 'end' },
        }}
        style={{ alignSelf: 'start' }}
      />
    );
  }

  percentageValue(proportion: number): string {
    return round(100 * proportion, 0) + '%';
  }

  submit() {
    let proportion = Number.parseFloat(this.state.value) / 100;
    proportion = round(proportion, 2);
    if (!Number.isFinite(proportion)) {
      proportion = 0;
    } else if (proportion < 0) {
      proportion = 0;
    } else if (proportion > 1) {
      proportion = 1;
    }
    this.setState({ value: this.percentageValue(proportion) });
    this.props.onSubmit({ target: { value: proportion } });
  }
}

type OptionsPanelProps = {
  value: Options;
  onChange: (event: { target: { value: Options } }) => void;
};

function OptionsPanel(props: OptionsPanelProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} >
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column' }} >
        <UTField
          checked={props.value.UT}
          onChange={event => {
            let UT = event.target.checked;
            props.onChange({ target: { value: { ...props.value, UT } } });
          }}
        />
        <div style={{ height: '6px' }} />
        <IUPACField
          checked={props.value.IUPAC}
          onChange={event => {
            let IUPAC = event.target.checked;
            props.onChange({ target: { value: { ...props.value, IUPAC } } });
          }}
        />
        <div style={{ height: '8px' }} />
        <AllowedMismatchField
          value={props.value.allowedMismatch}
          onSubmit={event => {
            let allowedMismatch = event.target.value;
            props.onChange({ target: { value: { ...props.value, allowedMismatch } } });
          }}
        />
        {!props.value.treatMotifAsRegExp ? null : (
          // shrouds the above option fields
          <div style={{
            position: 'absolute', top: '0px', right: '0px', bottom: '0px', left: '0px',
            backgroundColor: 'white', opacity: 0.8,
          }} />
        )}
      </div>
      <div style={{ height: '8px' }} />
      <TreatMotifAsRegExpField
        checked={props.value.treatMotifAsRegExp}
        onChange={event => {
          let treatMotifAsRegExp = event.target.checked;
          props.onChange({ target: { value: { ...props.value, treatMotifAsRegExp } } });
        }}
      />
    </div>
  );
}

type Match = {

  // the motif that the match was found for
  matchedMotif: string;

  // the motif matching the matched motif
  matchingMotif: string;

  // the start position of the matching motif in its parent sequence
  startPosition: number;
};

type NumMatchesViewProps = {
  matches: Match[];
};

function NumMatchesView(props: NumMatchesViewProps) {
  let es = props.matches.length == 1 ? '' : 'es';
  return (
    <p className={styles.numMatchesView} >
      {props.matches.length} Match{es} found.
    </p>
  );
}

type NumberingOffsetViewProps = {
  numberingOffset?: number;
};

function NumberingOffsetView(props: NumberingOffsetViewProps) {
  if (props.numberingOffset == undefined || props.numberingOffset == 0) {
    return null;
  }

  return (
    <p className={styles.numberingOffsetView} >
      (Numbering offset of {props.numberingOffset}.)
    </p>
  );
}

function MatchesColumnLabels() {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'end' }} >
      <p className={styles.startPositionColumnLabel} >
        Start Position
      </p>
      <p className={styles.matchingMotifColumnLabel} >
        Matching Motif
      </p>
    </div>
  );
}

type MatchViewProps = {
  match: Match;
  startPositionViewWidth: string;
  numberingOffset: number;
  onClick: () => void;
};

function MatchView(props: MatchViewProps) {
  let startPosition = props.match.startPosition + props.numberingOffset;

  let matchingMotif = props.match.matchingMotif;
  if (matchingMotif.length > 24) {
    matchingMotif = matchingMotif.substring(0, 24) + '...';
  }

  return (
    <div
      className={styles.matchView}
      onClick={props.onClick}
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
    >
      <p
        className={styles.startPositionView}
        style={{ width: props.startPositionViewWidth }}
      >
        {startPosition}
      </p>
      <p className={styles.matchingMotifView} >
        {matchingMotif}
      </p>
    </div>
  );
}

// returns NaN for an empty array of start positions
function longestStartPositionLength(startPositions: number[]): number {
  if (startPositions.length == 0) {
    return NaN;
  }

  let lengths = startPositions.map(p => p.toString().length);
  lengths.sort(compareNumbersDescending);
  return lengths[0];
}

export class FindMotifsForm extends React.Component<FormProps> {
  state: FormState;

  constructor(props: FormProps) {
    super(props);

    this.state = deepCopyFormState(prevFormState);
  }

  componentWillUnmount() {
    prevFormState = deepCopyFormState(this.state);
  }

  render() {
    let matches = this.matches();

    let startPositions = matches.map(match => match.startPosition);
    let no = this.numberingOffset();
    let offsetStartPositions = startPositions.map(startPosition => startPosition + no);
    let startPositionColumnWidth = longestStartPositionLength(offsetStartPositions) + 'ch';

    return (
      <PartialWidthContainer
        title='Find Motifs'
        unmount={this.props.unmount}
        history={this.props.history}
        style={{ width: '372px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }} >
          <MotifInput
            value={this.state.motif}
            onSubmit={event => this.setState({ motif: event.target.value.trim() })}
          />
          <div style={{ height: '8px' }} />
          <OptionsToggle
            onClick={() => this.setState({ showOptions: !this.state.showOptions })}
          />
          <div style={{ height: '10px' }} />
          {!this.state.showOptions ? null : (
            <div style={{ marginLeft: '12px' }} >
              <OptionsPanel
                value={this.state.options}
                onChange={event => this.setState({ options: event.target.value })}
              />
            </div>
          )}
          <div style={{ height: this.state.showOptions ? '16px' : '4px' }} />
          {isBlank(this.state.motif) ? null : (
            <div style={{ display: 'flex', flexDirection: 'column' }} >
              <NumMatchesView matches={matches} />
              {matches.length == 0 ? null : (
                <div>
                  <div style={{ height: '8px' }} />
                  <MatchesColumnLabels />
                  <NumberingOffsetView numberingOffset={no} />
                  <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column' }} >
                    {matches.map((match, i) => (
                      <MatchView
                        key={i}
                        match={match}
                        startPositionViewWidth={startPositionColumnWidth}
                        numberingOffset={no}
                        onClick={() => this.highlight(match)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </PartialWidthContainer>
    );
  }

  // the sequence to search for motifs in
  sequence(): Sequence {
    return this.props.app.strictDrawing.layoutSequence();
  }

  // the numbering offset to use when reporting motif positions
  numberingOffset(): number {
    return numberingOffset(this.sequence()) ?? 0;
  }

  // converts a series of bases to a motif string
  basesToMotif(bases: Base[]): string {
    return bases.map(base => base.text.text()).join('');
  }

  // matches to the entered motif
  matches(): Match[] {
    if (this.state.options.treatMotifAsRegExp) {
      return this.regExpMatches();
    } else {
      return this.nucleicAcidMatches();
    }
  }

  // matches when treating the motif as a nucleic acid sequence
  nucleicAcidMatches(): Match[] {
    if (isBlank(this.state.motif)) {
      return [];
    }

    let matchedMotif = this.state.motif.trim();
    let matchesOptions = {
      UT: this.state.options.UT,
      IUPAC: this.state.options.IUPAC,
      allowedMismatch: this.state.options.allowedMismatch,
    };

    let matches: Match[] = [];
    let sequence = this.sequence();
    for (let p1 = 1; p1 + matchedMotif.length - 1 <= sequence.length; p1++) {
      let bases = sequence.bases.slice(p1 - 1, (p1 - 1) + matchedMotif.length);
      let matchingMotif = this.basesToMotif(bases);
      if (motifsMatch(matchedMotif, matchingMotif, matchesOptions)) {
        matches.push({ startPosition: p1, matchedMotif, matchingMotif });
      }
    }
    return matches;
  }

  // matches when treating the motif as a regular expression
  regExpMatches(): Match[] {
    if (isBlank(this.state.motif)) {
      return [];
    }

    // use try...catch in case the regular expression is invalid
    let it;
    try {
      let regExp = new RegExp(this.state.motif, 'g');
      it = this.basesToMotif(this.sequence().bases).matchAll(regExp);
    } catch (error) {
      console.error(error);
      console.error('Unable to use motif as a regular expression.');
      return [];
    }

    let matches: Match[] = [];
    let next = it.next();
    while (!next.done && next.value.index != undefined) {
      matches.push({
        matchedMotif: this.state.motif,
        matchingMotif: next.value[0],
        startPosition: next.value.index + 1,
      });
      next = it.next();
    }
    return matches;
  }

  matchingBases(match: Match): Base[] {
    let p1 = match.startPosition;
    let length = match.matchingMotif.length;
    return this.sequence().bases.slice(p1 - 1, (p1 - 1) + length);
  }

  highlight(match: Match) {
    let matchingBases = this.matchingBases(match);
    centerViewOnBases(this.props.app.strictDrawing, matchingBases);

    let strictDrawingInteraction = this.props.app.strictDrawingInteraction;
    let drawingOverlay = strictDrawingInteraction.drawingOverlay
    drawingOverlay.fitTo(this.props.app.strictDrawing.drawing);
    let blinkers = matchingBases.map(base => new BaseBlinker(base));
    blinkers.forEach(blinker => blinker.appendTo(drawingOverlay.svg));
    blinkers.forEach(blinker => blinker.blink({ remove: true }));
  }
}
