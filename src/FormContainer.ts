import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FormHistoryInterface } from 'Forms/history/FormHistoryInterface';
import { TrackedOptionalValue } from 'History/TrackedOptionalValue';

export type FormProps = {
  unmount: () => void;
  history: FormHistoryInterface;
}

export type FormFactory = (props: FormProps) => React.ReactElement;

export type RenderFormOptions = {
  // may be used to specify when two different form factories
  // produce the same form (i.e., by giving them the same key)
  key?: string;
}

type RenderedForm = {
  formFactory: FormFactory;
  options?: RenderFormOptions;
}

function renderedFormsAreEqual(rf1: RenderedForm, rf2: RenderedForm): boolean {
  if (rf1.options?.key != undefined && rf2.options?.key != undefined) {
    return rf1.options.key == rf2.options.key;
  } else {
    return rf1.formFactory == rf2.formFactory;
  }
}

// the maximum number of previous forms to remember
// (effectively controls the maximum number of more recent forms to remember)
const maxPreviousStackSize = 100;

export class FormContainer {
  readonly node: HTMLDivElement;

  _renderedForm: TrackedOptionalValue<RenderedForm>;

  readonly history: FormHistoryInterface;

  constructor() {
    this.node = document.createElement('div');

    this._renderedForm = new TrackedOptionalValue<RenderedForm>({
      areEqual: renderedFormsAreEqual,
      maxPreviousStackSize,
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

  renderForm(formFactory: FormFactory, options?: RenderFormOptions) {
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
    this._renderedForm.current = { formFactory, options };

    ReactDOM.render(formFactory(props), this.node);
  }

  // helps make code for going backward and forward and refreshing simpler
  _rerenderForm(rf: RenderedForm) {
    this.renderForm(rf.formFactory, rf.options);
  }

  unmountForm() {
    ReactDOM.unmountComponentAtNode(this.node);
    this._renderedForm.current = undefined;
  }

  refresh() {
    if (this._renderedForm.current) {
      this._rerenderForm(this._renderedForm.current);
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
        this._rerenderForm(this._renderedForm.current);
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
        this._rerenderForm(this._renderedForm.current);
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
      maxPreviousStackSize,
    });
    this._renderedForm.current = current;
  }
}
