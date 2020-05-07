import React from 'react';
import { shallow, mount, render } from 'enzyme';
const fs = require('fs');

import { OpenCt } from './OpenCt';
import { parseCT } from '../parse/parseCT';

function getTitleAndContent(componentWrapper) {
  return componentWrapper.getDOMNode().childNodes[0].childNodes[0].childNodes[0];
}

function getContent(componentWrapper) {
  return getTitleAndContent(componentWrapper).childNodes[1];
}

function getErrorMessageSection(componentWrapper) {
  return getContent(componentWrapper).childNodes[2];
}

function getErrorMessageP(componentWrapper) {
  return getErrorMessageSection(componentWrapper).childNodes[0];
}

function getSequenceIdInputWrapper(componentWrapper) {
  return componentWrapper.find({ type: 'text' });
}

function getFileInputWrapper(componentWrapper) {
  return componentWrapper.find({ type: 'file' });
}

function getErrorMessagePWrapper(componentWrapper) {
  return componentWrapper.find('b');
}

function getSubmitButtonWrapper(componentWrapper) {
  return componentWrapper.find('button');
}

it('renders', () => {
  mount(<OpenCt />);
});

it('basic test of submitting sequence ID', () => {
  window.FileReader = () => {
    return {
      addEventListener: (_, callback) => { callback() },
      readAsText: () => {},
      result: '1 dG\n' + '1 A',
    };
  };
  let submit = jest.fn();
  let wrapper = mount(<OpenCt submit={submit} />);
  getSequenceIdInputWrapper(wrapper).simulate(
    'change',
    { target: { value: 'A Sequence ID' } },
  );
  getFileInputWrapper(wrapper).simulate(
    'change',
    { target: { files: [new Blob(['placeholder blob'])] } },
  );
  getSubmitButtonWrapper(wrapper).simulate(
    'click',
    { target: {} },
  );
  expect(getErrorMessagePWrapper(wrapper).length).toBe(0);
  expect(submit.mock.calls.length).toBe(1);
  expect(submit.mock.calls[0][0]).toBe('A Sequence ID');
});

it('empty sequence ID', () => {
  window.FileReader = () => {
    return {
      addEventListener: (_, callback) => { callback() },
      readAsText: () => {},
      result: '1 dG\n' + '1 A',
    };
  };
  let submit = jest.fn();
  let wrapper = mount(<OpenCt submit={submit} />);
  getSequenceIdInputWrapper(wrapper).simulate(
    'change',
    { target: { value: '' } },
  );
  getFileInputWrapper(wrapper).simulate(
    'change',
    { target: { files: [new Blob(['placeholder blob'])] } },
  );
  getSubmitButtonWrapper(wrapper).simulate(
    'click',
    { target: {} },
  );
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageSection(wrapper).id.length).toBeGreaterThan(0);
  expect(getErrorMessagePWrapper(wrapper).text()).toBe('Sequence ID is empty.');
});

it('sequence ID is all whitespace', () => {
  window.FileReader = () => {
    return {
      addEventListener: (_, callback) => { callback() },
      readAsText: () => {},
      result: '1 dG\n' + '1 A',
    };
  };
  let submit = jest.fn();
  let wrapper = mount(<OpenCt submit={submit} />);
  getSequenceIdInputWrapper(wrapper).simulate(
    'change',
    { target: { value: '  \t\t  \t' } },
  );
  getFileInputWrapper(wrapper).simulate(
    'change',
    { target: { files: [new Blob(['placeholder blob'])] } },
  );
  getSubmitButtonWrapper(wrapper).simulate(
    'click',
    { target: {} },
  );
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageSection(wrapper).id.length).toBeGreaterThan(0);
  expect(getErrorMessagePWrapper(wrapper).text()).toBe('Sequence ID is empty.');
});

it('leading and trailing whitespace is trimmed from sequence ID', () => {
  window.FileReader = () => {
    return {
      addEventListener: (_, callback) => { callback() },
      readAsText: () => {},
      result: '1 dG\n' + '1 A',
    };
  };
  let submit = jest.fn();
  let wrapper = mount(<OpenCt submit={submit} />);
  getSequenceIdInputWrapper(wrapper).simulate(
    'change',
    { target: { value: '  \tTrimmed Sequence ID  \t\t' } },
  );
  getFileInputWrapper(wrapper).simulate(
    'change',
    { target: { files: [new Blob(['placeholder blob'])] } },
  );
  getSubmitButtonWrapper(wrapper).simulate(
    'click',
    { target: {} },
  );
  expect(getErrorMessagePWrapper(wrapper).length).toBe(0);
  expect(submit.mock.calls.length).toBe(1);
  expect(submit.mock.calls[0][0]).toBe('Trimmed Sequence ID');
});

it('no file uploaded', () => {
  let submit = jest.fn();
  let wrapper = mount(<OpenCt submit={submit} />);
  getSequenceIdInputWrapper(wrapper).simulate(
    'change',
    { target: { value: 'asdf' } },
  );
  expect(getErrorMessagePWrapper(wrapper).length).toBe(0);
  getSubmitButtonWrapper(wrapper).simulate(
    'click',
    { target: {} },
  );
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageSection(wrapper).id.length).toBeGreaterThan(0);
  expect(getErrorMessagePWrapper(wrapper).text()).toBe('No file uploaded.');
});

it('files list is empty on file input change', () => {
  let submit = jest.fn();
  let wrapper = mount(<OpenCt submit={submit} />)
  getSequenceIdInputWrapper(wrapper).simulate(
    'change',
    { target: { value: 'asdf' } },
  );
  getFileInputWrapper(wrapper).simulate(
    'change',
    { target: { files: [] } },
  );
  expect(getErrorMessagePWrapper(wrapper).length).toBe(0);
  getSubmitButtonWrapper(wrapper).simulate(
    'click',
    { target: {} },
  );
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageSection(wrapper).id.length).toBeGreaterThan(0);
  expect(getErrorMessagePWrapper(wrapper).text()).toBe('No file uploaded.');
});

it('uploading a file clears error message', () => {
  window.FileReader = () => {
    return {
      addEventListener: (_, callback) => { callback() },
      readAsText: () => {},
      result: 'placeholder text',
    };
  };
  let submit = jest.fn();
  let wrapper = mount(<OpenCt submit={submit} />);
  getSubmitButtonWrapper(wrapper).simulate(
    'click',
    { target: {} },
  );
  expect(getErrorMessageSection(wrapper).id.length).toBeGreaterThan(0);
  expect(getErrorMessagePWrapper(wrapper).text()).toBe('Sequence ID is empty.');
  getFileInputWrapper(wrapper).simulate(
    'change',
    { target: { files: [new Blob(['placeholder blob'])] } },
  );
  expect(getErrorMessageSection(wrapper).id.length).toBeGreaterThan(0);
  expect(getErrorMessagePWrapper(wrapper).length).toBe(0);
});

it('unable to load file', () => {
  window.FileReader = () => {
    return {
      addEventListener: () => {}, // does not actually bind anything
      readAsText: () => {},
      result: null,
    };
  };
  let submit = jest.fn();
  let wrapper = mount(<OpenCt submit={submit} />);
  getSequenceIdInputWrapper(wrapper).simulate(
    'change',
    { target: { value: 'asdf' } },
  );
  getFileInputWrapper(wrapper).simulate(
    'change',
    { target: { files: [new Blob(['asdf'])] } },
  );
  expect(getErrorMessagePWrapper(wrapper).length).toBe(0);
  getSubmitButtonWrapper(wrapper).simulate(
    'click',
    { target: {} },
  );
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageSection(wrapper).id.length).toBeGreaterThan(0);
  expect(getErrorMessagePWrapper(wrapper).text()).toBe('Unable to read selected file.');
});

it('no structures in CT file', () => {
  window.FileReader = () => {
    return {
      addEventListener: (_, callback) => { callback() },
      readAsText: () => {},
      result: '',
    };
  };
  let submit = jest.fn();
  let wrapper = mount(<OpenCt submit={submit} />);
  getSequenceIdInputWrapper(wrapper).simulate(
    'change',
    { target: { value: 'asdf' } },
  );
  getFileInputWrapper(wrapper).simulate(
    'change',
    { target: { files: [new Blob(['placeholder blob'])] } },
  );
  expect(getErrorMessagePWrapper(wrapper).length).toBe(0);
  getSubmitButtonWrapper(wrapper).simulate(
    'click',
    { target: {} },
  );
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageSection(wrapper).id.length).toBeGreaterThan(0);
  expect(getErrorMessagePWrapper(wrapper).text()).toBe('No structure found in CT file.');
});

it('multiple structures in CT file', () => {
  window.FileReader = () => {
    return {
      addEventListener: (_, callback) => { callback() },
      readAsText: () => {},
      result: '128 3  1 5 9  dG [1234]\n',
    };
  };
  let submit = jest.fn();
  let wrapper = mount(<OpenCt submit={submit} />);
  getSequenceIdInputWrapper(wrapper).simulate(
    'change',
    { target: { value: 'asdf' } },
  );
  getFileInputWrapper(wrapper).simulate(
    'change',
    { target: { files: [new Blob(['placeholder blob'])] } },
  );
  expect(getErrorMessagePWrapper(wrapper).length).toBe(0);
  getSubmitButtonWrapper(wrapper).simulate(
    'click',
    { target: {} },
  );
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageSection(wrapper).id.length).toBeGreaterThan(0);
  expect(getErrorMessagePWrapper(wrapper).text()).toBe('Multiple structures in CT file.');
});

it('structure of length zero', () => {
  window.FileReader = () => {
    return {
      addEventListener: (_, callback) => { callback() },
      readAsText: () => {},
      result: '128 1  dG [1234]\n',
    };
  };
  let submit = jest.fn();
  let wrapper = mount(<OpenCt submit={submit} />);
  getSequenceIdInputWrapper(wrapper).simulate(
    'change',
    { target: { value: 'asdf' } },
  );
  getFileInputWrapper(wrapper).simulate(
    'change',
    { target: { files: [new Blob(['placeholder blob'])] } },
  );
  expect(getErrorMessagePWrapper(wrapper).length).toBe(0);
  getSubmitButtonWrapper(wrapper).simulate(
    'click',
    { target: {} },
  );
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageSection(wrapper).id.length).toBeGreaterThan(0);
  expect(getErrorMessagePWrapper(wrapper).text()).toBe('Structure has a length of zero.');
});

function checkPartners(partners, expectedPartners) {
  expect(partners.length).toBe(expectedPartners.length);
  for (let i = 0; i < expectedPartners.length; i++) {
    expect(partners[i]).toBe(expectedPartners[i]);
  }
}

it('handles a CT file downloaded from Mfold', () => {
  let data = fs.readFileSync('testinput/ct/ct0.ct', 'utf8');
  window.FileReader = () => {
    return {
      addEventListener: (_, callback) => { callback() },
      readAsText: () => {},
      result: data,
    };
  };
  let submit = jest.fn();
  let wrapper = mount(<OpenCt submit={submit} />);
  getSequenceIdInputWrapper(wrapper).simulate(
    'change',
    { target: { value: 'asdf' } },
  );
  getFileInputWrapper(wrapper).simulate(
    'change',
    { target: { files: [new Blob(['placeholder blob'])] } },
  );
  expect(getErrorMessagePWrapper(wrapper).length).toBe(0);
  getSubmitButtonWrapper(wrapper).simulate(
    'click',
    { target: {} },
  );
  expect(getErrorMessagePWrapper(wrapper).length).toBe(0);
  expect(submit.mock.calls.length).toBe(1);
  let ct = parseCT(data);
  expect(submit.mock.calls[0][0]).toBe('asdf');
  expect(submit.mock.calls[0][1]).toBe(ct.sequence);
  checkPartners(submit.mock.calls[0][2], ct.partners);
  expect(submit.mock.calls[0][3]).toBe(ct.numberingOffset);
});

it('no error message shown by default', () => {
  let wrapper = mount(<OpenCt />);
  expect(getErrorMessageSection(wrapper).id.length).toBeGreaterThan(0);
  expect(getErrorMessagePWrapper(wrapper).length).toBe(0);
});
