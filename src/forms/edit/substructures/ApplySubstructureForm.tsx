import type { App } from 'App';
import { numberingOffset } from 'Draw/sequences/numberingOffset';

import { isBlank } from 'Parse/isBlank';
import { parseDotBracket } from 'Parse/parseDotBracket';

import { applySecondarySubstructure } from 'Draw/strict/applySecondarySubstructure';
import { applyTertiarySubstructure } from 'Draw/strict/applyTertiarySubstructure';

import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';
import { PartialWidthContainer } from 'Forms/containers/PartialWidthContainer';
import textFieldStyles from 'Forms/inputs/text/TextField.css';
import { Checkbox } from 'Forms/inputs/checkbox/Checkbox';
import { SolidButton } from 'Forms/buttons/SolidButton';
import { ErrorMessage as _ErrorMessage } from 'Forms/ErrorMessage';

function SubstructureField(
  props: {
    value: string,
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void,
  },
) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }} >
      <p>
        Substructure
      </p>
      <textarea
        value={props.value}
        onChange={props.onChange}
        rows={9}
        placeholder='...in dot-bracket notation "(((....)))"'
        style={{ marginTop: '4px' }}
      />
    </div>
  );
}

function StartPositionField(
  props: {
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    numberingOffset: number | undefined,
  },
) {
  return (
    <div style={{ marginTop: '16px' }} >
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <input
          type='text'
          className={textFieldStyles.input}
          value={props.value}
          onChange={props.onChange}
          style={{ width: '6ch' }}
        />
        <p style={{ marginLeft: '8px' }} >
          Start Position
        </p>
      </div>
      {!props.numberingOffset ? null : (
        <p style={{ marginTop: '4px' }} >
          <span style={{ fontWeight: 600, color: 'black' }}>
            {props.numberingOffset}&nbsp;
          </span>
          is the numbering offset.
        </p>
      )}
    </div>
  );
}

function RemoveTertiaryBondsField(
  props: {
    checked: boolean,
    onChange: (event: { target: { checked: boolean } }) => void,
  },
) {
  return (
    <div style={{ marginTop: '12px' }} >
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
        <Checkbox
          checked={!props.checked}
          onChange={props.onChange}
        />
        <p style={{ marginLeft: '6px' }} >
          Maintain Tertiary Bonds
        </p>
      </div>
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
    <p style={{ marginTop: '16px' }} >
      <span style={{ fontWeight: 600, color: 'black' }} >Note:&nbsp;</span>
      The substructure will be applied beginning at
      the provided start position in the drawing.
    </p>
  );
}

function TertiaryBondsNote() {
  return (
    <p style={{ marginTop: '8px' }} >
      <span style={{ fontWeight: 600, color: 'black' }} >Note:&nbsp;</span>
      Preexisting tertiary bonds can be maintained
      or removed when applying the substructure.
    </p>
  );
}

export type Props = {
  unmount: () => void;
  history: FormHistoryInterface;

  // a reference to the whole app
  app: App;
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

    this.state = deepCopyInputs(prevInputs);
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
            numberingOffset={numberingOffset(this.props.app.strictDrawing.layoutSequence())}
          />
          <RemoveTertiaryBondsField
            checked={this.state.removeTertiaryBonds}
            onChange={event => this.setState({ removeTertiaryBonds: event.target.checked })}
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
