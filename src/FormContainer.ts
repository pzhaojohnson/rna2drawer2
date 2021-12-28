import * as React from 'react';
import * as ReactDOM from 'react-dom';

export type FormProps = {
  unmount: () => void;
}

export type FormFactory = (props: FormProps) => React.ReactElement;

export class FormContainer {
  readonly node: HTMLDivElement;

  _curr?: {
    formFactory: FormFactory;
  }

  constructor() {
    this.node = document.createElement('div');
  }

  appendTo(container: Node) {
    container.appendChild(this.node);
  }

  remove() {
    this.node.remove();
  }

  renderForm(formFactory: FormFactory) {
    // seems to be necessary to update the values of input elements
    ReactDOM.unmountComponentAtNode(this.node);

    let props = {
      unmount: () => {
        // do not unmount other forms
        if (formFactory == this._curr?.formFactory) {
          this.unmountForm();
        }
      }
    };

    ReactDOM.render(formFactory(props), this.node);
    this._curr = { formFactory };
  }

  unmountForm() {
    ReactDOM.unmountComponentAtNode(this.node);
    this._curr = undefined;
  }

  refresh() {
    if (this._curr) {
      this.renderForm(this._curr.formFactory);
    } else {
      // any previous form should already be unmounted
      // but call just in case
      this.unmountForm();
    }
  }
}
