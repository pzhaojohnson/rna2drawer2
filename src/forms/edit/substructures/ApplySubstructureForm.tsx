import type { App } from 'App';
import { numberingOffset } from 'Draw/sequences/numberingOffset';

import { isBlank } from 'Parse/isBlank';
import { parseDotBracket } from 'Parse/parseDotBracket';

import { applySecondarySubstructure } from 'Draw/strict/applySecondarySubstructure';
import { applyTertiarySubstructure } from 'Draw/strict/applyTertiarySubstructure';

import * as React from 'react';
import styles from './ApplySubstructureForm.css';
import { v4 as uuidv4 } from 'uuid';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import { DisplayableSequenceRange } from 'Forms/edit/sequence/DisplayableSequenceRange';
import { Checkbox } from 'Forms/inputs/checkbox/Checkbox';
import { SolidButton } from 'Forms/buttons/SolidButton';
import { ErrorMessage as _ErrorMessage } from 'Forms/ErrorMessage';
import { DottedNote } from 'Forms/notes/DottedNote';

function SubstructureField(
  props: {
    value: string,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
  },
) {
  return (
    <label className={styles.substructureFieldLabel} >
      Substructure
      <textarea
        className={styles.substructureFieldTextarea}
        value={props.value}
        onChange={props.onChange}
        rows={10}
        placeholder='...in dot-bracket notation "(((....)))"'
        style={{ marginTop: '4px' }}
      />
    </label>
  );
}

function StartPositionField(
  props: {
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  },
) {
  return (
    <div style={{ marginTop: '18px' }} >
      <label className={styles.startPositionFieldLabel} >
        <input
          type='text'
          className={styles.startPositionFieldInput}
          value={props.value}
          onChange={props.onChange}
          style={{ marginRight: '8px', width: '6ch' }}
        />
        Start Position of Substructure
      </label>
    </div>
  );
}

function MaintainTertiaryBondsField(
  props: {
    checked: boolean,
    onChange: (event: { target: { checked: boolean } }) => void,
  },
) {
  return (
    <div style={{ marginTop: '14px' }} >
      <label className={styles.maintainTertiaryBondsFieldLabel} >
        <Checkbox
          checked={props.checked}
          onChange={props.onChange}
        />
        <span style={{ marginLeft: '6px' }} >
          Maintain Preexisting Tertiary Bonds
        </span>
      </label>
    </div>
  );
}

function SubmitButton(
  props: {
    onClick: () => void;
  }
) {
  return (
    <div style={{ marginTop: '32px' }} >
      <SolidButton
        text='Apply'
        onClick={props.onClick}
      />
    </div>
  );
}

function ErrorMessage(
  props: {
    textContent?: string,
  },
) {
  return (
    <div style={{ marginTop: '6px' }} >
      <_ErrorMessage message={props.textContent} />
    </div>
  );
}

function ExplanatoryNote() {
  return (
    <div style={{ marginTop: '16px' }} >
      <DottedNote>
        The substructure will be applied beginning at
        the provided start position in the drawing.
      </DottedNote>
    </div>
  );
}

function TertiaryBondsNote() {
  return (
    <div style={{ marginTop: '12px' }} >
      <DottedNote>
        Preexisting tertiary bonds can be maintained
        or removed when applying the substructure.
      </DottedNote>
    </div>
  );
}

export type Props = {
  unmount: () => void;
  history: FormHistoryInterface;

  // a reference to the whole app
  app: App;

  // optional initial values for inputs
  // (override any previous inputs when specified)
  substructure?: string;
  startPosition?: string;
};

type Inputs = {

  // dot-bracket notation of the substructure to apply
  substructure: string;

  // the start position of the substructure in the layout sequence
  // of the strict drawing of the app
  startPosition: string;

  // controls whether to remove preexisting tertiary bonds binding
  // bases in the substructure
  removeTertiaryBonds: boolean;
}

interface State extends Inputs {
  errorMessage?: string;
}

function deepCopyInputs(inputs: Inputs | State): Inputs {
  return {
    substructure: inputs.substructure,
    startPosition: inputs.startPosition,
    removeTertiaryBonds: inputs.removeTertiaryBonds,
    // omit any error message
  };
}

let prevInputs: Inputs = {
  substructure: '',
  startPosition: '1',
  removeTertiaryBonds: true,
};

export class ApplySubstructureForm extends React.Component<Props> {
  static key = uuidv4();

  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      ...deepCopyInputs(prevInputs),
      substructure: props.substructure ?? prevInputs.substructure,
      startPosition: props.startPosition ?? prevInputs.startPosition,
    };
  }

  componentWillUnmount() {
    prevInputs = deepCopyInputs(this.state);
  }

  render() {
    return (
      <PartialWidthContainer
        unmount={this.props.unmount}
        history={this.props.history}
        title='Apply Substructure'
        style={{ width: '372px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }} >
          <SubstructureField
            value={this.state.substructure}
            onChange={event => this.setState({ substructure: event.target.value })}
          />
          <StartPositionField
            value={this.state.startPosition}
            onChange={event => this.setState({ startPosition: event.target.value })}
          />
          <div style={{ height: '6px' }} />
          <DisplayableSequenceRange
            sequence={this.props.app.strictDrawing.layoutSequence()}
          />
          <MaintainTertiaryBondsField
            checked={!this.state.removeTertiaryBonds}
            onChange={event => this.setState({ removeTertiaryBonds: !event.target.checked })}
          />
          <SubmitButton
            onClick={() => {
              try {
                this.submit(this.state);
                this.setState({ errorMessage: '' });
              } catch (error) {
                let errorMessage = error instanceof Error ? error.message : String(error);
                this.setState({ errorMessage });
              }
            }}
          />
          {!this.state.errorMessage ? null : (
            <ErrorMessage textContent={this.state.errorMessage} />
          )}
          <ExplanatoryNote />
          <TertiaryBondsNote />
        </div>
      </PartialWidthContainer>
    );
  }

  submit(inputs: Inputs): void | never {
    let parsedDotBracket = parseDotBracket(inputs.substructure);
    if (isBlank(inputs.substructure)) {
      throw new Error('Substructure is empty.');
    } else if (parsedDotBracket == null) {
      throw new Error('Substructure is invalid.');
    }

    let startPosition = Number.parseFloat(inputs.startPosition);
    if (isBlank(inputs.startPosition)) {
      throw new Error('Enter a start position.');
    } else if (!Number.isFinite(startPosition)) {
      throw new Error('Start position must be a number.');
    }

    let sequence = this.props.app.strictDrawing.layoutSequence();
    let no = numberingOffset(sequence);
    if (no != undefined) {
      startPosition -= no;
    }

    let endPosition = startPosition + parsedDotBracket.secondaryPartners.length - 1;

    if (startPosition < 1 || startPosition > sequence.length) {
      throw new Error('Start position is out of bounds.');
    } else if (endPosition > sequence.length) {
      throw new Error('Substructure goes out of bounds.');
    }

    this.props.app.pushUndo();
    let strictDrawing = this.props.app.strictDrawing;
    applySecondarySubstructure(strictDrawing, {
      partners: parsedDotBracket.secondaryPartners,
      startPosition,
    });
    applyTertiarySubstructure(strictDrawing, {
      partners: parsedDotBracket.tertiaryPartners,
      startPosition,
    }, { removeTertiaryBonds: inputs.removeTertiaryBonds });
    this.props.app.refresh();
  }
}
