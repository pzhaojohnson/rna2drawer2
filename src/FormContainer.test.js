import * as React from 'react';

import { FormContainer } from './FormContainer';

let formContainer = null;

beforeEach(() => {
  formContainer = new FormContainer();
  formContainer.appendTo(document.body);
});

afterEach(() => {
  formContainer.unmountForm();
  formContainer.remove();
  formContainer = null;
});

describe('FormContainer element', () => {
  test('appendTo and remove methods', () => {
    let parent = document.createElement('div');
    parent.appendChild(document.createElement('div'));
    parent.appendChild(document.createElement('div'));
    parent.appendChild(document.createElement('div'));
    expect(parent.contains(formContainer.node)).toBeFalsy();
    formContainer.appendTo(parent);
    expect(parent.contains(formContainer.node)).toBeTruthy();
    expect(parent.lastChild).toBe(formContainer.node); // appended to end
    formContainer.remove();
    expect(parent.contains(formContainer.node)).toBeFalsy();
  });

  describe('renderForm method', () => {
    it('renders and caches the form', () => {
      expect(formContainer.node.childNodes.length).toBe(0);
      formContainer.renderForm(() => <p>A form.</p>);
      expect(formContainer.node.firstChild.textContent).toBe('A form.');
      // if the form were not cached, refreshing could unmount the form
      formContainer.refresh();
      // was not unmounted
      expect(formContainer.node.firstChild.textContent).toBe('A form.');
    });

    describe('passed unmount callback', () => {
      it('unmounts and uncaches the form', () => {
        let unmount = null;
        let formFactory = props => {
          unmount = props.unmount;
          return <p>Another form.</p>;
        }
        formContainer.renderForm(formFactory);
        // was rendered
        expect(formContainer.node.firstChild.textContent).toBe('Another form.');
        unmount();
        expect(formContainer.node.childNodes.length).toBe(0); // was unmounted
        // must uncache the form to prevent rerendering on refresh
        formContainer.refresh();
        expect(formContainer.node.childNodes.length).toBe(0); // was uncached
      });

      it('does nothing if the form has already been unmounted', () => {
        let unmount = null;
        let formFactory = props => {
          unmount = props.unmount;
          return <p>Asdf qwer.</p>;
        }
        formContainer.renderForm(formFactory);
        // was rendered
        expect(formContainer.node.firstChild.textContent).toBe('Asdf qwer.');
        formContainer.unmountForm();
        expect(formContainer.node.childNodes.length).toBe(0); // was unmounted
        expect(() => unmount()).not.toThrow();
        expect(formContainer.node.childNodes.length).toBe(0); // no change
      });

      it('does not unmount other forms', () => {
        let unmount = null;
        let formFactory1 = props => {
          unmount = props.unmount;
          return <p>Form 1.</p>;
        }
        formContainer.renderForm(formFactory1);
        // form 1 was rendered
        expect(formContainer.node.firstChild.textContent).toBe('Form 1.');
        let formFactory2 = () => <p>Form 2.</p>;
        formContainer.renderForm(formFactory2);
        // form 2 was rendered
        expect(formContainer.node.firstChild.textContent).toBe('Form 2.');
        unmount();
        // form 2 was not unmounted
        expect(formContainer.node.firstChild.textContent).toBe('Form 2.');
      });
    });

    it('passes the history interface of the form container', () => {
      let history = null;
      let formFactory = props => {
        history = props.history;
        return <p>A form.</p>;
      }
      formContainer.renderForm(formFactory);
      expect(history).toBe(formContainer.history);
    });

    it('records forms in form history', () => {
      formContainer.renderForm(() => <p>Form A.</p>);
      formContainer.renderForm(() => <p>Form B.</p>);
      expect(formContainer.node.firstChild.textContent).toBe('Form B.');
      formContainer.history.goBackward();
      expect(formContainer.node.firstChild.textContent).toBe('Form A.');
      formContainer.history.goForward();
      expect(formContainer.node.firstChild.textContent).toBe('Form B.');
    });

    it('does not duplicate forms in form history unnecessarily', () => {
      let formFactory = () => <p>Asdf zxcv.</p>;
      formContainer.renderForm(formFactory);
      formContainer.renderForm(formFactory); // same form factory
      expect(formContainer.history.canGoBackward()).toBeFalsy(); // did not duplicate
    });
  });

  describe('unmountForm method', () => {
    test('when there is a form to unmount', () => {
      formContainer.renderForm(() => <p>123456.</p>);
      // was rendered
      expect(formContainer.node.firstChild.textContent).toBe('123456.');
      formContainer.unmountForm();
      expect(formContainer.node.childNodes.length).toBe(0); // was unmounted
      // must uncache the form to prevent rerendering on refresh
      formContainer.refresh();
      expect(formContainer.node.childNodes.length).toBe(0); // was uncached
    });

    test('when there is no form to unmount', () => {
      expect(formContainer.node.childNodes.length).toBe(0);
      expect(() => formContainer.unmountForm()).not.toThrow();
    });
  });

  describe('refresh method', () => {
    test('when a form is rendered', () => {
      let formFactory = () => <p>A form.</p>;
      formContainer.renderForm(formFactory);
      // was rendered
      expect(formContainer.node.firstChild.textContent).toBe('A form.');
      let spy = jest.spyOn(formContainer, 'renderForm');
      expect(spy).not.toHaveBeenCalled();
      formContainer.refresh();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toBe(formFactory); // was rerendered
      expect(formContainer.node.firstChild.textContent).toBe('A form.');
    });

    test('when no form is rendered', () => {
      expect(formContainer.node.childNodes.length).toBe(0);
      expect(() => formContainer.refresh()).not.toThrow();
    });
  });

  test('history interface', () => {
    formContainer.renderForm(() => <p>Form 1.</p>);
    formContainer.renderForm(() => <p>Form 2.</p>);

    // when can go backward
    expect(formContainer.node.firstChild.textContent).toBe('Form 2.');
    expect(formContainer.history.canGoBackward()).toBeTruthy();
    formContainer.history.goBackward();
    expect(formContainer.node.firstChild.textContent).toBe('Form 1.'); // went backward

    // when cannot go backward
    expect(formContainer.history.canGoBackward()).toBeFalsy();
    expect(() => formContainer.history.goBackward()).not.toThrow();
    expect(formContainer.node.firstChild.textContent).toBe('Form 1.'); // was not unmounted

    // when can go forward
    expect(formContainer.history.canGoForward()).toBeTruthy();
    formContainer.history.goForward();
    expect(formContainer.node.firstChild.textContent).toBe('Form 2.'); // went forward

    // when cannot go forward
    expect(formContainer.history.canGoForward()).toBeFalsy();
    expect(() => formContainer.history.goForward()).not.toThrow();
    expect(formContainer.node.firstChild.textContent).toBe('Form 2.'); // was not unmounted
  });

  describe('clearHistory method', () => {
    test('when there is no form history to clear', () => {
      expect(formContainer.node.childNodes.length).toBe(0); // no form is rendered
      // no forms to go backward or forward to
      expect(formContainer.history.canGoBackward()).toBeFalsy();
      expect(formContainer.history.canGoForward()).toBeFalsy();
      expect(() => formContainer.clearHistory()).not.toThrow();
    });

    describe('when there is form history to clear', () => {
      test('when no form is rendered', () => {
        formContainer.renderForm(() => <p>Form 1.</p>);
        formContainer.renderForm(() => <p>Form 2.</p>);
        formContainer.history.goBackward();
        formContainer.unmountForm();
        expect(formContainer.node.childNodes.length).toBe(0); // no form is rendered
        expect(formContainer.history.canGoBackward()).toBeTruthy();
        expect(formContainer.history.canGoForward()).toBeTruthy();
        formContainer.clearHistory();
        expect(formContainer.node.childNodes.length).toBe(0); // still no form is rendered
        // backward and forward history was cleared
        expect(formContainer.history.canGoBackward()).toBeFalsy();
        expect(formContainer.history.canGoForward()).toBeFalsy();
      });

      test('when a form is rendered', () => {
        formContainer.renderForm(() => <p>Form A.</p>);
        formContainer.renderForm(() => <p>Form B.</p>);
        formContainer.renderForm(() => <p>Form C.</p>);
        formContainer.history.goBackward();
        // form B is rendered
        expect(formContainer.node.firstChild.textContent).toBe('Form B.');
        expect(formContainer.history.canGoBackward()).toBeTruthy();
        expect(formContainer.history.canGoForward()).toBeTruthy();
        formContainer.clearHistory();
        // form B is still rendered
        expect(formContainer.node.firstChild.textContent).toBe('Form B.');
        // backward and forward history was cleared
        expect(formContainer.history.canGoBackward()).toBeFalsy();
        expect(formContainer.history.canGoForward()).toBeFalsy();
        // if the current form was not recached, then refreshing could
        // unmount the current form
        formContainer.refresh();
        // form B is still rendered
        expect(formContainer.node.firstChild.textContent).toBe('Form B.');
      });
    });
  });
});
