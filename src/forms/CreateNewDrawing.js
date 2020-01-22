import React from 'react';

import parseSequenceId from '../parse/parseSequenceId';
import parseSequence from '../parse/parseSequence';
import parseDotBracket from '../parse/parseDotBracket';
import checkSequenceAndPartnersCompatibility from '../parse/checkSequenceAndPartnersCompatibility';

class CreateNewDrawing extends React.Component {
  constructor(props) {
    super(props);

    let dei = this.defaultExampleInput();

    this.state = {
      exampleInput: dei.exampleInput,
      sequenceId: dei.sequenceId,
      sequence: dei.sequence,
      structure: dei.structure
    };
  }

  defaultExampleInput() {
    return {
      exampleInput: '--- None ---',
      sequenceId: '',
      sequence: '',
      structure: ''
    };
  }

  /**
   * @returns {object} Example inputs keyed by sequence ID.
   */
  exampleInputs() {
    return [
      this.defaultExampleInput(),
      {
        exampleInput: 'A Hairpin',
        sequenceId: 'A Hairpin',
        sequence: 'AUGCAUGGUAGCAU',
        structure: '((((......))))'
      },
      {
        exampleInput: 'Two Hairpins',
        sequenceId: 'Two Hairpins',
        sequence: 'AACCGGAAUUCCGGAAUUCCGGAAUUCCGGUU',
        structure: '..((((....))))....((((....))))..'
      }
    ];
  }

  _title() {
    return (
      <p
        className={'unselectable-text'}
        style={{
          margin: '12px 24px 0px 24px',
          fontSize: '24px'
        }}
      >
        Create a New Drawing
      </p>
    );
  }

  _titleUnderline() {
    return (
      <div
        style={{
          height: '1px',
          margin: '8px 16px 0px 16px',
          backgroundColor: '#bfbfbf'
        }}
      ></div>
    );
  }

  _exampleInputDiv() {
    return (
      <div
        style={{
          margin: '16px 28px 0px 28px',
          alignItems: 'center'
        }}
      >
        {this._exampleInputLabel()}
        {this._exampleInputSelect()}
      </div>
    );
  }

  _exampleInputLabel() {
    return (
      <p
        className={'unselectable-text'}
        style={{
          margin: '0px 8px 0px 0px',
          fontSize: '12px',
          display: 'inline-block'
        }}
      >
        Example Input:
      </p>
    );
  }

  _exampleInputSelect() {
    function option(ei) {
      return <option key={ei.exampleInput} value={ei.exampleInput}>{ei.exampleInput}</option>
    }

    return (
      <select
        value={this.state.exampleInput}
        onChange={event => this._onExampleInputSelectChange(event)}
        style={{
          fontSize: '12px'
        }}
      >
        {this.exampleInputs().map(ei => option(ei))}
      </select>
    );
  }

  _onExampleInputSelectChange(event) {
    let ei = this.exampleInputs().find(ei => ei.exampleInput === event.target.value);

    this.setState({
      exampleInput: ei.exampleInput,
      sequenceId: ei.sequenceId,
      sequence: ei.sequence,
      structure: ei.structure
    });
  }

  _sequenceIdDiv() {
    return (
      <div
        style={{
          margin: '16px 28px 0px 28px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        {this._sequenceIdLabel()}
        {this._sequenceIdInput()}
      </div>
    );
  }

  _sequenceIdLabel() {
    return (
      <p
        className={'unselectable-text'}
        style={{
          margin: '0px 8px 0px 0px',
          fontSize: '12px',
          display: 'inline-block'
        }}
      >Sequence ID:</p>
    );
  }

  _sequenceIdInput() {
    return (
      <input
        type={'text'}
        value={this.state.sequenceId}
        onChange={event => this._onSequenceIdInputChange(event)}
        spellCheck={'false'}
        placeholder={' ...the name of your sequence'}
        style={{
          flexGrow: '1'
        }}
      />
    );
  }

  _onSequenceIdInputChange(event) {
    this.setState({
      sequenceId: event.target.value
    });
  }

  _sequenceLabel() {
    return (
      <p
        className={'unselectable-text'}
        style={{
          margin: '16px 28px 0px 28px',
          fontSize: '12px'
        }}
      >
        Sequence:
      </p>
    );
  }

  _sequenceTextarea() {
    return (
      <textarea
        value={this.state.sequence}
        onChange={event => this._onSequenceTextareaChange(event)}
        spellCheck={'false'}
        placeholder={' ...an RNA or DNA sequence, e.g. "AUGCAUUACGUA"'}
        style={{
          flexGrow: '1',
          margin: '4px 28px 0px 28px',
          fontSize: '12px'
        }}
      />
    );
  }

  _onSequenceTextareaChange(event) {
    this.setState({
      sequence: event.target.value
    });
  }

  _structureLabel() {
    return (
      <p
        className={'unselectable-text'}
        style={{
          margin: '16px 28px 0px 28px',
          fontSize: '12px'
        }}
      >
        Structure (optional):
      </p>
    );
  }

  _structureTextarea() {
    return (
      <textarea
        value={this.state.structure}
        onChange={event => this._onStructureTextareaChange(event)}
        spellCheck={'false'}
        placeholder={' ...the secondary structure in dot-bracket notation, e.g "((((....))))"'}
        style={{
          flexGrow: '1',
          margin: '4px 28px 0px 28px',
          fontSize: '12px'
        }}
      />
    );
  }

  _onStructureTextareaChange(event) {
    this.setState({
      structure: event.target.value
    });
  }

  _submitDiv() {
    return (
      <div
        style={{
          margin: '16px 28px 16px 28px'
        }}
      >
        {this._submitButton()}
      </div>
    );
  }

  _submitButton() {
    return (
      <button
        onClick={() => this._submit()}
        style={{
          padding: '4px 32px 4px 32px',
          fontSize: '12px'
        }}
      >
        Submit
      </button>
    );
  }

  render() {
    return (
      <div
        style={{
          width: this.props.width,
          height: this.props.height,
          backgroundColor: '#fcfcfc',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {this._title()}
        {this._titleUnderline()}
        {this._exampleInputDiv()}
        {this._sequenceIdDiv()}
        {this._sequenceLabel()}
        {this._sequenceTextarea()}
        {this._structureLabel()}
        {this._structureTextarea()}
        {this._submitDiv()}
      </div>
    );
  }

  _submit() {
    try {
      let sequenceId = parseSequenceId(this.state.sequenceId);

      let sequence = parseSequence(this.state.sequence, {
        toUpperCase: true,
        t2u: true,
        ignoreNumbers: true,
        ignoreNonAUGCTLetters: true,
        ignoreNonAlphanumerics: true
      });

      if (sequence.length === 0) {
        throw new Error('Sequence length cannot be zero.');
      }
      
      let partners = parseDotBracket(
        this.state.structure,
        { ignoreTertiaryPairings: true }
      );
      
      checkSequenceAndPartnersCompatibility(sequence, partners);
      
      this.props.actionCallback({
        type: 'closeThisForm'
      });

      /*
      this.props.actionCallback({
        type: 'createDrawing',
        sequenceId: sequenceId,
        sequence: sequence,
        partners: partners
      });
      */
    
    } catch (e) {
      alert(e.message);
    }
  }
}

CreateNewDrawing.defaultProps = {

  // set width to 100vw to block view of empty drawing
  width: '100vw',

  height: '100%'
};

export default CreateNewDrawing;
