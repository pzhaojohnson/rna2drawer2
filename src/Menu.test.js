import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import { Menu } from './Menu';

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

function getFileOpenCtButton() {
  let droppedComps = getFileDroppedComps();
  return droppedComps.childNodes[2];
}

function getFileOpenRna2drawerButton() {
  let droppedComps = getFileDroppedComps();
  return droppedComps.childNodes[3];
}

function getFileSaveButton() {
  let droppedComps = getFileDroppedComps();
  return droppedComps.childNodes[5];
}

function getExportDropdown() {
  let c = getComponent();
  return c.childNodes[2];
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
  let openCt = getFileOpenCtButton();
  expect(openCt.style.color).toBe('black');
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
  let openCt = getFileOpenCtButton();
  expect(openCt.style.color).toBe('gray');
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

describe('handles openCt callback', () => {
  it('binds openCt callback when drawing is empty', () => {
    let openCt = jest.fn();
    act(() => {
      render(
        <Menu
          drawingIsEmpty={true}
          openCt={openCt}
        />,
        container,
      );
    });
    expect(openCt.mock.calls.length).toBe(0);
    act(() => {
      let openCt = getFileOpenCtButton();
      openCt.dispatchEvent(
        new Event('click', { bubbles: true })
      );
    });
    expect(openCt.mock.calls.length).toBe(1);
  });

  it('does not bind openCt callback when drawing is not empty', () => {
    let openCt = jest.fn();
    act(() => {
      render(
        <Menu
          drawingIsEmpty={false}
          openCt={openCt}
        />,
        container,
      );
    });
    expect(openCt.mock.calls.length).toBe(0);
    act(() => {
      let openCt = getFileOpenCtButton();
      openCt.dispatchEvent(
        new Event('click', { bubbles: true })
      );
    });
    expect(openCt.mock.calls.length).toBe(0);
  });

  it('handles undefined openCt callback', () => {
    act(() => {
      render(<Menu drawingIsEmpty={false} />, container);
      let openCt = getFileOpenCtButton();
      openCt.dispatchEvent(
        new Event('click', { bubbles: true })
      );
    });
  });
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
