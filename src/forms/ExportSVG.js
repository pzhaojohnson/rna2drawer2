import React from 'react';
import PropTypes from 'prop-types';
import { CloseButton } from './CloseButton';
const uuidv1 = require('uuid/v1');
import Base from '../draw/Base';
import { formatSvgForExport } from '../export/formatSvgForExport';

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
          width: '400px',
          height: '100%',
          backgroundColor: '#fefefe',
          borderWidth: '0px 0px 0px thin',
          borderStyle: 'solid',
          borderColor: '#bfbfbf',
        }}
      >
        {this.closeButton()}
        {this.titleAndContent()}
      </div>
    );
  }

  closeButton() {
    return (
      <CloseButton
        position={'absolute'}
        top={'0px'}
        right={'0px'}
        onClick={() => this.close()}
      />
    );
  }

  titleAndContent() {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {this.titleSection()}
        {this.baseFontSizeSection()}
        {this.errorMessageSection()}
        {this.exportSection()}
      </div>
    );
  }

  titleSection() {
    return (
      <div>
        {this.titleText()}
        {this.titleUnderline()}
      </div>
    );
  }

  titleText() {
    return (
      <p
        className={'unselectable-text'}
        style={{
          margin: '16px 32px 0px 32px',
          fontSize: '24px',
        }}
      >
        Export SVG
      </p>
    );
  }

  titleUnderline() {
    return (
      <div
        style={{
          height: '0px',
          borderWidth: '0px 0px thin 0px',
          borderStyle: 'solid',
          borderColor: '#bfbfbf',
          margin: '8px 16px 0px 16px',
        }}
      ></div>
    );
  }

  baseFontSizeSection() {
    return (
      <div
        style={{
          margin: '24px 40px 18px 40px',
        }}
      >
        {this.baseFontSizeDescription()}
        {this.baseFontSizeField()}
      </div>
    );
  }

  baseFontSizeDescription() {
    return (
      <p
        className={'unselectable-text'}
        style={{
          fontSize: '12px',
        }}
      >
        Scale the exported drawing by setting the font size of bases.
      </p>
    );
  }

  baseFontSizeField() {
    return (
      <div
        style={{
          margin: '8px 0px 0px 8px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {this.baseFontSizeLabel()}
        {this.baseFontSizeInput()}
      </div>
    );
  }

  baseFontSizeLabel() {
    return (
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
    );
  }

  baseFontSizeInput() {
    return (
      <input
        type={'text'}
        value={this.state.baseFontSize}
        onChange={event => this.onBaseFontSizeInputChange(event)}
        spellCheck={'false'}
        style={{
          flexGrow: '1',
          fontSize: '12px',
          textAlign: 'right',
        }}
      />
    );
  }
  
  onBaseFontSizeInputChange(event) {
    this.setState({
      baseFontSize: event.target.value,
    });
  }

  errorMessageSection() {
    if (!this.state.errorMessage) {
      return this.emptyErrorMessageSection();
    }
    return (
      <div
        key={this.state.errorMessageKey}
        id={this.state.errorMessageKey} 
      >
        {this.errorMessageText()}
      </div>
    );
  }

  emptyErrorMessageSection() {
    return (
      <div
        key={this.state.errorMessageKey}
        id={this.state.errorMessageKey}
      ></div>
    );
  }

  errorMessageText() {
    return (
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
    );
  }

  exportSection() {
    return (
      <div
        style={{
          margin: '6px 40px 0px 40px',
        }}
      >
        {this.exportButton()}
      </div>
    );
  }

  exportButton() {
    return (
      <button
        onClick={() => this.export()}
        style={{
          padding: '4px 32px 4px 32px',
          fontSize: '12px',
          borderRadius: '2px',
        }}
      >
        Export
      </button>
    );
  }

  export() {
    let bfs = this.parseBaseFrontSize();
    if (!bfs) {
      return;
    }
    this.setState({
      errorMessage: '',
      errorMessageKey: uuidv1(),
    });
    let scaling = bfs / Base.mostRecentProps().fontSize;
    let svgString = this.getSvgStringForExport(scaling);
    this.offerSvgForDownload(svgString);
  }

  parseBaseFrontSize() {
    let bfs = Number(this.state.baseFontSize);
    if (!Number.isFinite(bfs)) {
      this.setState({
        errorMessage: 'Font size of bases must be a number.',
        errorMessageKey: uuidv1(),
      });
      return null;
    }
    if (bfs <= 0) {
      this.setState({
        errorMessage: 'Font size of bases must be positive.',
        errorMessageKey: uuidv1(),
      });
      return null;
    }
    return bfs;
  }

  /**
   * Returns an empty string if either of the SVG or getSvgString callback
   * props are missing.
   * 
   * @param {number} scaling 
   * 
   * @returns {string} 
   */
  getSvgStringForExport(scaling) {
    if (!this.props.SVG) {
      console.log('Missing SVG callback.');
      return '';
    } else if (!this.props.getSvgString) {
      console.log('Missing getSvgString callback.');
      return '';
    }
    let div = document.createElement('div');
    div.style.cssText = 'max-width: 0px; max-height: 0px';
    document.body.appendChild(div);
    let svg = this.props.SVG();
    svg.addTo(div);
    svg.svg(this.props.getSvgString());
    let nested = svg.first();
    let content = nested.svg(false);
    svg.clear();
    svg.svg(content);
    formatSvgForExport(svg, scaling);
    let svgString = svg.svg();
    document.body.removeChild(div);
    return svgString;
  }

  /**
   * @param {string} svgString 
   */
  offerSvgForDownload(svgString) {
    let b = new Blob([svgString], { type: 'text/plain' });
    let url = URL.createObjectURL(b);
    let div = document.createElement('div');
    div.style.cssText = 'max-width: 0px; max-height: 0px';
    document.body.appendChild(div);
    let a = document.createElement('a');
    div.appendChild(a);
    a.innerHTML = '&nbsp;';
    a.href = url;
    a.download = 'Drawing.svg';
    let me = new MouseEvent('click', {});
    a.dispatchEvent(me);
    document.body.removeChild(div);
  }

  close() {
    if (this.props.close) {
      this.props.close();
    }
  }
}

ExportSvg.propTypes = {
  SVG: PropTypes.func.isRequired,
  getSvgString: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

export {
  ExportSvg,
};
