import App from '../../App';
import NodeSVG from '../../draw/NodeSVG';
import { addSecondaryBond } from 'Draw/bonds/straight/add';
import { addTertiaryBond } from 'Draw/bonds/curved/add';
import { ExportLayoutStructureButton } from './ExportLayoutStructureButton';

import React from 'react';
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';

jest.mock('../../export/offerFileForDownload');
import * as OfferFileForDownload from '../../export/offerFileForDownload';

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
  let app = new App(() => NodeSVG());
  app.strictDrawing.appendSequence('asdf', 'asdfasdfasdf');
  act(() => {
    render(<ExportLayoutStructureButton app={app} />, container);
  });
});

it('exports name, ids, sequence and layout structure', () => {
  let app = new App(() => NodeSVG());
  let strictDrawing = app.strictDrawing;
  strictDrawing.appendSequence('asdf', 'asdfq');
  // handles multiple sequences
  strictDrawing.appendSequence('qwer', 'wer');
  strictDrawing.appendSequence('zxG', 'zxcvGG');
  let drawing = app.strictDrawing.drawing;
  addSecondaryBond(drawing, drawing.getBaseAtOverallPosition(2), drawing.getBaseAtOverallPosition(12));
  addSecondaryBond(drawing, drawing.getBaseAtOverallPosition(3), drawing.getBaseAtOverallPosition(11));
  addSecondaryBond(drawing, drawing.getBaseAtOverallPosition(4), drawing.getBaseAtOverallPosition(9));
  addSecondaryBond(drawing, drawing.getBaseAtOverallPosition(6), drawing.getBaseAtOverallPosition(8));
  // ignores tertiary bonds
  addTertiaryBond(drawing, drawing.getBaseAtOverallPosition(5), drawing.getBaseAtOverallPosition(7));
  addTertiaryBond(drawing, drawing.getBaseAtOverallPosition(1), drawing.getBaseAtOverallPosition(14));
  app.drawingChangedNotByInteraction();
  OfferFileForDownload.offerFileForDownload = jest.fn();
  let b = ExportLayoutStructureButton({ app: app });
  b.props.onClick();
  let c = OfferFileForDownload.offerFileForDownload.mock.calls[0];
  let fileProps = c[0];
  expect(fileProps.name).toBe('asdf, qwer, zxG.txt');
  expect(fileProps.type).toBe('text/plain');
  expect(fileProps.contents).toBe('>asdf, qwer, zxG\nasdfqwerzxcvGG\n.(((.(.)).))..');
});

it('when title of document is different from ids', () => {
  let app = new App(() => NodeSVG());
  app.strictDrawing.appendSequence('qwerzxcv', 'qwerqwer');
  app.drawingChangedNotByInteraction();
  document.title = 'QW ZXC asdf';
  OfferFileForDownload.offerFileForDownload = jest.fn();
  let b = ExportLayoutStructureButton({ app: app });
  b.props.onClick();
  let c = OfferFileForDownload.offerFileForDownload.mock.calls[0];
  let fileProps = c[0];
  expect(fileProps.name).toBe('QW ZXC asdf.txt');
  expect(fileProps.type).toBe('text/plain');
  expect(fileProps.contents).toBe('>qwerzxcv\nqwerqwer\n........');
});

it('when document has no title', () => {
  let app = new App(() => NodeSVG());
  app.strictDrawing.appendSequence('asdf', 'asdfqwer');
  app.drawingChangedNotByInteraction();
  document.title = '';
  OfferFileForDownload.offerFileForDownload = jest.fn();
  let b = ExportLayoutStructureButton({ app: app });
  b.props.onClick();
  let c = OfferFileForDownload.offerFileForDownload.mock.calls[0];
  let fileProps = c[0];
  expect(fileProps.name).toBe('Drawing.txt');
  expect(fileProps.type).toBe('text/plain');
  expect(fileProps.contents).toBe('>asdf\nasdfqwer\n........');
});
