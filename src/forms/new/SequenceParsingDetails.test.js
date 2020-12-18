import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import {
  IgnoreNumbersCheckbox,
  IgnoreNonAugctLettersCheckbox,
  IgnoreNonAlphanumericsCheckbox,
  SequenceParsingDetails,
} from './SequenceParsingDetails';

let container = null;

let props = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  props = {
    ignoringNumbers: false,
    ignoreNumbers: jest.fn(),
    ignoringNonAugctLetters: false,
    ignoreNonAugctLetters: jest.fn(),
    ignoringNonAlphanumerics: false,
    ignoreNonAlphanumerics: jest.fn(),
  };
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;

  props = null;
});

describe('ignore numbers checkbox', () => {
  it('renders', () => {
    act(() => {
      render(<IgnoreNumbersCheckbox {...props} />, container);
    });
  });

  it('passes initial value and passes value between callbacks', () => {
    props.ignoringNumbers = true;
    props.ignoringNonAugctLetters = false;
    props.ignoringNonAlphanumerics = false;
    let cb = IgnoreNumbersCheckbox({ ...props });
    expect(cb.props.initialValue).toBe(true);
    expect(props.ignoreNumbers).not.toHaveBeenCalled();
    cb.props.set(false);
    expect(props.ignoreNumbers.mock.calls[0][0]).toBe(false);
  });
});

describe('ignore non-AUGCT letters checkbox', () => {
  it('renders', () => {
    act(() => {
      render(<IgnoreNonAugctLettersCheckbox {...props} />, container);
    });
  });

  it('passes initial value and passes value between callbacks', () => {
    props.ignoringNumbers = true;
    props.ignoringNonAugctLetters = false;
    props.ignoringNonAlphanumerics = true;
    let cb = IgnoreNonAugctLettersCheckbox({ ...props });
    expect(cb.props.initialValue).toBe(false);
    expect(props.ignoreNonAugctLetters).not.toHaveBeenCalled();
    cb.props.set(true);
    expect(props.ignoreNonAugctLetters.mock.calls[0][0]).toBe(true);
  });
});

describe('ignore non-alphanumerics checkbox', () => {
  it('renders', () => {
    act(() => {
      render(<IgnoreNonAlphanumericsCheckbox {...props} />, container);
    });
  });

  it('passes initial value and passes value between callbacks', () => {
    props.ignoringNumbers = false;
    props.ignoringNonAugctLetters = false;
    props.ignoringNonAlphanumerics = true;
    let cb = IgnoreNonAlphanumericsCheckbox({ ...props });
    expect(cb.props.initialValue).toBe(true);
    expect(props.ignoreNonAlphanumerics).not.toHaveBeenCalled();
    cb.props.set(false);
    expect(props.ignoreNonAlphanumerics.mock.calls[0][0]).toBe(false);
  });
});

describe('sequence parsing details component', () => {
  it('renders', () => {
    act(() => {
      render(<SequenceParsingDetails {...props} />, container);
    });
  });
});
