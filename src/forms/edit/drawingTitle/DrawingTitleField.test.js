import App from '../../../App';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { DrawingTitleField } from './DrawingTitleField';

let app = null;

let container = null;

beforeEach(() => {
  app = new App(() => NodeSVG());

  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  app = null;
  
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('renders', () => {
  app.strictDrawing.appendSequence('asdf', 'asdfasdf');
  app.strictDrawing.appendSequence('qwer', 'qwerqwer');
  act(() => {
    render(<DrawingTitleField app={app} />, container);
  });
});

it('renders with current drawing title', () => {
  app.strictDrawing.appendSequence('asdf', 'asdfasdf');
  app.strictDrawing.appendSequence('qwer', 'qwerqewr');
  app.strictDrawing.appendSequence('zxcv', 'zxcvzxcv');
  app.unspecifyDrawingTitle(); // title is unspecified
  let f = DrawingTitleField({ app: app });
  expect(f.props.initialValue).toBe('asdf, qwer, zxcv');
  app.drawingTitle = 'A Specified Title'; // when title is specified
  f = DrawingTitleField({ app: app });
  expect(f.props.initialValue).toBe('A Specified Title');
});

describe('set callback', () => {
  it('can set drawing title', () => {
    let f = DrawingTitleField({ app: app });
    f.props.set('  As Ettg \t  ');
    // removes leading and trailing whitespace
    expect(app.drawingTitle).toBe('As Ettg');
  });

  it('can unspecify drawing title', () => {
    app.strictDrawing.appendSequence('asdf', 'asdfasdf');
    app.strictDrawing.appendSequence('qwer', 'qwerqwer');
    app.drawingTitle = 'AAQQEEBB';
    let f = DrawingTitleField({ app: app });
    expect(app.drawingTitle).toBe('AAQQEEBB');
    f.props.set('');
    // title becomes sequence IDs
    expect(app.drawingTitle).toBe('asdf, qwer');
    app.drawingTitle = 'zxcvZXCV';
    f = DrawingTitleField({ app: app });
    expect(app.drawingTitle).toBe('zxcvZXCV');
    f.props.set('  \t \t \n'); // ignores whitespace
    // title becomes sequence IDs
    expect(app.drawingTitle).toBe('asdf, qwer');
  });

  it('only specifies drawing title if necessary', () => {
    /* This prevents the field from specifying a currently unspecified
    drawing title when the user focuses and blurs the field without
    actually changing the drawing title. */
    app.strictDrawing.appendSequence('zxcv', 'zxcvzxcv');
    app.strictDrawing.appendSequence('ASDF', 'ASDFASDF');
    app.unspecifyDrawingTitle();
    let f = DrawingTitleField({ app: app });
    expect(app.drawingTitle).toBe('zxcv, ASDF');
    f.props.set('zxcv, ASDF'); // should not specify
    app.strictDrawing.appendSequence('QWer', 'QWERqwer');
    // drawing title still updates automatically
    expect(app.drawingTitle).toBe('zxcv, ASDF, QWer');
    f = DrawingTitleField({ app: app });
    expect(f.props.initialValue).toBe('zxcv, ASDF, QWer');
  });
});
