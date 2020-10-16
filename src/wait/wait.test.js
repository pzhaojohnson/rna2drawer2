import {
  makeUserWait,
  stopMakingUserWait,
  makeUserWaitFor,
} from './wait';

function numOtherNodesInBody(nodes) {
  let num = 0;
  document.body.childNodes.forEach(nd => {
    if (!nodes.includes(nd)) {
      num++;
    }
  });
  return num;
}

function bodyHasNoOtherNodes(nodes) {
  return numOtherNodesInBody(nodes) == 0;
}

describe('makeUserWait function', () => {
  it('does not make multiple overlays when called repeatedly', () => {
    let nodes = [...document.body.childNodes];
    makeUserWait();
    expect(numOtherNodesInBody(nodes)).toBe(1);
    makeUserWait();
    expect(numOtherNodesInBody(nodes)).toBe(1);
    makeUserWait();
    expect(numOtherNodesInBody(nodes)).toBe(1);
  });
});

describe('stopMakingUserWait function', () => {
  it('removes overlay', () => {
    let nodes = [...document.body.childNodes];
    makeUserWait();
    stopMakingUserWait();
    expect(bodyHasNoOtherNodes(nodes)).toBeTruthy();
  });

  it('works after multiple calls to makeUserWait', () => {
    let nodes = [...document.body.childNodes];
    makeUserWait();
    makeUserWait();
    makeUserWait();
    // would not work if each call to makeUserWait created a new overlay
    stopMakingUserWait();
    expect(bodyHasNoOtherNodes(nodes)).toBeTruthy(); // removed overlay
  });

  it('can be called after no calls to makeUserWait', () => {
    expect(() => stopMakingUserWait()).not.toThrow();
  });
});

describe('makeUserWaitFor function', () => {
  it('calls the given function', () => {
    let f = jest.fn();
    makeUserWaitFor(f);
    expect(f).toHaveBeenCalled();
  });

  it('stops making the user wait', () => {
    let nodes = [...document.body.childNodes];
    makeUserWaitFor(jest.fn());
    expect(bodyHasNoOtherNodes(nodes)).toBeTruthy();
  });

  it('the given function can throw', () => {
    let f = jest.fn(() => { throw 'error' });
    expect(() => makeUserWaitFor(f)).not.toThrow();
  });
});
