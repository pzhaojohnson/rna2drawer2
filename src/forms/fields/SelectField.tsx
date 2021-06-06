import * as React from 'react';
import Select from 'react-select';
import { atIndex } from 'Array/at';

interface ValueLabel {
  value: string;
  label: string;
}

function toValueLabel(value: string): ValueLabel {
  return { value: value, label: value };
}

interface Props {
  name: string;
  initialValue?: string;
  options: string[];
  set: (v: string) => void;
  style?: {
    label?: {
      marginRight?: string;
    }
    select?: {
      container?: {
        minWidth?: string;
      }
      control?: {
        minHeight?: string;
      }
    }
  }
  valuesAreFontFamilies?: boolean;
}

export function SelectField(props: Props): React.ReactElement {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
      <p style={{ display: 'inline-block', marginRight: props.style?.label?.marginRight ?? '12px' }} >
        {props.name + ':'}
      </p>
      <Select
        defaultValue={props.initialValue ? toValueLabel(props.initialValue) : undefined}
        options={props.options.map(o => toValueLabel(o))}
        placeholder=''
        isMulti={false}
        isClearable={false}
        isSearchable={false}
        onChange={couldBeNullish => {
          // the types for the onChange handler are a bit awkward to work with...
          if (couldBeNullish) {
            let couldBeArray = couldBeNullish;
            let notArray = Array.isArray(couldBeArray) ? atIndex(couldBeArray, 0) : couldBeArray;
            if (typeof notArray == 'object') {
              let isObject = notArray;
              if (typeof isObject.value == 'string') {
                let value = isObject.value;
                // in this app, setting a value often causes a field to be unmounted
                // and unmounting this field immediately after a change event
                // seems to cause a memory leak involving the underlying select element
                // as reported by a console message from the React framework
                setTimeout(() => props.set(value), 250);
              }
            }
          }
        }}
        styles={{
          container: (provided, state) => ({
            ...provided,
            minWidth: props.style?.select?.container?.minWidth ?? '200px',
            fontFamily: 'Open Sans',
            fontSize: '12px',
          }),
          control: (provided, state) => ({
            ...provided,
            minHeight: props.style?.select?.control?.minHeight ?? '22px',
            boxSizing: 'border-box',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: state.isFocused ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.2)',
            borderRadius: '2px',
            boxShadow: 'none',
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'rgba(0,0,0,0.8)',
            },
          }),
          valueContainer: (provided, state) => ({
            ...provided,
            padding: '0px',
            overflow: 'visible',
          }),
          indicatorsContainer: (provided, state) => ({
            ...provided,
            padding: '0px',
          }),
          dropdownIndicator: (provided, state) => ({
            ...provided,
            margin: '0px 2px',
            padding: '0px',
            color: 'rgba(0,0,0,0.8)',
            transform: state.isFocused ? 'scale(0.735)' : 'scale(0.6)',
            '&:hover': {
              color: 'rgba(0,0,0,0.8)',
              transform: 'scale(0.735)',
              transition: 'all 0.25s ease-in-out',
            },
          }),
          indicatorSeparator: (provided, state) => ({
            ...provided,
            marginTop: '6px',
            marginBottom: '6px',
            backgroundColor: 'rgba(0,0,0,0.1)',
          }),
          menu: (provided, state) => ({
            ...provided,
            margin: '6px 0px',
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? 'gray' : 'white',
            fontFamily: props.valuesAreFontFamilies ? state.data.value : 'Open Sans',
            color: state.isSelected ? 'white' : 'rgba(0,0,0,0.8)',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: state.isSelected ? 'gray' : 'gainsboro',
              color: state.isSelected ? 'white' : 'rgba(0,0,0,0.8)',
            },
          }),
          singleValue: (provided, state) => ({
            ...provided,
            marginLeft: '7px',
            marginRight: '7px',
            fontFamily: props.valuesAreFontFamilies ? state.data.value : 'Open Sans',
            color: 'rgba(0,0,0,0.8)',
            overflow: 'visible',
          }),
        }}
      />
    </div>
  );
}
