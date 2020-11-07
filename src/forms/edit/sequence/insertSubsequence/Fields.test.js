import React from 'react';
import { render } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import {
  InsertPositionField,
  SubsequenceField,
  IgnoreNumbersField,
  IgnoreNonAugctLettersField,
  IgnoreNonAlphanumericsField,
  Fields,
} from './Fields';
import { IntegerField } from '../../../fields/text/IntegerField';

let container = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

function createInputs() {
  return {
    insertPosition: 1,
    subsequence: 'asdf',
    ignoreNumbers: false,
    ignoreNonAugctLetters: false,
    ignoreNonAlphanumerics: false,
  };
}

function createCallbacks() {
  return {
    onInput: jest.fn(),
    onValidInput: jest.fn(),
    onInvalidInput: jest.fn(),
    set: jest.fn(),
  };
}

describe('insert position field', () => {
  let inputs = createInputs();
  inputs.insertPosition = 52;
  let fs = createCallbacks();
  let field = InsertPositionField({
    initialValue: inputs,
    ...fs,
  })

  it('only accepts integers', () => {
    expect(field.type).toBe(IntegerField);
  });

  it('renders with initial value', () => {
    expect(field.props.initialValue).toBe(inputs.insertPosition);
  });

  it('passes on input callbacks', () => {
    expect(field.props.onInput).toBe(fs.onInput);
    expect(field.props.onValidInput).toBe(fs.onValidInput);
    expect(field.props.onInvalidInput).toBe(fs.onInvalidInput);
  });

  it('passes value between set callbacks', () => {
    field.props.set(112);
    expect(fs.set.mock.calls[0][0]).toStrictEqual({ ...inputs, insertPosition: 112 });
  });
});

describe('subsequence field', () => {
  let inputs = createInputs();
  inputs.subsequence = 'asdfQWERzxcv';
  let fs = createCallbacks();
  let field = SubsequenceField({
    initialValue: inputs,
    ...fs,
  })

  it('renders with initial value', () => {
    expect(field.props.initialValue).toBe(inputs.subsequence);
  });

  it('passes on input callback', () => {
    expect(field.props.onInput).toBe(fs.onInput);
  });

  it('passes value between set callbacks', () => {
    field.props.set('aaQQzzasdf');
    expect(fs.set.mock.calls[0][0]).toStrictEqual({ ...inputs, subsequence: 'aaQQzzasdf' });
  });
});

describe('ignore numbers field', () => {
  let inputs = createInputs();
  inputs.ignoreNumbers = !inputs.ignoreNumbers;
  let fs = createCallbacks();
  let field = IgnoreNumbersField({
    initialValue: inputs,
    ...fs,
  })

  it('renders with initial value', () => {
    expect(field.props.initialValue).toBe(inputs.ignoreNumbers);
  });

  it('passes value between set callbacks', () => {
    field.props.set(!inputs.ignoreNumbers);
    expect(fs.set.mock.calls[0][0]).toStrictEqual({ ...inputs, ignoreNumbers: !inputs.ignoreNumbers });
  });
});

describe('ignore Non-AUGCT letters field', () => {
  let inputs = createInputs();
  inputs.ignoreNonAugctLetters = !inputs.ignoreNonAugctLetters;
  let fs = createCallbacks();
  let field = IgnoreNonAugctLettersField({
    initialValue: inputs,
    ...fs,
  })

  it('renders with initial value', () => {
    expect(field.props.initialValue).toBe(inputs.ignoreNonAugctLetters);
  });

  it('passes value between set callbacks', () => {
    field.props.set(!inputs.ignoreNonAugctLetters);
    expect(fs.set.mock.calls[0][0]).toStrictEqual({ ...inputs, ignoreNonAugctLetters: !inputs.ignoreNonAugctLetters });
  });
});

describe('ignore non-alphanumerics field', () => {
  let inputs = createInputs();
  inputs.ignoreNonAlphanumerics = !inputs.ignoreNonAlphanumerics;
  let fs = createCallbacks();
  let field = IgnoreNonAlphanumericsField({
    initialValue: inputs,
    ...fs,
  })

  it('renders with initial value', () => {
    expect(field.props.initialValue).toBe(inputs.ignoreNonAlphanumerics);
  });

  it('passes value between set callbacks', () => {
    field.props.set(!inputs.ignoreNonAlphanumerics);
    expect(fs.set.mock.calls[0][0]).toStrictEqual({ ...inputs, ignoreNonAlphanumerics: !inputs.ignoreNonAlphanumerics });
  });
});

describe('Fields component', () => {
  it('renders', () => {
    render(
      <Fields
        initialValue={createInputs()}
        {...createCallbacks()}
      />,
      container,
    );
  });
});
