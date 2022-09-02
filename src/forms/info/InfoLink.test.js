import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from 'react-dom';
import { unmountComponentAtNode } from 'react-dom';

import { InfoLink } from './InfoLink';

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

describe('InfoLink component', () => {
  it('passes props to underlying anchor element', () => {
    act(() => {
      render(
        <InfoLink
          href='https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Positions#what_are_pixels'
          title='Learn more about pixels in SVG.'
          style={{ margin: '2px 0px 0px 5.61px' }}
        />,
        container,
      );
    });
    expect(container.firstChild.href).toBe('https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Positions#what_are_pixels');
    expect(container.firstChild.title).toBe('Learn more about pixels in SVG.');
    expect(container.firstChild.style.margin).toBe('2px 0px 0px 5.61px');
  });
});
