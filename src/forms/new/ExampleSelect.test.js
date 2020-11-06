import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { ExampleSelect } from './ExampleSelect';

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

it('renders', () => {
  act(() => {
    render(
      <ExampleSelect
        examples={['asdf', 'QWER', 'zxcvzxcv', 'asdfzxcvqwer']}
        selected='QWER'
        select={jest.fn()}
      />,
      container,
    );
  });
});

describe('passing props', () => {
  let select = jest.fn();
  let es = ExampleSelect({
    examples: ['asdf', 'QWER', 'zxcvzxcv', 'asdfzxcvqwer'],
    selected: 'zxcvzxcv',
    select: select,
  });

  it('passes examples', () => {
    expect(es.props.options).toStrictEqual(['asdf', 'QWER', 'zxcvzxcv', 'asdfzxcvqwer']);
  });

  it('passes selected', () => {
    expect(es.props.initialValue).toBe('zxcvzxcv');
  });

  it('passes value between select callback', () => {
    es.props.set('QWER');
    expect(select.mock.calls[0][0]).toBe('QWER');
  });
});
