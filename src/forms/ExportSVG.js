import React from 'react';
import PropTypes from 'prop-types';
import { CloseButton } from './CloseButton';
import Base from '../draw/Base';
const uuidv1 = require('uuid/v1');

class ExportSvg extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      baseFontSize: '6.0',

      errorMessage: '',
      errorMessageKey: uuidv1(),
    };
  }

  render() {
    return (
      <div
        style={{
          position: 'relative',
          height: '100%',
          backgroundColor: '#fefefe',
          borderWidth: '0px 0px 0px thin',
          borderStyle: 'solid',
          borderColor: '#bfbfbf',
        }}
      >
        <CloseButton
          position={'absolute'}
          top={'0px'}
          right={'0px'}
        />
        <div
          style={{
            width: '400px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {this._title()}
          {this._baseFontSize()}
          {this._errorMessageSection()}
          {this._exportButton()}
        </div>
      </div>
    );
  }

  _title() {
    return (
      <div>
        <p
          className={'unselectable-text'}
          style={{
            margin: '16px 32px 0px 32px',
            fontSize: '24px',
          }}
        >
          Export SVG
        </p>
        <div
          style={{
            height: '0px',
            borderWidth: '0px 0px thin 0px',
            borderStyle: 'solid',
            borderColor: '#bfbfbf',
            margin: '8px 16px 0px 16px',
          }}
        ></div>
      </div>
    );
  }

  _baseFontSize() {
    return (
      <div
        style={{ margin: '24px 40px 18px 40px' }}
      >
        <p
          className={'unselectable-text'}
          style={{ fontSize: '12px' }}
        >
          Scale the exported drawing by setting the font size of bases.
        </p>
        <div
          style={{
            margin: '8px 0px 0px 8px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <p
            className={'unselectable-text'}
            style={{
              fontSize: '12px',
              display: 'inline-block',
              marginRight: '8px',
            }}
          >
            Font size of bases:
          </p>
          <input
            type={'text'}
            value={this.state.baseFontSize}
            onChange={event => this._onBaseFontSizeInputChange(event)}
            spellcheck={'false'}
            style={{
              flexGrow: '1',
              fontSize: '12px',
              textAlign: 'right',
            }}
          />
        </div>
      </div>
    );
  }
  
  _onBaseFontSizeInputChange(event) {
    this.setState({
      baseFontSize: event.target.value,
    });
  }

  _errorMessageSection() {
    if (!this.state.errorMessage) {
      return (
        <div key={this.state.errorMessageKey} id={this.state.errorMessageKey}></div>
      );
    }
    return (
      <div key={this.state.errorMessageKey} id={this.state.errorMessageKey} >
        <p
          className={'unselectable-text'}
          style={{
            margin: '0px 40px 0px 40px',
            fontSize: '14px',
            color: 'red',
            animationName: 'fadein',
            animationDuration: '0.75s',
          }}
        >
          <b>{this.state.errorMessage}</b>
        </p>
      </div>
    );
  }

  _exportButton() {
    return (
      <div
        style={{
          margin: '6px 40px 0px 40px',
        }}
      >
        <button
          onClick={() => this._export()}
          style={{
            padding: '4px 32px 4px 32px',
            fontSize: '12px',
            borderRadius: '2px',
          }}
        >
          Export
        </button>
      </div>
    );
  }

  _export() {
    let bfs = this._parseBaseFrontSize();
    if (!bfs) {
      return;
    }
    this.setState({ errorMessage: '', errorMessageKey: uuidv1() });
    let scaling = bfs / Base.mostRecentProps().fontSize;

  }

  _parseBaseFrontSize() {
    let bfs = Number(this.state.baseFontSize);
    if (!Number.isFinite(bfs)) {
      this.setState({ errorMessage: 'Font size of bases must be a number.', errorMessageKey: uuidv1() });
      return null;
    }
    if (bfs <= 0) {
      this.setState({ errorMessage: 'Font size of bases must be positive.', errorMessageKey: uuidv1() });
      return null;
    }
    return bfs;
  }
}

export {
  ExportSvg,
};
