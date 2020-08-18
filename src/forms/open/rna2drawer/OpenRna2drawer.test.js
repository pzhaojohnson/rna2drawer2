import React from 'react';
import { shallow, mount, render } from 'enzyme';
const fs = require('fs');

import OpenRna2drawer from './OpenRna2drawer';

function getComponent(componentWrapper) {
  return componentWrapper.getDOMNode();
}

function getBoundingDivs(componentWrapper) {
  let c = getComponent(componentWrapper);
  return c.childNodes[0];
}

function getTitleAndContent(componentWrapper) {
  let divs = getBoundingDivs(componentWrapper);
  return divs.childNodes[0].childNodes[0];
}

function getContent(componentWrapper) {
  let tc = getTitleAndContent(componentWrapper);
  return tc.childNodes[1];
}

function getErrorSection(componentWrapper) {
  let c = getContent(componentWrapper);
  return c.childNodes[1];
}

function getFileInputWrapper(componentWrapper) {
  return componentWrapper.find({ type: 'file' });
}

function getSubmitButtonWrapper(componentWrapper) {
  return componentWrapper.find('button');
}

it('renders', () => {
  mount(<OpenRna2drawer />);
});

it('resets error message when file is uploaded', () => {
  let wrapper = mount(<OpenRna2drawer />);
  let sb = getSubmitButtonWrapper(wrapper);
  sb.simulate('click', { target: {} });
  let es = getErrorSection(wrapper);
  expect(es.textContent).toBeTruthy();
  let fi = getFileInputWrapper(wrapper);
  let b = new Blob(['asdf']);
  let f = new File([b], 'asdf');
  fi.simulate('change', { target: { files: [f] } });
  es = getErrorSection(wrapper);
  expect(es.textContent).toBeFalsy();
});

it('handles no file upload', () => {
  let submit = jest.fn();
  let noFileUploaded = 'No file uploaded.';
  let wrapper = mount(
    <OpenRna2drawer
      submit={submit}
      errorMessages={{ noFileUploaded: noFileUploaded }}
    />
  );
  let sb = getSubmitButtonWrapper(wrapper);
  sb.simulate('click', { target: {} });
  let es = getErrorSection(wrapper);
  expect(es.textContent).toBe(noFileUploaded);
  expect(submit.mock.calls.length).toBe(0); // does not call
});

it('handles empty files list', () => {
  let submit = jest.fn();
  let noFileUploaded = 'No file uploaded.';
  let wrapper = mount(
    <OpenRna2drawer
      submit={submit}
      errorMessages={{ noFileUploaded: noFileUploaded }}
    />
  );
  let fi = getFileInputWrapper(wrapper);
  fi.simulate('change', { target: { files: [] } });
  let es = getErrorSection(wrapper);
  expect(es.textContent).toBeFalsy();
  let sb = getSubmitButtonWrapper(wrapper);
  sb.simulate('click', { target: {} });
  es = getErrorSection(wrapper);
  expect(es.textContent).toBe(noFileUploaded);
  expect(submit.mock.calls.length).toBe(0); // does not call
});

it('handles upload error', () => {
  window.FileReader = () => {
    return {
      addEventListener: (_, callback) => {}, // does not call callback
      readAsText: () => {},
      result: null,
    };
  };
  let submit = jest.fn();
  let fileUploadError = 'File upload error.';
  let wrapper = mount(
    <OpenRna2drawer
      submit={submit}
      errorMessages={{ fileUploadError: fileUploadError }}
    />
  );
  let fi = getFileInputWrapper(wrapper);
  let b = new Blob(['asdf']);
  let f = new File([b], 'asdf');
  fi.simulate('change', { target: { files: [f] } });
  let sb = getSubmitButtonWrapper(wrapper);
  sb.simulate('click', { target: {} });
  let es = getErrorSection(wrapper);
  expect(es.textContent).toBe(fileUploadError);
  expect(submit.mock.calls.length).toBe(0); // does not call
});

it('handles files of wrong type', () => {
  window.FileReader = () => {
    return {
      addEventListener: (_, callback) => { callback() },
      readAsText: () => {},
      result: 'qwer',
    };
  };
  let submit = jest.fn();
  let wrongFileType = 'Wrong file type.';
  let wrapper = mount(
    <OpenRna2drawer
      submit={submit}
      errorMessages={{ wrongFileType: wrongFileType }}
    />
  );
  let fi = getFileInputWrapper(wrapper);
  let b = new Blob(['qwer']);
  let f = new File([b], 'qwer.asdfqwer');
  fi.simulate('change', { target: { files: [f] } });
  let sb = getSubmitButtonWrapper(wrapper);
  sb.simulate('click', { target: {} });
  let es = getErrorSection(wrapper);
  expect(es.textContent).toBe(wrongFileType);
  expect(submit.mock.calls.length).toBe(0); // does not call
});

it('handles rejection by submit callback', () => {
  let savedState = { blah: 1234 };
  let fileContents = JSON.stringify(savedState);
  window.FileReader = () => {
    return {
      addEventListener: (_, callback) => { callback() },
      readAsText: () => {},
      result: fileContents,
    };
  };
  let submit = jest.fn(() => false);
  let invalidFile = 'Invalid file.';
  let wrapper = mount(
    <OpenRna2drawer
      submit={submit}
      errorMessages={{ invalidFile: invalidFile }}
    />
  );
  let fi = getFileInputWrapper(wrapper);
  let b = new Blob([fileContents]);
  let f = new File([b], 'zxcv.rna2drawer2');
  fi.simulate('change', { target: { files: [f] } });
  let sb = getSubmitButtonWrapper(wrapper);
  sb.simulate('click', { target: {} });
  expect(submit.mock.calls.length).toBe(1);
  let es = getErrorSection(wrapper);
  expect(es.textContent).toBe(invalidFile);
});

it('accepts .rna2drawer files', () => {
  let fileContents = 'asdfqqwweerr';
  window.FileReader = () => {
    return {
      addEventListener: (_, callback) => { callback() },
      readAsText: () => {},
      result: fileContents,
    };
  };
  let submit = jest.fn();
  let wrapper = mount(
    <OpenRna2drawer submit={submit} />
  );
  let fi = getFileInputWrapper(wrapper);
  let b = new Blob([fileContents]);
  let f = new File([b], 'aa.rna2drawer');
  fi.simulate('change', { target: { files: [f] } });
  let sb = getSubmitButtonWrapper(wrapper);
  sb.simulate('click', { target: {} });
  expect(submit.mock.calls.length).toBe(1);
  let c = submit.mock.calls[0];
  expect(c[0]).toBe(fileContents);
  expect(c[1]).toBe('rna2drawer');
});

it('accepts .rna2drawer2 files', () => {
  let fileContents = 'asdfqqwweerr';
  window.FileReader = () => {
    return {
      addEventListener: (_, callback) => { callback() },
      readAsText: () => {},
      result: fileContents,
    };
  };
  let submit = jest.fn();
  let wrapper = mount(
    <OpenRna2drawer submit={submit} />
  );
  let fi = getFileInputWrapper(wrapper);
  let b = new Blob([fileContents]);
  let f = new File([b], 'aa.rna2drawer2');
  fi.simulate('change', { target: { files: [f] } });
  let sb = getSubmitButtonWrapper(wrapper);
  sb.simulate('click', { target: {} });
  expect(submit.mock.calls.length).toBe(1);
  let c = submit.mock.calls[0];
  expect(c[0]).toBe(fileContents);
  expect(c[1]).toBe('rna2drawer2');
});

it('handles undefined submit callback', () => {
  let savedState = { blah: 1234 };
  let fileContents = JSON.stringify(savedState);
  window.FileReader = () => {
    return {
      addEventListener: (_, callback) => { callback() },
      readAsText: () => {},
      result: fileContents,
    };
  };
  let wrapper = mount(<OpenRna2drawer />);
  let fi = getFileInputWrapper(wrapper);
  let b = new Blob([fileContents]);
  let f = new File([b], 'asdf.rna2drawer2');
  fi.simulate('change', { target: { files: [f] } });
  let sb = getSubmitButtonWrapper(wrapper);
  sb.simulate('click', { target: {} });
});
