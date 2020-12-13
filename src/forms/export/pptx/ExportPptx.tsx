import * as React from 'react';
import errorMessageStyles from '../../ErrorMessage.css';
import { CloseButton } from '../../buttons/CloseButton';
import { ActionButton } from '../../buttons/ActionButton';
const uuidv1 = require('uuid/v1');
import Base from '../../../draw/Base';
import { pointsToPixels } from '../../../export/pointsToPixels';
import { formatSvgForExport } from '../../../export/formatSvgForExport';
import { createPptxFromSvg } from '../../../export/createPptxFromSvg';
import * as Svg from '@svgdotjs/svg.js';
import PptxGenJS from 'pptxgenjs';
import LastExported from '../LastExported';

interface Props {
  SVG: () => Svg.Svg;
  getSvgString: () => string;
  close?: () => void;
}

class ExportPptx extends React.Component {
  props!: Props;
  state: {
    baseFontSize: string;

    errorMessage: string;
    errorMessageKey: string;
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      baseFontSize: LastExported.baseFontSize,

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
          borderWidth: '0px 0px 0px 1px',
          borderStyle: 'solid',
          borderColor: 'rgba(0,0,0,0.125)',
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
        {this.powerPointVersionNote()}
        {this.largeStructuresNote()}
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
          color: 'rgba(0,0,0,1)',
        }}
      >
        Export PPTX
      </p>
    );
  }

  titleUnderline() {
    return (
      <div
        style={{
          height: '0px',
          borderWidth: '0px 0px 1px 0px',
          borderStyle: 'solid',
          borderColor: 'rgba(0,0,0,0.125)',
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
        {this.baseFontSizeField()}
        {this.baseFontSizeDescription()}
      </div>
    );
  }

  baseFontSizeField() {
    return (
      <div
        style={{
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

  baseFontSizeDescription() {
    return (
      <p
        className={'unselectable-text'}
        style={{
          margin: '6px 0px 0px 12px',
          fontSize: '12px',
        }}
      >
        The exported drawing is scaled according to the font size of bases.
      </p>
    );
  }

  baseFontSizeLabel() {
    return (
      <p
        className={'unselectable-text'}
        style={{
          fontSize: '12px',
          display: 'inline-block',
          marginRight: '12px',
        }}
      >
        Font Size of Bases:
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
          flexGrow: 1,
          fontSize: '12px',
          textAlign: 'right',
        }}
      />
    );
  }

  onBaseFontSizeInputChange(event: React.ChangeEvent) {
    this.setState({
      baseFontSize: (event.target as HTMLInputElement).value,
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
        className={errorMessageStyles.fadesIn}
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
        style={{
          margin: '0px 40px 0px 40px',
          fontSize: '14px',
          color: 'red',
        }}
      >
        <span style={{ fontWeight: 600 }} >
          {this.state.errorMessage}
        </span>
      </p>
    );
  }

  exportSection() {
    return (
      <div style={{ margin: '6px 40px 0px 40px' }} >
        <ActionButton text={'Export'} onClick={() => this.export()} />
      </div>
    );
  }

  powerPointVersionNote() {
    return (
      <p
        className={'unselectable-text'}
        style={{
          margin: '16px 40px 0px 40px',
          fontSize: '12px',
        }}
      >
        <span style={{ fontWeight: 600, color: 'rgba(0,0,0,1)' }} >Note:&nbsp;</span>
        Exported PPTX files require PowerPoint 2016 or later to open.
      </p>
    );
  }

  tertiaryBondsNote() {
    return (
      <p
        className={'unselectable-text'}
        style={{
          margin: '8px 40px 0px 40px',
          fontSize: '12px',
        }}
      >
        <span style={{ fontWeight: 600, color: 'rgba(0,0,0,1)' }} >Note:&nbsp;</span>
        Tertiary bonds are included as SVG images in exported PPTX files
        and can be converted to PowerPoint objects via the "Convert to Shape" feature.
      </p>
    );
  }

  largeStructuresNote() {
    return (
      <p
        className={'unselectable-text'}
        style={{
          margin: '8px 40px 0px 40px',
          fontSize: '12px',
        }}
      >
        <span style={{ fontWeight: 600, color: 'rgba(0,0,0,1)' }} >Note:&nbsp;</span>
        Large structures may take a while to export.
      </p>
    );
  }

  export() {
    let bfs = this.parseBaseFrontSize();
    if (!bfs) {
      return;
    }
    LastExported.baseFontSize = this.state.baseFontSize.trim();
    this.setState({
      errorMessage: '',
      errorMessageKey: uuidv1(),
    });
    let scaling = bfs / Base.mostRecentProps().fontSize;
    let pres = this.createPptx(scaling);
    if (pres) {
      this.savePptx(pres);
    }
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
    if (bfs < 1) {
      this.setState({
        errorMessage: 'Font size of bases must be at least 1.',
        errorMessageKey: uuidv1(),
      });
      return null;
    }
    return pointsToPixels(bfs);
  }

  /**
   * Returns null if either of the SVG or getSvgString callback
   * props are missing.
   */
  createPptx(scaling: number): (PptxGenJS | null) {
    if (!this.props.SVG) {
      console.error('Missing SVG callback.');
      return null;
    } else if (!this.props.getSvgString) {
      console.error('Missing getSvgString callback.');
      return null;
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
    let pres = createPptxFromSvg(svg);
    document.body.removeChild(div);
    return pres;
  }

  savePptx(pres: PptxGenJS) {
    let name = 'Drawing';
    if (document.title) {
      name = document.title;
    }
    pres.writeFile(name + '.pptx');
  }

  close() {
    if (this.props.close) {
      this.props.close();
    } else {
      console.error('Missing close callback.');
    }
  }
}

export default ExportPptx;
