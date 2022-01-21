import { NodeSVG } from 'Draw/svg/NodeSVG';

import { SVGTextWrapper } from './text';

let container = null;
let svg = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  svg = NodeSVG();
  svg.addTo(container);
});

afterEach(() => {
  svg.clear();
  svg.remove();
  svg = null;

  container.remove();
  container = null;
});

describe('SVGTextWrapper class', () => {
  it('provides reference to wrapped text', () => {
    let text = svg.text('asdf');
    let wrapper = new SVGTextWrapper(text);
    expect(wrapper.wrapped).toBe(text);
  });

  test('method forwarding', () => {
    [
      {
        name: 'text',
        args: [],
      },
      {
        name: 'text',
        args: ['zxCV'],
      },
    ].forEach(({ name, args }) => {
      let text = svg.text('QWER');
      let wrapper = new SVGTextWrapper(text);

      let spy = jest.spyOn(text, name);
      expect(spy).not.toHaveBeenCalled();
      let result = wrapper[name](...args);

      // could have been called more than once
      // if the wrapped method uses recursion
      expect(spy).toHaveBeenCalled();

      // the first call should be the forwarded call
      expect(spy.mock.calls[0]).toEqual(args); // arguments were forwarded
      expect(result).toBe(spy.mock.results[0].value); // result was relayed
    });
  });
});
