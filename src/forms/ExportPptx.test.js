import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';

import { ExportPptx } from './ExportPptx';

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

function getComponent() {
  return container.childNodes[0];
}

function getCloseButton() {
  let c = getComponent();
  return c.childNodes[0];
}

function getTitleAndContent() {
  let c = getComponent();
  return c.childNodes[1];
}

function getBaseFontSizeSection() {
  let tc = getTitleAndContent();
  return tc.childNodes[1];
}

function getBaseFontSizeField() {
  let section = getBaseFontSizeSection();
  return section.childNodes[1];
}

function getBaseFontSizeInput() {
  let field = getBaseFontSizeField();
  return field.childNodes[1];
}

function getErrorMessageSection() {
  let tc = getTitleAndContent();
  return tc.childNodes[2];
}

function getErrorMessageTextContent() {
  let section = getErrorMessageSection();
  return section.textContent;
}

function getExportSection() {
  let tc = getTitleAndContent();
  return tc.childNodes[3];
}

function getExportButton() {
  let section = getExportSection();
  return section.childNodes[0];
}

describe('handles undefined props', () => {
  it('renders', () => {
    act(() => {
      render(<ExportPptx />, container);
    });
  });

  describe('attempts to export without throwing', () => {
    it('handles missing SVG callback', () => {
      act(() => {
        render(
          <ExportPptx getSvgString={jest.fn()} />,
          container,
        );
        let eb = getExportButton();
        eb.dispatchEvent(
          new Event('click', { bubbles: true })
        );
      });
    });

    it('handles missing getSvgString callback', () => {
      act(() => {
        render(
          <ExportPptx SVG={jest.fn()} />,
          container,
        );
        let eb = getExportButton();
        eb.dispatchEvent(
          new Event('click', { bubbles: true })
        );
      });
    });
  });

  it('attempts to close without throwing', () => {
    act(() => {
      render(<ExportPptx />, container);
      let cb = getCloseButton();
      cb.dispatchEvent(
        new Event('click', { bubbles: true })
      );
    });
  });
});

it('binds close button to close callback', () => {
  let close = jest.fn();
  act(() => {
    render(<ExportPptx close={close} />, container);
  });
  expect(close.mock.calls.length).toBe(0);
  act(() => {
    let cb = getCloseButton();
    cb.dispatchEvent(
      new Event('click', { bubbles: true })
    );
  });
  expect(close.mock.calls.length).toBe(1);
});

describe('handles invalid base font size', () => {
  it('handles non-numeric base font size', () => {
    act(() => {
      render(<ExportPptx />, container);
      let input = getBaseFontSizeInput();
      fireEvent.change(
        input,
        { target: { value: 'asdf' } },
      );
    });
    let t = getErrorMessageTextContent();
    expect(t.length).toBe(0);
    let id1 = getErrorMessageSection().id;
    act(() => {
      let eb = getExportButton();
      eb.dispatchEvent(
        new Event('click', { bubbles: true })
      );
    });
    t = getErrorMessageTextContent();
    expect(t.length).toBeGreaterThan(0);
    let id2 = getErrorMessageSection().id;
    expect(id2).not.toBe(id1);
  });

  it('handles negative base font size', () => {
    act(() => {
      render(<ExportPptx />, container);
      let input = getBaseFontSizeInput();
      fireEvent.change(
        input,
        { target: { value: '-6' } },
      );
    });
    let t = getErrorMessageTextContent();
    expect(t.length).toBe(0);
    let id1 = getErrorMessageSection().id;
    act(() => {
      let eb = getExportButton();
      eb.dispatchEvent(
        new Event('click', { bubbles: true })
      );
    });
    t = getErrorMessageTextContent();
    expect(t.length).toBeGreaterThan(0);
    let id2 = getErrorMessageSection().id;
    expect(id2).not.toBe(id1);
  });

  it('handles positive base font size less than one', () => {
    act(() => {
      render(<ExportPptx />, container);
      let input = getBaseFontSizeInput();
      fireEvent.change(
        input,
        { target: { value: '0.5' } },
      );
    });
    let t = getErrorMessageTextContent();
    expect(t.length).toBe(0);
    let id1 = getErrorMessageSection().id;
    act(() => {
      let eb = getExportButton();
      eb.dispatchEvent(
        new Event('click', { bubbles: true })
      );
    });
    t = getErrorMessageTextContent();
    expect(t.length).toBeGreaterThan(0);
    let id2 = getErrorMessageSection().id;
    expect(id2).not.toBe(id1);
  });
});

it('clears error message on valid input', () => {
  act(() => {
    render(<ExportPptx />, container);
    let input = getBaseFontSizeInput();
    fireEvent.change(
      input,
      { target: { value: 'asdf' } },
    );
  });
  act(() => {
    let eb = getExportButton();
    eb.dispatchEvent(
      new Event('click', { bubbles: true })
    );
  });
  let t = getErrorMessageTextContent();
  expect(t.length).toBeGreaterThan(0);
  let id1 = getErrorMessageSection().id;
  act(() => {
    let input = getBaseFontSizeInput();
    fireEvent.change(
      input,
      { target: { value: 9 } },
    );
  });
  act(() => {
    let eb = getExportButton();
    eb.dispatchEvent(
      new Event('click', { bubbles: true })
    );
  });
  t = getErrorMessageTextContent();
  expect(t.length).toBe(0);
  let id2 = getErrorMessageSection().id;
  expect(id2).not.toBe(id1);
});
