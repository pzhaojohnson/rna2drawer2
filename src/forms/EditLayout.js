import React from 'react';
import PropTypes from 'prop-types';
const uuidv1 = require('uuid/v1');

import { CloseButton } from './CloseButton';

import normalizeAngle from '../draw/normalizeAngle';

import isAllWhitespace from '../parse/isAllWhitespace';
import parseNonnegativeFloat from '../parse/number/parseNonnegativeFloat';

class EditLayout extends React.Component {
  constructor(props) {
    super(props);

    let r = normalizeAngle(this.props.rotation);
    r *= 360 / (2 * Math.PI);
    r = r.toFixed(2);
    r = Number(r);

    let tg = this.props.terminiGap.toFixed(2);
    tg = Number(tg);
    
    this.state = {
      rotation: r.toString(),
      terminiGap: tg.toString(),

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
          backgroundColor: '#ffffff',
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
        onClick={() => this.props.close()}
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
        {this.rotationField()}
        {this.terminiGapField()}
        {this.errorMessageSection()}
        {this.applySection()}
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
        Edit Layout
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

  rotationField() {
    return (
      <div
        style={{
          margin: '24px 40px 0px 40px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {this.rotationLabel()}
        {this.rotationInput()}
      </div>
    );
  }

  rotationLabel() {
    return (
      <p
        className={'unselectable-text'}
        style={{
          flexGrow: '1',
          marginRight: '8px',
          fontSize: '12px',
          display: 'inline-block',
        }}
      >
        Rotation (degrees):
      </p>
    );
  }

  rotationInput() {
    return (
      <input
        type={'text'}
        value={this.state.rotation}
        onChange={event => this.onRotationInputChange(event)}
        spellCheck={'false'}
        style={{
          width: '180px',
          fontSize: '12px',
          textAlign: 'right',
        }}
      />
    );
  }
  
  onRotationInputChange(event) {
    this.setState({
      rotation: event.target.value,
    });
  }

  terminiGapField() {
    return (
      <div
        style={{
          margin: '16px 40px 18px 40px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {this.terminiGapLabel()}
        {this.terminiGapInput()}
      </div>
    );
  }

  terminiGapLabel() {
    return (
      <p
        className={'unselectable-text'}
        style={{
          flexGrow: '1',
          marginRight: '8px',
          fontSize: '12px',
          display: 'inline-block',
        }}
      >
        Termini Gap:
      </p>
    );
  }

  terminiGapInput() {
    return (
      <input
        type={'text'}
        value={this.state.terminiGap}
        onChange={event => this.onTerminiGapInputChange(event)}
        spellCheck={'false'}
        style={{
          width: '180px',
          fontSize: '12px',
          textAlign: 'right',
        }}
      />
    );
  }
  
  onTerminiGapInputChange(event) {
    this.setState({
      terminiGap: event.target.value,
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

  applySection() {
    return (
      <div
        style={{
          margin: '6px 40px 0px 40px',
        }}
      >
        {this.applyButton()}
      </div>
    );
  }

  applyButton() {
    return (
      <button
        onClick={() => this.apply()}
        style={{
          padding: '4px 32px 4px 32px',
          fontSize: '12px',
          borderRadius: '2px',
        }}
      >
        Apply
      </button>
    );
  }

  apply() {
    let r = this.parseRotation();
    if (!r && r != 0) {
      return;
    }
    let tg = this.parseTerminiGap();
    if (!tg && tg != 0) {
      return;
    }
    this.props.apply({
      rotation: r,
      terminiGap: tg,
    });
  }

  parseRotation() {
    let n = Number(this.state.rotation);
    if (!Number.isFinite(n) || isAllWhitespace(this.state.rotation)) {
      this.setState({
        errorMessage: 'Rotation must be a number.',
        errorMessageKey: uuidv1(),
      });
      return null;
    }
    n *= (2 * Math.PI) / 360;
    n = normalizeAngle(n);
    return n;
  }

  parseTerminiGap() {
    let tg = parseNonnegativeFloat(this.state.terminiGap);
    if (!tg && tg != 0) {
      this.setState({
        errorMessage: 'Termini gap must be a nonnegative number.',
        errorMessageKey: uuidv1(),
      });
      return null;
    }
    return tg;
  }
}

EditLayout.propTypes = {
  rotation: PropTypes.number,
  terminiGap: PropTypes.number,
  apply: PropTypes.func,
  close: PropTypes.func,
};

EditLayout.defaultProps = {
  rotation: 0,
  terminiGap: 0,
  apply: () => {},
  close: () => {},
};

export default EditLayout;
