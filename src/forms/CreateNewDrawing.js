import React from 'react';

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
      exampleInput: '--- None --- ',
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
      }
    ];
  }

  stylesUnselectableText() {
    return {
      userSelect: 'none',
      cursor: 'default'
    };
  }

  stylesOutermostDiv() {
    return {
      width: this.props.width,
      height: this.props.height,
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column'
    };
  }

  stylesTitle() {
    return {
      ...this.stylesUnselectableText(),
      margin: '12px 24px 0px 24px',
      fontSize: '28px'
    };
  }

  stylesTitleUnderline() {
    return {
      height: '0.75px',
      margin: '8px 16px 0px 16px',
      backgroundColor: '#bfbfbf'
    };
  }

  stylesExampleInputDiv() {
    return {
      margin: '18px 28px 0px 28px',
      alignItems: 'center'
    };
  }

  stylesExampleInputLabel() {
    return {
      ...this.stylesUnselectableText(),
      margin: '0px 8px 0px 0px',
      fontSize: '14px',
      display: 'inline-block'
    };
  }

  stylesExampleInputSelect() {
    return {
      fontSize: '14px'
    };
  }

  _exampleInputSelect() {
    function option(ei) {
      return <option key={ei.exampleInput} value={ei.exampleInput}>{ei.exampleInput}</option>
    }

    return (
      <select value={this.state.exampleInput} onChange={event => this._onExampleInputSelectChange(event)} style={this.stylesExampleInputSelect()} >
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

  stylesSequenceIdDiv() {
    return {
      margin: '18px 28px 0px 28px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    };
  }

  stylesSequenceIdLabel() {
    return {
      ...this.stylesUnselectableText(),
      margin: '0px 8px 0px 0px',
      fontSize: '14px',
      display: 'inline-block'
    };
  }

  stylesSequenceIdInput() {
    return {
      flexGrow: '1'
    };
  }

  _sequenceIdInput() {
    return (
      <input
        type={'text'}
        value={this.state.sequenceId}
        onChange={event => this._onSequenceIdInputChange(event)}
        spellCheck={'false'}
        placeholder={this.sequenceIdPlaceholder}
        style={this.stylesSequenceIdInput()}
      />
    );
  }

  _onSequenceIdInputChange(event) {
    this.setState({
      sequenceId: event.target.value
    });
  }

  get sequenceIdPlaceholder() {
    return ' ...the name of your sequence';
  }

  stylesSequenceLabel() {
    return {
      ...this.stylesUnselectableText(),
      margin: '18px 28px 0px 28px',
      fontSize: '14px'
    };
  }

  stylesSequenceTextarea() {
    return {
      flexGrow: '1',
      margin: '4px 28px 0px 28px',
      fontSize: '14px'
    };
  }

  get sequencePlaceholder() {
    return ' ...an RNA or DNA sequence, e.g. "AUGCAUUACGUA"';
  }

  _sequenceTextarea() {
    return (
      <textarea
        value={this.state.sequence}
        onChange={event => this._onSequenceTextareaChange(event)}
        spellCheck={'false'}
        placeholder={this.sequencePlaceholder}
        style={this.stylesSequenceTextarea()}
      />
    );
  }

  _onSequenceTextareaChange(event) {
    this.setState({
      sequence: event.target.value
    });
  }

  stylesStructureLabel() {
    return {
      ...this.stylesUnselectableText(),
      margin: '18px 28px 0px 28px',
      fontSize: '14px'
    };
  }

  stylesStructureTextarea() {
    return {
      flexGrow: '1',
      margin: '4px 28px 0px 28px',
      fontSize: '14px'
    };
  }

  get structurePlaceholder() {
    return ' ...the secondary structure in dot-bracket notation, e.g "((((....))))"';
  }

  _structureTextarea() {
    return (
      <textarea
        value={this.state.structure}
        onChange={event => this._onStructureTextareaChange(event)}
        spellCheck={'false'}
        placeholder={this.structurePlaceholder}
        style={this.stylesStructureTextarea()}
      />
    );
  }

  _onStructureTextareaChange(event) {
    this.setState({
      structure: event.target.value
    });
  }

  stylesSubmitOuterDiv() {
    return {
      margin: '18px 28px 18px 28px',
      display: 'flex',
      flexDirection: 'row'
    };
  }

  stylesSubmitInnerDiv() {
    return {
      flexGrow: '1'
    };
  }

  stylesSubmitButton() {
    return {
      padding: '8px 64px 8px 64px',
      fontSize: '12px'
    };
  }

  render() {
    return (
      <div style={this.stylesOutermostDiv()} >
        <p style={this.stylesTitle()} >Create a New Drawing</p>
        <div style={this.stylesTitleUnderline()} ></div>
        <div style={this.stylesExampleInputDiv()} >
          <p style={this.stylesExampleInputLabel()} >Example Input:</p>
          {this._exampleInputSelect()}
        </div>
        <div style={this.stylesSequenceIdDiv()} >
          <p style={this.stylesSequenceIdLabel()} >Sequence ID:</p>
          {this._sequenceIdInput()}
        </div>
        <p style={this.stylesSequenceLabel()} >Sequence:</p>
        {this._sequenceTextarea()}
        <p style={this.stylesStructureLabel()} >Structure (optional):</p>
        {this._structureTextarea()}
        <div style={this.stylesSubmitOuterDiv()} >
          <div style={this.stylesSubmitInnerDiv()} ></div>
          <button onClick={() => this._submit()} style={this.stylesSubmitButton()} >Submit</button>
        </div>
      </div>
    );
  }

  _submit() {
    console.log([
      this.state.exampleInput,
      this.state.sequenceId,
      this.state.sequence,
      this.state.structure
    ].toString());
  }
}

CreateNewDrawing.defaultProps = {
  width: '100%',
  height: '100%'
};

export default CreateNewDrawing;
