import React from 'react';
import { shallow, mount, render } from 'enzyme';
const fs = require('fs');

import { OpenCT } from './OpenCT';
import { parseCT } from '../parse/parseCT';

function getSequenceIdInput(wrapper) {
  return wrapper.find({ type: 'text' });
}

function getFileInput(wrapper) {
  return wrapper.find({ type: 'file' });
}

function getErrorMessageP(wrapper) {
  return wrapper.find('b');
}

function getSubmitButton(wrapper) {
  return wrapper.find('button');
}

it('renders', () => {
  mount(<OpenCT />);
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
  let wrapper = mount(<OpenCT submit={submit} />);
  getSequenceIdInput(wrapper).simulate(
    'change',
    { target: { value: 'A Sequence ID' } },
  );
  getFileInput(wrapper).simulate(
    'change',
    { target: { files: [new Blob(['placeholder blob'])] } },
  );
  getSubmitButton(wrapper).simulate(
    'click',
    { target: {} },
  );
  expect(getErrorMessageP(wrapper).length).toBe(0);
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
  let wrapper = mount(<OpenCT submit={submit} />);
  getSequenceIdInput(wrapper).simulate(
    'change',
    { target: { value: '' } },
  );
  getFileInput(wrapper).simulate(
    'change',
    { target: { files: [new Blob(['placeholder blob'])] } },
  );
  getSubmitButton(wrapper).simulate(
    'click',
    { target: {} },
  );
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageP(wrapper).text()).toBe('Sequence ID is empty.');
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
  let wrapper = mount(<OpenCT submit={submit} />);
  getSequenceIdInput(wrapper).simulate(
    'change',
    { target: { value: '  \t\t  \t' } },
  );
  getFileInput(wrapper).simulate(
    'change',
    { target: { files: [new Blob(['placeholder blob'])] } },
  );
  getSubmitButton(wrapper).simulate(
    'click',
    { target: {} },
  );
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageP(wrapper).text()).toBe('Sequence ID is empty.');
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
  let wrapper = mount(<OpenCT submit={submit} />);
  getSequenceIdInput(wrapper).simulate(
    'change',
    { target: { value: '  \tTrimmed Sequence ID  \t\t' } },
  );
  getFileInput(wrapper).simulate(
    'change',
    { target: { files: [new Blob(['placeholder blob'])] } },
  );
  getSubmitButton(wrapper).simulate(
    'click',
    { target: {} },
  );
  expect(getErrorMessageP(wrapper).length).toBe(0);
  expect(submit.mock.calls.length).toBe(1);
  expect(submit.mock.calls[0][0]).toBe('Trimmed Sequence ID');
});

it('no file uploaded', () => {
  let submit = jest.fn();
  let wrapper = mount(<OpenCT submit={submit} />);
  getSequenceIdInput(wrapper).simulate(
    'change',
    { target: { value: 'asdf' } },
  );
  expect(getErrorMessageP(wrapper).length).toBe(0);
  getSubmitButton(wrapper).simulate(
    'click',
    { target: {} },
  );
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageP(wrapper).text()).toBe('No file uploaded.');
});

it('files list is empty on file input change', () => {
  let submit = jest.fn();
  let wrapper = mount(<OpenCT submit={submit} />)
  getSequenceIdInput(wrapper).simulate(
    'change',
    { target: { value: 'asdf' } },
  );
  getFileInput(wrapper).simulate(
    'change',
    { target: { files: [] } },
  );
  expect(getErrorMessageP(wrapper).length).toBe(0);
  getSubmitButton(wrapper).simulate(
    'click',
    { target: {} },
  );
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageP(wrapper).text()).toBe('No file uploaded.');
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
  let wrapper = mount(<OpenCT submit={submit} />);
  getSequenceIdInput(wrapper).simulate(
    'change',
    { target: { value: 'asdf' } },
  );
  getFileInput(wrapper).simulate(
    'change',
    { target: { files: [new Blob(['asdf'])] } },
  );
  expect(getErrorMessageP(wrapper).length).toBe(0);
  getSubmitButton(wrapper).simulate(
    'click',
    { target: {} },
  );
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageP(wrapper).text()).toBe('Unable to read selected file.');
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
  let wrapper = mount(<OpenCT submit={submit} />);
  getSequenceIdInput(wrapper).simulate(
    'change',
    { target: { value: 'asdf' } },
  );
  getFileInput(wrapper).simulate(
    'change',
    { target: { files: [new Blob(['placeholder blob'])] } },
  );
  expect(getErrorMessageP(wrapper).length).toBe(0);
  getSubmitButton(wrapper).simulate(
    'click',
    { target: {} },
  );
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageP(wrapper).text()).toBe('No structure found in CT file.');
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
  let wrapper = mount(<OpenCT submit={submit} />);
  getSequenceIdInput(wrapper).simulate(
    'change',
    { target: { value: 'asdf' } },
  );
  getFileInput(wrapper).simulate(
    'change',
    { target: { files: [new Blob(['placeholder blob'])] } },
  );
  expect(getErrorMessageP(wrapper).length).toBe(0);
  getSubmitButton(wrapper).simulate(
    'click',
    { target: {} },
  );
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageP(wrapper).text()).toBe('Multiple structures in CT file.');
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
  let wrapper = mount(<OpenCT submit={submit} />);
  getSequenceIdInput(wrapper).simulate(
    'change',
    { target: { value: 'asdf' } },
  );
  getFileInput(wrapper).simulate(
    'change',
    { target: { files: [new Blob(['placeholder blob'])] } },
  );
  expect(getErrorMessageP(wrapper).length).toBe(0);
  getSubmitButton(wrapper).simulate(
    'click',
    { target: {} },
  );
  expect(submit.mock.calls.length).toBe(0);
  expect(getErrorMessageP(wrapper).text()).toBe('Structure has a length of zero.');
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
  let wrapper = mount(<OpenCT submit={submit} />);
  getSequenceIdInput(wrapper).simulate(
    'change',
    { target: { value: 'asdf' } },
  );
  getFileInput(wrapper).simulate(
    'change',
    { target: { files: [new Blob(['placeholder blob'])] } },
  );
  expect(getErrorMessageP(wrapper).length).toBe(0);
  getSubmitButton(wrapper).simulate(
    'click',
    { target: {} },
  );
  expect(getErrorMessageP(wrapper).length).toBe(0);
  expect(submit.mock.calls.length).toBe(1);
  let ct = parseCT(data);
  expect(submit.mock.calls[0][0]).toBe('asdf');
  expect(submit.mock.calls[0][1]).toBe(ct.sequence);
  checkPartners(submit.mock.calls[0][2], ct.partners);
  expect(submit.mock.calls[0][3]).toBe(ct.numberingOffset);
});
