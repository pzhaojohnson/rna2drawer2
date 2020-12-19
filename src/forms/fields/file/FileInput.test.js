import React from 'react';
import { mount } from 'enzyme';
import { FileInput } from './FileInput';

it('file fails to load', () => {
  window.FileReader = () => {
    return {
      addEventListener: (_, listener) => {}, // doesn't call listener
      readAsText: () => {},
      result: null,
    };
  };
  let onLoadStart = jest.fn();
  let onLoad = jest.fn();
  let wrapper = mount(<FileInput onLoadStart={onLoadStart} onLoad={onLoad} />);
  let b = new Blob(['asdf']);
  let f = new File([b], 'asdf');
  expect(onLoadStart).not.toHaveBeenCalled();
  wrapper.simulate('change', { target: { files: [f] } });
  expect(onLoadStart).toHaveBeenCalled();
  expect(onLoad).not.toHaveBeenCalled();
});

it('file loads successfully', () => {
  let contents = 'asdfASDFqwerQWERzxcv';
  window.FileReader = () => {
    return {
      addEventListener: (_, listener) => { listener() },
      readAsText: () => {},
      result: contents,
    };
  };
  let onLoadStart = jest.fn();
  let onLoad = jest.fn();
  let wrapper = mount(<FileInput onLoadStart={onLoadStart} onLoad={onLoad} />);
  let b = new Blob([contents]);
  let f = new File([b], 'asdfASDF.qwerty');
  expect(onLoadStart).not.toHaveBeenCalled();
  wrapper.simulate('change', { target: { files: [f] } });
  expect(onLoadStart).toHaveBeenCalled();
  let c = onLoad.mock.calls[0];
  expect(c[0].name).toBe('asdfASDF.qwerty');
  expect(c[0].extension).toBe('qwerty');
  expect(c[0].contents).toBe(contents);
});

it('no file is uploaded', () => {
  let onLoadStart = jest.fn();
  mount(<FileInput onLoadStart={onLoadStart} onLoad={jest.fn()} />);
  expect(onLoadStart).not.toHaveBeenCalled();
});
