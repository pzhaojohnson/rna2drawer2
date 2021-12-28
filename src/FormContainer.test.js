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
    it('renders the form', () => {
      expect(formContainer.node.childNodes.length).toBe(0);
      expect(formContainer.node.textContent).toBe('');
      formContainer.renderForm(() => <p>A form.</p>);
      expect(formContainer.node.childNodes.length).toBeGreaterThan(0);
      expect(formContainer.node.textContent).toBe('A form.'); // rendered
    });

    describe('passed unmount callback', () => {
      it('unmounts the rendered form', () => {
        let unmount = null;
        let formFactory = props => {
          unmount = props.unmount;
          return <p>Another form.</p>;
        }
        expect(formContainer.node.childNodes.length).toBe(0);
        expect(formContainer.node.textContent).toBe('');
        formContainer.renderForm(formFactory);
        expect(formContainer.node.childNodes.length).toBeGreaterThan(0);
        expect(formContainer.node.textContent).toBe('Another form.'); // rendered
        unmount();
        expect(formContainer.node.childNodes.length).toBe(0); // unmounted
        expect(formContainer.node.textContent).toBe('');
        // must uncache the form to prevent rerendering on refresh
        formContainer.refresh();
        expect(formContainer.node.childNodes.length).toBe(0); // uncached
        expect(formContainer.node.textContent).toBe('');
      });

      it('does nothing if the form is already unmounted', () => {
        let unmount = null;
        let formFactory = props => {
          unmount = props.unmount;
          return <p>Asdf qwer.</p>;
        }
        expect(formContainer.node.childNodes.length).toBe(0);
        expect(formContainer.node.textContent).toBe('');
        formContainer.renderForm(formFactory);
        expect(formContainer.node.childNodes.length).toBeGreaterThan(0);
        expect(formContainer.node.textContent).toBe('Asdf qwer.'); // rendered
        formContainer.unmountForm();
        expect(formContainer.node.childNodes.length).toBe(0); // unmounted
        expect(formContainer.node.textContent).toBe('');
        expect(() => unmount()).not.toThrow();
        expect(formContainer.node.childNodes.length).toBe(0); // no change
        expect(formContainer.node.textContent).toBe('');
      });

      it('does not unmount other forms', () => {
        let unmount = null;
        let formFactory1 = props => {
          unmount = props.unmount;
          return <p>Form 1.</p>;
        }
        expect(formContainer.node.childNodes.length).toBe(0);
        expect(formContainer.node.textContent).toBe('');
        formContainer.renderForm(formFactory1);
        expect(formContainer.node.childNodes.length).toBeGreaterThan(0);
        expect(formContainer.node.textContent).toBe('Form 1.'); // rendered form 1
        let formFactory2 = () => <p>Form 2.</p>;
        formContainer.renderForm(formFactory2);
        expect(formContainer.node.childNodes.length).toBeGreaterThan(0);
        expect(formContainer.node.textContent).toBe('Form 2.'); // rendered form 2
        unmount();
        expect(formContainer.node.childNodes.length).toBeGreaterThan(0);
        expect(formContainer.node.textContent).toBe('Form 2.'); // not unmounted
      });
    });
  });

  describe('unmountForm method', () => {
    test('when there is a rendered form', () => {
      expect(formContainer.node.childNodes.length).toBe(0);
      expect(formContainer.node.textContent).toBe('');
      formContainer.renderForm(() => <p>123456.</p>);
      expect(formContainer.node.childNodes.length).toBeGreaterThan(0);
      expect(formContainer.node.textContent).toBe('123456.'); // rendered
      formContainer.unmountForm();
      expect(formContainer.node.childNodes.length).toBe(0); // unmounted
      expect(formContainer.node.textContent).toBe('');
      // must uncache the form to prevent rerendering on refresh
      formContainer.refresh();
      expect(formContainer.node.childNodes.length).toBe(0); // uncached
      expect(formContainer.node.textContent).toBe('');
    });

    test('when there is no rendered form', () => {
      expect(formContainer.node.childNodes.length).toBe(0);
      expect(() => formContainer.unmountForm()).not.toThrow();
    });
  });

  describe('refresh method', () => {
    test('when there is a rendered form', () => {
      expect(formContainer.node.childNodes.length).toBe(0);
      expect(formContainer.node.textContent).toBe('');
      let formFactory = () => <p>A form.</p>;
      formContainer.renderForm(formFactory);
      expect(formContainer.node.childNodes.length).toBeGreaterThan(0);
      expect(formContainer.node.textContent).toBe('A form.'); // rendered
      let spy = jest.spyOn(formContainer, 'renderForm');
      expect(spy).not.toHaveBeenCalled();
      formContainer.refresh();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0]).toBe(formFactory); // rerendered
      expect(formContainer.node.childNodes.length).toBeGreaterThan(0);
      expect(formContainer.node.textContent).toBe('A form.');
    });

    test('when there is no rendered form', () => {
      expect(formContainer.node.childNodes.length).toBe(0);
      expect(() => formContainer.refresh()).not.toThrow();
    });
  });
});
