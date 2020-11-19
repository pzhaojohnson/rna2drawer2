import * as React from 'react';
import Select from 'react-select';
import { getAtIndex } from '../../array/getAtIndex';

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
            let notArray = Array.isArray(couldBeArray) ? getAtIndex(couldBeArray, 0) : couldBeArray;
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
            fontFamily: 'Segoe UI',
            fontSize: '12px',
          }),
          control: (provided, state) => ({
            ...provided,
            minHeight: props.style?.select?.control?.minHeight ?? '22px',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: state.isFocused ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)',
            borderRadius: '2px',
            boxShadow: 'none',
            '&:hover': {
              borderColor: 'rgba(0,0,0,0.6)',
            },
          }),
          valueContainer: (provided, state) => ({
            ...provided,
            padding: '0px',
          }),
          indicatorsContainer: (provided, state) => ({
            ...provided,
            padding: '0px',
          }),
          dropdownIndicator: (provided, state) => ({
            ...provided,
            margin: '0px 2px',
            padding: '0px',
            color: state.isFocused ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)',
            transform: 'scale(0.75)',
            '&:hover': {
              color: 'rgba(0,0,0,0.6)',
            },
          }),
          indicatorSeparator: (provided, state) => ({
            ...provided,
            marginTop: '4px',
            marginBottom: '4px',
            backgroundColor: 'rgba(0,0,0,0.3)',
          }),
          menu: (provided, state) => ({
            ...provided,
            margin: '6px 0px',
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? 'gray' : 'white',
            fontFamily: props.valuesAreFontFamilies ? state.data.value : 'Segoe UI',
            color: state.isSelected ? 'white' : 'black',
            '&:hover': {
              backgroundColor: state.isSelected ? 'gray' : 'gainsboro',
              color: state.isSelected ? 'white' : 'black',
            },
          }),
          singleValue: (provided, state) => ({
            ...provided,
            marginLeft: '6px',
            marginRight: '6px',
            fontFamily: props.valuesAreFontFamilies ? state.data.value : 'Segoe UI',
            color: 'black',
          }),
        }}
      />
    </div>
  );
}
