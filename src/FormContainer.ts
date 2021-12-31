import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';
import { TrackedOptionalValue } from 'History/TrackedOptionalValue';

export type FormProps = {
  unmount: () => void;
  history: FormHistoryInterface;
}

export type FormFactory = (props: FormProps) => React.ReactElement;

type RenderedForm = {
  formFactory: FormFactory;
}

function renderedFormsAreEqual(rf1: RenderedForm, rf2: RenderedForm): boolean {
  return rf1.formFactory == rf2.formFactory;
}

export class FormContainer {
  readonly node: HTMLDivElement;

  _renderedForm: TrackedOptionalValue<RenderedForm>;

  readonly history: FormHistoryInterface;

  constructor() {
    this.node = document.createElement('div');

    this._renderedForm = new TrackedOptionalValue<RenderedForm>({
      areEqual: renderedFormsAreEqual,
    });

    this.history = {
      goBackward: () => this._goBackward(),
      canGoBackward: () => this._canGoBackward(),
      goForward: () => this._goForward(),
      canGoForward: () => this._canGoForward(),
    };
  }

  appendTo(container: Node) {
    container.appendChild(this.node);
  }

  remove() {
    this.node.remove();
  }

  renderForm(formFactory: FormFactory) {
    // seems to be necessary to update the displayed values of input elements
    ReactDOM.unmountComponentAtNode(this.node);

    let props = {
      unmount: () => {
        // do not unmount other forms
        if (formFactory == this._renderedForm.current?.formFactory) {
          this.unmountForm();
        }
      },
      history: this.history,
    };

    // set before rendering so that the form history is
    // up-to-date when rendering
    this._renderedForm.current = { formFactory };

    ReactDOM.render(formFactory(props), this.node);
  }

  unmountForm() {
    ReactDOM.unmountComponentAtNode(this.node);
    this._renderedForm.current = undefined;
  }

  refresh() {
    if (this._renderedForm.current) {
      this.renderForm(this._renderedForm.current.formFactory);
    } else {
      // form should already be unmounted in this case
      // but can call just to be safe
      this.unmountForm();
    }
  }

  _goBackward() {
    if (this._renderedForm.canGoBackward()) {
      this._renderedForm.goBackward();
      if (this._renderedForm.current) {
        this.renderForm(this._renderedForm.current.formFactory);
      }
    }
  }

  _canGoBackward(): boolean {
    return this._renderedForm.canGoBackward();
  }

  _goForward() {
    if (this._renderedForm.canGoForward()) {
      this._renderedForm.goForward();
      if (this._renderedForm.current) {
        this.renderForm(this._renderedForm.current.formFactory);
      }
    }
  }

  _canGoForward(): boolean {
    return this._renderedForm.canGoForward();
  }

  clearHistory() {
    let current = this._renderedForm.current;
    this._renderedForm = new TrackedOptionalValue<RenderedForm>({
      areEqual: renderedFormsAreEqual,
    });
    this._renderedForm.current = current;
  }
}
