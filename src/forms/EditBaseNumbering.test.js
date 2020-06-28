import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { fireEvent } from '@testing-library/react';
import EditBaseNumbering from './EditBaseNumbering';

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
  return getComponent().childNodes[0];
}

function getTitleAndContent() {
  return getComponent().childNodes[1];
}

function getOffsetField() {
  return getTitleAndContent().childNodes[1];
}

function getOffsetInput() {
  return getOffsetField().childNodes[1];
}

function getAnchorField() {
  return getTitleAndContent().childNodes[2];
}

function getAnchorInput() {
  return getAnchorField().childNodes[1];
}

function getIncrementField() {
  return getTitleAndContent().childNodes[3];
}

function getIncrementInput() {
  return getIncrementField().childNodes[1];
}

function getErrorMessageSection() {
  return getTitleAndContent().childNodes[4];
}

function getApplySection() {
  return getTitleAndContent().childNodes[5];
}

function getApplyButton() {
  return getApplySection().childNodes[0];
}

describe('close button', () => {
  it('binds close callback', () => {
    let close = jest.fn();
    act(() => {
      render(<EditBaseNumbering close={close} />, container);
    });
    let cb = getCloseButton();
    expect(close).not.toHaveBeenCalled();
    act(() => {
      cb.dispatchEvent(new Event('click', { bubbles: true }));
    });
    expect(close).toHaveBeenCalled();
  });

  it('handles missing close callback', () => {
    act(() => {
      render(<EditBaseNumbering />, container);
    });
    let cb = getCloseButton();
    act(() => {
      cb.dispatchEvent(new Event('click', { bubbles: true }));
    });
  });
});

describe('offset field', () => {
  it('shows offset prop', () => {
    act(() => {
      render(<EditBaseNumbering offset={112} />, container);
    });
    expect(getOffsetInput().value).toBe('112');
  });

  it('can be changed', () => {
    act(() => {
      render(<EditBaseNumbering />, container);
      let oi = getOffsetInput();
      fireEvent.change(oi, { target: { value: '301' } });
    });
    expect(getOffsetInput().value).toBe('301');
  });

  it('value is passed to apply callback', () => {
    let apply = jest.fn();
    act(() => {
      render(<EditBaseNumbering apply={apply} />, container);
      let oi = getOffsetInput();
      fireEvent.change(oi, { target: { value: '1018' } });
    });
    act(() => {
      let ab = getApplyButton();
      ab.dispatchEvent(new Event('click', { bubbles: true }));
    });
    expect(apply.mock.calls[0][0].offset).toBe(1018);
  });

  describe('rejects invalid input', () => {
    it('empty input', () => {
      let apply = jest.fn();
      act(() => {
        render(<EditBaseNumbering anchor={0} increment={20} apply={apply} />, container);
        let oi = getOffsetInput();
        fireEvent.change(oi, { target: { value: '' } });
      });
      let ab = getApplyButton();
      expect(getErrorMessageSection().textContent).toBeFalsy();
      act(() => {
        ab.dispatchEvent(new Event('click', { bubbles: true }));
      });
      expect(apply).not.toHaveBeenCalled();
      expect(getErrorMessageSection().textContent).toBeTruthy();
    });

    it('not a number', () => {
      let apply = jest.fn();
      act(() => {
        render(<EditBaseNumbering anchor={0} increment={20} apply={apply} />, container);
        let oi = getOffsetInput();
        fireEvent.change(oi, { target: { value: 'asdf' } });
      });
      let ab = getApplyButton();
      expect(getErrorMessageSection().textContent).toBeFalsy();
      act(() => {
        ab.dispatchEvent(new Event('click', { bubbles: true }));
      });
      expect(apply).not.toHaveBeenCalled();
      expect(getErrorMessageSection().textContent).toBeTruthy();
    });

    it('not an integer', () => {
      let apply = jest.fn();
      act(() => {
        render(<EditBaseNumbering anchor={0} increment={20} apply={apply} />, container);
        let oi = getOffsetInput();
        fireEvent.change(oi, { target: { value: '1.1' } });
      });
      let ab = getApplyButton();
      expect(getErrorMessageSection().textContent).toBeFalsy();
      act(() => {
        ab.dispatchEvent(new Event('click', { bubbles: true }));
      });
      expect(apply).not.toHaveBeenCalled();
      expect(getErrorMessageSection().textContent).toBeTruthy();
    });
  });
});

describe('anchor field', () => {
  it('shows anchor prop', () => {
    act(() => {
      render(<EditBaseNumbering anchor={-57} />, container);
    });
    expect(getAnchorInput().value).toBe('-57');
  });

  it('can be changed', () => {
    act(() => {
      render(<EditBaseNumbering />, container);
      let ai = getAnchorInput();
      fireEvent.change(ai, { target: { value: '558' } });
    });
    expect(getAnchorInput().value).toBe('558');
  });

  it('value is passed to apply callback', () => {
    let apply = jest.fn();
    act(() => {
      render(<EditBaseNumbering offset={94} apply={apply} />, container);
      let oi = getOffsetInput();
      fireEvent.change(oi, { target: { value: '152' } });
      let ai = getAnchorInput();
      fireEvent.change(ai, { target: { value: '112' } });
    });
    act(() => {
      let ab = getApplyButton();
      ab.dispatchEvent(new Event('click', { bubbles: true }));
    });
    expect(apply).toHaveBeenCalled();
    // is offset by the offset prop (not the entered offset)
    expect(apply.mock.calls[0][0].anchor).toBe(18);
  });

  describe('rejects invalid input', () => {
    it('empty input', () => {
      let apply = jest.fn();
      act(() => {
        render(<EditBaseNumbering offset={0} increment={20} apply={apply} />, container);
        let ai = getAnchorInput();
        fireEvent.change(ai, { target: { value: '' } });
      });
      let ab = getApplyButton();
      expect(getErrorMessageSection().textContent).toBeFalsy();
      act(() => {
        ab.dispatchEvent(new Event('click', { bubbles: true }));
      });
      expect(apply).not.toHaveBeenCalled();
      expect(getErrorMessageSection().textContent).toBeTruthy();
    });

    it('not a number', () => {
      let apply = jest.fn();
      act(() => {
        render(<EditBaseNumbering offset={0} increment={20} apply={apply} />, container);
        let ai = getAnchorInput();
        fireEvent.change(ai, { target: { value: 'zxcv' } });
      });
      let ab = getApplyButton();
      expect(getErrorMessageSection().textContent).toBeFalsy();
      act(() => {
        ab.dispatchEvent(new Event('click', { bubbles: true }));
      });
      expect(apply).not.toHaveBeenCalled();
      expect(getErrorMessageSection().textContent).toBeTruthy();
    });

    it('not an integer', () => {
      let apply = jest.fn();
      act(() => {
        render(<EditBaseNumbering offset={0} increment={20} apply={apply} />, container);
        let ai = getAnchorInput();
        fireEvent.change(ai, { target: { value: '10.9' } });
      });
      let ab = getApplyButton();
      expect(getErrorMessageSection().textContent).toBeFalsy();
      act(() => {
        ab.dispatchEvent(new Event('click', { bubbles: true }));
      });
      expect(apply).not.toHaveBeenCalled();
      expect(getErrorMessageSection().textContent).toBeTruthy();
    });
  });
});

describe('increment field', () => {
  it('shows increment prop', () => {
    act(() => {
      render(<EditBaseNumbering increment={109} />, container);
    });
    expect(getIncrementInput().value).toBe('109');
  });

  it('can be changed', () => {
    act(() => {
      render(<EditBaseNumbering />, container);
      let ii = getIncrementInput();
      fireEvent.change(ii, { target: { value: '259' } });
    });
    expect(getIncrementInput().value).toBe('259');
  });

  it('value is passed to apply callback', () => {
    let apply = jest.fn();
    act(() => {
      render(<EditBaseNumbering apply={apply} />, container);
      let ii = getIncrementInput();
      fireEvent.change(ii, { target: { value: '1012' } });
    });
    act(() => {
      let ab = getApplyButton();
      ab.dispatchEvent(new Event('click', { bubbles: true }));
    });
    expect(apply).toHaveBeenCalled();
    expect(apply.mock.calls[0][0].increment).toBe(1012);
  });

  describe('rejects invalid input', () => {
    it('empty input', () => {
      let apply = jest.fn();
      act(() => {
        render(<EditBaseNumbering offset={0} anchor={0} apply={apply} />, container);
        let ii = getIncrementInput();
        fireEvent.change(ii, { target: { value: '' } });
      });
      let ab = getApplyButton();
      expect(getErrorMessageSection().textContent).toBeFalsy();
      act(() => {
        ab.dispatchEvent(new Event('click', { bubbles: true }));
      });
      expect(apply).not.toHaveBeenCalled();
      expect(getErrorMessageSection().textContent).toBeTruthy();
    });

    it('not a number', () => {
      let apply = jest.fn();
      act(() => {
        render(<EditBaseNumbering offset={0} anchor={0} apply={apply} />, container);
        let ii = getIncrementInput();
        fireEvent.change(ii, { target: { value: 'qwer' } });
      });
      let ab = getApplyButton();
      expect(getErrorMessageSection().textContent).toBeFalsy();
      act(() => {
        ab.dispatchEvent(new Event('click', { bubbles: true }));
      });
      expect(apply).not.toHaveBeenCalled();
      expect(getErrorMessageSection().textContent).toBeTruthy();
    });

    it('not an integer', () => {
      let apply = jest.fn();
      act(() => {
        render(<EditBaseNumbering offset={0} anchor={0} apply={apply} />, container);
        let ii = getIncrementInput();
        fireEvent.change(ii, { target: { value: '10.2' } });
      });
      let ab = getApplyButton();
      expect(getErrorMessageSection().textContent).toBeFalsy();
      act(() => {
        ab.dispatchEvent(new Event('click', { bubbles: true }));
      });
      expect(apply).not.toHaveBeenCalled();
      expect(getErrorMessageSection().textContent).toBeTruthy();
    });

    it('a negative integer', () => {
      let apply = jest.fn();
      act(() => {
        render(<EditBaseNumbering offset={0} anchor={0} apply={apply} />, container);
        let ii = getIncrementInput();
        fireEvent.change(ii, { target: { value: -1 } });
      });
      let ab = getApplyButton();
      expect(getErrorMessageSection().textContent).toBeFalsy();
      act(() => {
        ab.dispatchEvent(new Event('click', { bubbles: true }));
      });
      expect(apply).not.toHaveBeenCalled();
      expect(getErrorMessageSection().textContent).toBeTruthy();
    });

    it('zero', () => {
      let apply = jest.fn();
      act(() => {
        render(<EditBaseNumbering offset={0} anchor={0} apply={apply} />, container);
        let ii = getIncrementInput();
        fireEvent.change(ii, { target: { value: '0' } });
      });
      let ab = getApplyButton();
      expect(getErrorMessageSection().textContent).toBeFalsy();
      act(() => {
        ab.dispatchEvent(new Event('click', { bubbles: true }));
      });
      expect(apply).not.toHaveBeenCalled();
      expect(getErrorMessageSection().textContent).toBeTruthy();
    });
  });
});

it('handles missing apply callback', () => {
  act(() => {
    render(<EditBaseNumbering offset={0} anchor={0} increment={20} />, container);
  });
  act(() => {
    let ab = getApplyButton();
    ab.dispatchEvent(new Event('click', { bubbles: true }));
  });
});

it('applying valid input clears any error message', () => {
  act(() => {
    render(<EditBaseNumbering />, container);
    let oi = getOffsetInput();
    fireEvent.change(oi, { target: { value: 'asdf' } });
  });
  let ab = getApplyButton();
  act(() => {
    ab.dispatchEvent(new Event('click', { bubbles: true }));
  });
  expect(getErrorMessageSection().textContent).toBeTruthy();
  act(() => {
    let oi = getOffsetInput();
    fireEvent.change(oi, { target: { value: '0' } });
  });
  act(() => {
    ab.dispatchEvent(new Event('click', { bubbles: true }));
  });
  expect(getErrorMessageSection().textContent).toBeFalsy();
});
