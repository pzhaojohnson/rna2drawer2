import type { App } from 'App';

import type { BaseNumbering } from 'Draw/bases/numberings/BaseNumbering';

import { ValuesWrapper } from 'Values/ValuesWrapper';

import * as React from 'react';

import { TextInput } from 'Forms/inputs/text/TextInput';

import { generateHTMLCompatibleUUID } from 'Utilities/generateHTMLCompatibleUUID';

class BaseNumberingsWrapper {
  /**
   * The wrapped base numberings.
   */
  readonly baseNumberings: BaseNumbering[];

  constructor(baseNumberngs: BaseNumbering[]) {
    this.baseNumberings = baseNumberngs;
  }

  /**
   * The number of a base numbering is defined here as the text content
   * of its text element, which is expected to be the string of a
   * number.
   *
   * Returns undefined if not all base numberings have the same number.
   */
  get number(): string | undefined {
    let numbers = new ValuesWrapper(
      this.baseNumberings.map(bn => bn.text.text())
    );
    return numbers.commonValue;
  }

  set number(number: string | undefined) {
    if (number == undefined) {
      return; // ignore undefined values
    }

    this.baseNumberings.forEach(bn => {
      bn.text.text(number);
    });
  }
}

// keep stable to help with refocusing the input element on app refresh
const id = generateHTMLCompatibleUUID();

export type Props = {
  /**
   * A reference to the whole app.
   */
  app: App;

  /**
   * The base numberings to edit.
   */
  baseNumberings: BaseNumbering[];
}

type State = {
  value: string;
}

export class NumberInput extends React.Component<Props> {
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      value: this.initialValue,
    };
  }

  get initialValue(): string {
    let baseNumberings = new BaseNumberingsWrapper(this.props.baseNumberings);
    return baseNumberings.number ?? '';
  }

  render() {
    return (
      <TextInput
        id={id}
        value={this.state.value}
        onChange={event => {
          this.setState({ value: event.target.value });
        }}
        onBlur={() => {
          this.submit();
        }}
        onKeyUp={event => {
          if (event.key.toLowerCase() == 'enter') {
            this.submit();
          }
        }}
        style={{
          width: `${Math.max(this.state.value.length, 5)}ch`,
        }}
      />
    );
  }

  submit() {
    try {
      let baseNumberings = new BaseNumberingsWrapper(this.props.baseNumberings);

      let number = Number.parseFloat(this.state.value);

      if (!Number.isFinite(number)) {
        throw new Error();
      }

      number = Math.floor(number); // make an integer

      if (number.toString() == baseNumberings.number) {
        throw new Error();
      }

      // update the numbers of the base numberings
      this.props.app.pushUndo();
      baseNumberings.number = number.toString();
      this.props.app.refresh();
    } catch {
      this.setState({ value: this.initialValue });
    }
  }
}
