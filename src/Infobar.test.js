import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import {
  Infobar,
  _ZOOMS,
} from './Infobar';

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

function getZoomSection() {
  let c = getComponent();
  return c.childNodes[1];
}

function getZoomMinus() {
  let section = getZoomSection();
  return section.childNodes[0];
}

function getZoomDisplay() {
  let section = getZoomSection();
  return section.childNodes[1];
}

function getZoomPlus() {
  let section = getZoomSection();
  return section.childNodes[2];
}

it('renders', () => {
  act(() => {
    render(<Infobar />, container);
  });
});

it('renders when drawing is empty', () => {
  act(() => {
    render(<Infobar drawingIsEmpty={true} />, container);
  });
  let c = getComponent();
  expect(c.childNodes.length).toBe(0);
  let hasZeroArea = c.clientWidth == 0 || c.clientHeight == 0;
  expect(hasZeroArea).toBeTruthy();
});

describe('zoom section', () => {
  describe('zoom display', () => {
    it('displays the zoom prop', () => {
      act(() => {
        render(
          <Infobar
            drawingIsEmpty={false}
            zoom={1.85}
          />,
          container,
        );
      });
      let display = getZoomDisplay();
      expect(display.textContent).toBe('185%');
    });
  });

  it('has a default zoom prop', () => {
    act(() => {
      render(<Infobar drawingIsEmpty={false} />, container);
    });
    let display = getZoomDisplay();
    expect(display.textContent).toBe('100%');
  });

  describe('zoom minus', () => {
    it('background color changes on mouse over and out', () => {
      act(() => {
        render(<Infobar drawingIsEmpty={false} />, container);
      });
      let minus = getZoomMinus();
      expect(minus.style.backgroundColor).toBe('transparent');
      act(() => {
        minus.dispatchEvent(
          new Event('mouseover', { bubbles: true })
        );
      });
      expect(minus.style.backgroundColor).toBe('gainsboro');
      act(() => {
        minus.dispatchEvent(
          new Event('mouseout', { bubbles: true })
        );
      });
      expect(minus.style.backgroundColor).toBe('transparent');
    });

    it('handles undefined setZoom prop', () => {
      act(() => {
        render(<Infobar drawingIsEmpty={false} />, container);
        let minus = getZoomMinus();
        minus.dispatchEvent(
          new Event('click', { bubbles: true })
        );
      });
    });

    it('handles predefined zoom prop', () => {
      let setZoom = jest.fn();
      act(() => {
        render(
          <Infobar
            drawingIsEmpty={false}
            zoom={_ZOOMS[5]}
            setZoom={setZoom}
          />,
          container,
        );
        let minus = getZoomMinus();
        minus.dispatchEvent(
          new Event('click', { bubbles: true })
        );
      });
      expect(setZoom.mock.calls.length).toBe(1);
      let c = setZoom.mock.calls[0];
      expect(c[0]).toBe(_ZOOMS[4]);
    });

    it('handles smallest predefined zoom', () => {
      let setZoom = jest.fn();
      let smallest = _ZOOMS[0];
      act(() => {
        render(
          <Infobar
            drawingIsEmpty={false}
            zoom={smallest}
            setZoom={setZoom}
          />,
          container,
        );
        let minus = getZoomMinus();
        minus.dispatchEvent(
          new Event('click', { bubbles: true })
        );
      });
      expect(setZoom.mock.calls.length).toBe(1);
      let c = setZoom.mock.calls[0];
      expect(c[0]).toBe(smallest);
    });

    it('handles zoom prop between predefined zooms', () => {
      let setZoom = jest.fn();
      let z = (_ZOOMS[5] + _ZOOMS[6]) / 2;
      act(() => {
        render(
          <Infobar
            drawingIsEmpty={false}
            zoom={z}
            setZoom={setZoom}
          />,
          container,
        );
        let minus = getZoomMinus();
        minus.dispatchEvent(
          new Event('click', { bubbles: true })
        );
      });
      expect(setZoom.mock.calls.length).toBe(1);
      let c = setZoom.mock.calls[0];
      expect(c[0]).toBe(_ZOOMS[5]);
    });

    it('handles zoom prop smaller than any predefined zoom', () => {
      let setZoom = jest.fn();
      let z = _ZOOMS[0] / 2;
      act(() => {
        render(
          <Infobar
            drawingIsEmpty={false}
            zoom={z}
            setZoom={setZoom}
          />,
          container,
        );
        let minus = getZoomMinus();
        minus.dispatchEvent(
          new Event('click', { bubbles: true })
        );
      });
      expect(setZoom.mock.calls.length).toBe(1);
      let c = setZoom.mock.calls[0];
      expect(c[0]).toBe(_ZOOMS[0]);
    });

    it('handles zoom prop bigger than any predefined zoom', () => {
      let setZoom = jest.fn();
      let z = 2 * _ZOOMS[_ZOOMS.length - 1];
      act(() => {
        render(
          <Infobar
            drawingIsEmpty={false}
            zoom={z}
            setZoom={setZoom}
          />,
          container,
        );
        let minus = getZoomMinus();
        minus.dispatchEvent(
          new Event('click', { bubbles: true })
        );
      });
      expect(setZoom.mock.calls.length).toBe(1);
      let c = setZoom.mock.calls[0];
      expect(c[0]).toBe(_ZOOMS[_ZOOMS.length - 1]);
    });
  });

  describe('zoom plus', () => {
    it('background color changes on mouse over and out', () => {
      act(() => {
        render(<Infobar drawingIsEmpty={false} />, container);
      });
      let plus = getZoomPlus();
      expect(plus.style.backgroundColor).toBe('transparent');
      act(() => {
        plus.dispatchEvent(
          new Event('mouseover', { bubbles: true })
        );
      });
      expect(plus.style.backgroundColor).toBe('gainsboro');
      act(() => {
        plus.dispatchEvent(
          new Event('mouseout', { bubbles: true })
        );
      });
      expect(plus.style.backgroundColor).toBe('transparent');
    });

    it('handles undefined setZoom prop', () => {
      act(() => {
        render(<Infobar drawingIsEmpty={false} />, container);
        let plus = getZoomPlus();
        plus.dispatchEvent(
          new Event('click', { bubbles: true })
        );
      });
    });

    it('handles predefined zoom prop', () => {
      let setZoom = jest.fn();
      act(() => {
        render(
          <Infobar
            drawingIsEmpty={false}
            zoom={_ZOOMS[5]}
            setZoom={setZoom}
          />,
          container,
        );
        let plus = getZoomPlus();
        plus.dispatchEvent(
          new Event('click', { bubbles: true })
        );
      });
      expect(setZoom.mock.calls.length).toBe(1);
      let c = setZoom.mock.calls[0];
      expect(c[0]).toBe(_ZOOMS[6]);
    });

    it('handles largest predefined zoom prop', () => {
      let setZoom = jest.fn();
      let largest = _ZOOMS[_ZOOMS.length - 1];
      act(() => {
        render(
          <Infobar
            drawingIsEmpty={false}
            zoom={largest}
            setZoom={setZoom}
          />,
          container,
        );
        let plus = getZoomPlus();
        plus.dispatchEvent(
          new Event('click', { bubbles: true })
        );
      });
      expect(setZoom.mock.calls.length).toBe(1);
      let c = setZoom.mock.calls[0];
      expect(c[0]).toBe(largest);
    });

    it('handles zoom prop between predefined zooms', () => {
      let setZoom = jest.fn();
      let z = (_ZOOMS[5] + _ZOOMS[6]) / 2;
      act(() => {
        render(
          <Infobar
            drawingIsEmpty={false}
            zoom={z}
            setZoom={setZoom}
          />,
          container,
        );
        let plus = getZoomPlus();
        plus.dispatchEvent(
          new Event('click', { bubbles: true })
        );
      });
      expect(setZoom.mock.calls.length).toBe(1);
      let c = setZoom.mock.calls[0];
      expect(c[0]).toBe(_ZOOMS[6]);
    });

    it('handles zoom prop smaller than any predefined zoom', () => {
      let setZoom = jest.fn();
      let z = _ZOOMS[0] / 2;
      act(() => {
        render(
          <Infobar
            drawingIsEmpty={false}
            zoom={z}
            setZoom={setZoom}
          />,
          container,
        );
        let plus = getZoomPlus();
        plus.dispatchEvent(
          new Event('click', { bubbles: true })
        );
      });
      expect(setZoom.mock.calls.length).toBe(1);
      let c = setZoom.mock.calls[0];
      expect(c[0]).toBe(_ZOOMS[0]);
    });

    it('handles zoom prop bigger than any predefined zoom', () => {
      let setZoom = jest.fn();
      let z = 2 * _ZOOMS[_ZOOMS.length - 1];
      act(() => {
        render(
          <Infobar
            drawingIsEmpty={false}
            zoom={z}
            setZoom={setZoom}
          />,
          container,
        );
        let plus = getZoomPlus();
        plus.dispatchEvent(
          new Event('click', { bubbles: true })
        );
      });
      expect(setZoom.mock.calls.length).toBe(1);
      let c = setZoom.mock.calls[0];
      expect(c[0]).toBe(_ZOOMS[_ZOOMS.length - 1]);
    });
  });
});
