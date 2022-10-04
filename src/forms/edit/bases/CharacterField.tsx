import type { App } from 'App';

import type { Base } from 'Draw/bases/Base';

import { ValuesWrapper } from 'Values/ValuesWrapper';

import * as React from 'react';

import { TextInputField } from 'Forms/inputs/text/TextInputField';

import { generateHTMLCompatibleUUID } from 'Utilities/generateHTMLCompatibleUUID';

class BaseWrapper {
  /**
   * The wrapped base.
   */
  readonly base: Base;

  constructor(base: Base) {
    this.base = base;
  }

  /**
   * The character of a base is defined as the text content of its text
   * element, which is expected to be a single character.
   */
  get character(): string {
    // might be best to simply return the text content
    // (even if is not actually a single character)
    return this.base.text.text();
  }

  set character(character: string) {
    if (character.length == 0) {
      return; // ignore empty strings
    }

    character = character.charAt(0); // ignore any trailing characters

    // remember center coordinates
    let textBBox = this.base.text.bbox();
    let textCenter = { x: textBBox.cx, y: textBBox.cy };

    this.base.text.text(character);

    // recenter
    this.base.text.center(textCenter.x, textCenter.y);
  }
}

class BasesWrapper {
  /**
   * The wrapped bases.
   */
  readonly bases: BaseWrapper[];

  constructor(bases: Base[]) {
    this.bases = bases.map(b => new BaseWrapper(b));
  }

  /**
   * Returns undefined if the bases do not all have the same character.
   */
  get commonCharacter(): string | undefined {
    let characters = new ValuesWrapper(
      this.bases.map(b => b.character)
    );
    return characters.commonValue;
  }

  set commonCharacter(commonCharacter: string | undefined) {
    if (commonCharacter == undefined) {
      return; // ignore undefined values
    }

    this.bases.forEach(b => {
      b.character = commonCharacter;
    });
  }
}

// keep stable to help with refocusing the input element on app refresh
const inputId = generateHTMLCompatibleUUID();

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The bases to edit.
   */
  bases: Base[];
}

type State = {
  value: string;
}

export class CharacterField extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: this.initialValue,
    }
  }

  get initialValue(): string {
    let bases = new BasesWrapper(this.props.bases);
    return bases.commonCharacter ?? '';
  }

  render() {
    return (
      <TextInputField
        label='Character'
        value={this.state.value}
        onChange={event => {
          this.setState({ value: event.target.value });
        }}
        onBlur={() => {
          this.submit();
          this.props.app.refresh();
        }}
        onKeyUp={event => {
          if (event.key.toLowerCase() == 'enter') {
            this.submit();
            this.props.app.refresh();
          }
        }}
        input={{
          id: inputId,
          style: { width: '2ch', textAlign: 'center' },
        }}
        style={{ marginBottom: '14px', alignSelf: 'start' }}
      />
    );
  }

  submit() {
    let c = this.state.value;
    c = c.trim(); // remove leading and trailing whitespace

    if (c.length == 0) {
      return;
    } else if (c == this.initialValue) {
      return;
    }

    let bases = new BasesWrapper(this.props.bases);

    this.props.app.pushUndo();
    bases.commonCharacter = c;
  }
}
