import React from 'react';
import { render, unmountComponentAtNode, createPortal } from 'react-dom';
import { act } from 'react-dom/test-utils';

import Menu from './Menu';

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

function getFileDropdown() {
  let c = getComponent();
  return c.childNodes[1];
}

function getFileTopButton() {
  let dropdown = getFileDropdown();
  return dropdown.childNodes[0];
}

function getFileDroppedComps() {
  let dropdown = getFileDropdown();
  return dropdown.childNodes[1];
}

function getFileNewButton() {
  let droppedComps = getFileDroppedComps();
  return droppedComps.childNodes[0];
}

function getFileOpenRna2drawerButton() {
  let droppedComps = getFileDroppedComps();
  return droppedComps.childNodes[1];
}

function getFileSaveButton() {
  let droppedComps = getFileDroppedComps();
  return droppedComps.childNodes[2];
}

function getEditDropdown() {
  let c = getComponent();
  return c.childNodes[2];
}

function getEditTopButtn() {
  let dropdown = getEditDropdown();
  return dropdown.childNodes[0];
}

function getEditDroppedComps() {
  let dropdown = getEditDropdown();
  return dropdown.childNodes[1];
}

function getEditUndoButton() {
  let droppedComps = getEditDroppedComps();
  return droppedComps.childNodes[0];
}

function getEditRedoButton() {
  let droppedComps = getEditDroppedComps();
  return droppedComps.childNodes[1];
}

function getExportDropdown() {
  let c = getComponent();
  return c.childNodes[3];
}

function getExportTopButton() {
  let dropdown = getExportDropdown();
  return dropdown.childNodes[0];
}

function getExportDroppedComps() {
  let dropdown = getExportDropdown();
  return dropdown.childNodes[1];
}

function getExportSvgButton() {
  let droppedComps = getExportDroppedComps();
  return droppedComps.childNodes[0];
}

function getExportPptxButton() {
  let droppedComps = getExportDroppedComps();
  return droppedComps.childNodes[1];
}

it('renders file dropdown when drawing is empty', () => {
  act(() => {
    render(
      <Menu
        buttonColor={'black'}
        disabledButtonColor={'gray'}
        drawingIsEmpty={true}
      />,
      container,
    );
  });
  let top = getFileTopButton();
  expect(top.style.color).toBe('black');
  let _new = getFileNewButton();
  expect(_new.style.color).toBe('black');
  let openRna2drawer = getFileOpenRna2drawerButton();
  expect(openRna2drawer.style.color).toBe('black');
  let save = getFileSaveButton();
  expect(save.style.color).toBe('gray');
});

it('renders file dropdown when drawing is not empty', () => {
  act(() => {
    render(
      <Menu
        buttonColor={'black'}
        disabledButtonColor={'gray'}
        drawingIsEmpty={false}
      />,
      container,
    );
  });
  let top = getFileTopButton();
  expect(top.style.color).toBe('black');
  let _new = getFileNewButton();
  expect(_new.style.color).toBe('black');
  let openRna2drawer = getFileOpenRna2drawerButton();
  expect(openRna2drawer.style.color).toBe('gray');
  let save = getFileSaveButton();
  expect(save.style.color).toBe('black');
});

describe('handles createNewDrawing callback', () => {
  it('binds createNewDrawing callback when drawing is empty', () => {
    let createNewDrawing = jest.fn();
    act(() => {
      render(
        <Menu
          drawingIsEmpty={true}
          createNewDrawing={createNewDrawing}
        />,
        container,
      );
    });
    expect(createNewDrawing.mock.calls.length).toBe(0);
    act(() => {
      let _new = getFileNewButton();
      _new.dispatchEvent(
        new Event('click', { bubbles: true })
      );
    });
    expect(createNewDrawing.mock.calls.length).toBe(1);
  });

  it('also binds createNewDrawing callback when drawing is not empty', () => {
    let createNewDrawing = jest.fn();
    act(() => {
      render(
        <Menu
          drawingIsEmpty={false}
          createNewDrawing={createNewDrawing}
        />,
        container,
      );
    });
    expect(createNewDrawing.mock.calls.length).toBe(0);
    act(() => {
      let _new = getFileNewButton();
      _new.dispatchEvent(
        new Event('click', { bubbles: true })
      );
    });
    expect(createNewDrawing.mock.calls.length).toBe(1);
  });

  it('handles undefined createNewDrawing callback', () => {
    act(() => {
      render(<Menu drawingIsEmpty={true} />, container);
      let _new = getFileNewButton();
      _new.dispatchEvent(
        new Event('click', { bubbles: true })
      );
    });
  });
});

describe('handling of save callback', () => {
  it('does not bind save callback when drawing is empty', () => {
    let save = jest.fn();
    act(() => {
      render(
        <Menu
          drawingIsEmpty={true}
          save={save}
        />,
        container,
      );
    });
    act(() => {
      let button = getFileSaveButton();
      button.dispatchEvent(
        new Event('click', { bubbles: true })
      );
    });
    expect(save.mock.calls.length).toBe(0);
  });

  it('binds save callback when drawing is not empty', () => {
    let save = jest.fn();
    act(() => {
      render(
        <Menu
          drawingIsEmpty={false}
          save={save}
        />,
        container,
      );
    });
    act(() => {
      let button = getFileSaveButton();
      button.dispatchEvent(
        new Event('click', { bubbles: true })
      );
    });
    expect(save.mock.calls.length).toBe(1);
  });

  it('handles undefined save callback', () => {
    act(() => {
      render(<Menu drawingIsEmpty={false} />, container);
      let button = getFileSaveButton();
      button.dispatchEvent(
        new Event('click', { bubbles: true })
      );
    });
  });
});

it('renders edit dropdown when drawing is empty', () => {
  act(() => {
    render(
      <Menu
        buttonColor={'black'}
        disabledButtonColor={'gray'}
        drawingIsEmpty={true}
      />,
      container,
    );
  });
  let top = getEditTopButtn();
  expect(top.style.color).toBe('gray');
  let droppedComps = getEditDroppedComps();
  expect(droppedComps.childNodes.length).toBe(0);
});

it('renders edit dropdown when drawing is not empty', () => {
  act(() => {
    render(
      <Menu
        buttonColor={'black'}
        disabledButtonColor={'gray'}
        drawingIsEmpty={false}
      />,
      container,
    );
  });
  let top = getEditTopButtn();
  expect(top.style.color).toBe('black');
  let droppedComps = getEditDroppedComps();
  expect(droppedComps.childNodes.length).toBeGreaterThan(0);
});

it('renders export dropdown when drawing is empty', () => {
  act(() => {
    render(
      <Menu
        buttonColor={'black'}
        disabledButtonColor={'gray'}
        drawingIsEmpty={true}
      />,
      container,
    );
  });
  let top = getExportTopButton();
  expect(top.style.color).toBe('gray');
  let droppedComps = getExportDroppedComps();
  expect(droppedComps.childNodes.length).toBe(0);
});

it('renders export dropdown when drawing is not empty', () => {
  act(() => {
    render(
      <Menu
        buttonColor={'black'}
        disabledButtonColor={'gray'}
        drawingIsEmpty={false}
      />,
      container,
    );
  });
  let top = getExportTopButton();
  expect(top.style.color).toBe('black');
  let exportSvg = getExportSvgButton();
  expect(exportSvg.style.color).toBe('black');
  let exportPptx = getExportPptxButton();
  expect(exportPptx.style.color).toBe('black');
});

describe('handles exportSvg callback', () => {
  it('does not bind exportSvg callback when drawing is empty', () => {
    let exportSvg = jest.fn();
    act(() => {
      render(
        <Menu
          drawingIsEmpty={true}
          exportSvg={exportSvg}
        />,
        container,
      );
    });
    let button = getExportSvgButton();
    expect(button).toBeFalsy();
  });

  it('binds exportSvg callback when drawing is not empty', () => {
    let exportSvg = jest.fn();
    act(() => {
      render(
        <Menu
          drawingIsEmpty={false}
          exportSvg={exportSvg}
        />,
        container,
      );
    });
    expect(exportSvg.mock.calls.length).toBe(0);
    act(() => {
      let button = getExportSvgButton();
      button.dispatchEvent(
        new Event('click', { bubbles: true })
      );
    });
    expect(exportSvg.mock.calls.length).toBe(1);
  });

  it('handles undefined exportSvg callback', () => {
    act(() => {
      render(<Menu drawingIsEmpty={false} />, container);
      let button = getExportSvgButton();
      button.dispatchEvent(
        new Event('click', { bubbles: true })
      );
    });
  });
});

describe('handles exportPptx callback', () => {
  it('does not bind exportPptx callback when drawing is empty', () => {
    let exportPptx = jest.fn();
    act(() => {
      render(
        <Menu
          drawingIsEmpty={true}
          exportPptx={exportPptx}
        />,
        container,
      );
    });
    let button = getExportPptxButton();
    expect(button).toBeFalsy();
  });

  it('binds exportPptx callback when drawing is not empty', () => {
    let exportPptx = jest.fn();
    act(() => {
      render(
        <Menu
          drawingIsEmpty={false}
          exportPptx={exportPptx}
        />,
        container,
      );
    });
    expect(exportPptx.mock.calls.length).toBe(0);
    act(() => {
      let button = getExportPptxButton();
      button.dispatchEvent(
        new Event('click', { bubbles: true })
      );
    });
    expect(exportPptx.mock.calls.length).toBe(1);
  });

  it('handles undefined exportPptx callback', () => {
    act(() => {
      render(<Menu drawingIsEmpty={false} />, container);
      let button = getExportPptxButton();
      button.dispatchEvent(
        new Event('click', { bubbles: true })
      );
    });
  });
});
