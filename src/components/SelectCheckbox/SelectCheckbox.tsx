import { CSSProperties, useState } from 'react';
import Select, { ActionMeta, InputAction, ThemeConfig } from 'react-select';
import DropdownButton from './DropdownButton';
import DropdownIndicator from './DropdownIndicator';
import CheckboxOption from './CheckboxOption';

type Option = {
  label: string;
  value: string;
};

type JsonObj = { [key: string]: string | number | boolean | JsonObj };

type StyleFns = { [key: string]: (provided: JsonObj, state: JsonObj) => void };

type PropsMultiSelectCheckbox = {
  isDisabled?: boolean;
  options: Option[];
  value?: Option[];
  getDropdownButtonLabel: (data: { placeholderButtonLabel: string; value?: Option[] }) => string;
  placeholderButtonLabel: string;
  inputValue?: string;
  menuIsOpen?: boolean;
  onChange: (option: Option[], action: ActionMeta<Option>) => void;
  styles?: StyleFns;
  theme?: ThemeConfig;
  onFocus?: () => void;
  onMenuClose?: () => void;
};

type StateObj = { inputValue?: string; value?: Option[]; isOpen: boolean };

const SelectCheckbox = ({
  getDropdownButtonLabel,
  placeholderButtonLabel,
  options,
  onChange,
  value,
  styles,
  ...rest
}: PropsMultiSelectCheckbox) => {
  const [state, setState] = useState<StateObj>({ isOpen: false });

  function handleState(newStateValue: Partial<StateObj>) {
    setState((current) => ({ ...current, ...newStateValue }));
  }

  const defaultComponents = {
    // these are react-select components, with sane defaults for react-multiselect-checkboxes
    DropdownIndicator,
    IndicatorSeparator: null,
    Option: CheckboxOption,
  };

  const defaultStyles = {
    control: (provided: JsonObj) => ({ ...provided, minWidth: 240, margin: 8 }),
    menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' }),
    option: (provided: JsonObj, opts: JsonObj) => {
      if (opts.isSelected) {
        return {
          ...provided,
          color: '#000',
          backgroundColor: '#DDD',
          fontWeight: 'bold',
          minWidth: 240,
        };
      }
      return {
        ...provided,
        backgroundColor: 'transparent',
        minWidth: 240,
        ':hover': { backgroundColor: '#AAA' },
      };
    },
  };

  const onSelectChangeHandler = (values: Option[], action: ActionMeta<Option>) => {
    onChange(values, action);
  };

  const onInputChangeHandler = (inputValue: string, event: { action: InputAction }) => {
    switch (event.action) {
      case 'input-change':
        handleState({ inputValue });
        break;
      case 'menu-close':
        handleState({ inputValue: '' });
        break;
      default:
        break;
    }
  };

  const toggleOpenHandler = () => {
    setState((_state) => ({ isOpen: !_state.isOpen }));
  };

  function calcStyles() {
    // This is messy, but conceptually simple. We're just replacing react-select's defaults
    // with the defaults from defaultStyles for user-provided style functions.
    const propsStyles = { ...styles };
    Object.entries(defaultStyles).forEach(([k, defaultFunc]) => {
      if (propsStyles[k]) {
        const passedInStyleFunc = propsStyles[k];
        propsStyles[k] = (provided, selectState) => passedInStyleFunc(defaultFunc(provided, selectState), selectState);
      } else {
        propsStyles[k] = defaultFunc;
      }
    });
    return propsStyles;
  }

  const currStyles = calcStyles();

  const menuShadow = '#CCC';
  const menuStyle = {
    backgroundColor: 'white',
    borderRadius: 4,
    boxShadow: `0 0 0 1px ${menuShadow}, 0 4px 11px ${menuShadow}`,
    marginTop: '5px',
    position: 'absolute',
    zIndex: 2,
    width: '400px',
  } as CSSProperties;

  const clearMultipleSelect = () => {
    onSelectChangeHandler([], { action: 'deselect-option', option: undefined });
  };

  return (
    <div id="dropdown" style={{ position: 'relative' }}>
      <DropdownButton isOpen={state.isOpen} onPress={toggleOpenHandler} onClear={clearMultipleSelect}>
        {getDropdownButtonLabel({ placeholderButtonLabel, value })}
      </DropdownButton>
      {state.isOpen ? (
        <div id="menu" style={menuStyle}>
          <Select
            autoFocus
            isMulti
            closeMenuOnSelect={false}
            backspaceRemovesValue={false}
            components={defaultComponents}
            controlShouldRenderValue={false}
            hideSelectedOptions={false}
            isClearable={false}
            menuIsOpen
            onChange={(newValue, action) => onSelectChangeHandler([...newValue], action)}
            placeholder="Search..."
            styles={currStyles}
            tabSelectsValue={false}
            value={value}
            options={options}
            onInputChange={onInputChangeHandler}
            inputValue={state.inputValue}
            isSearchable
            {...rest}
          />
        </div>
      ) : null}
      {state.isOpen ? (
        <div
          id="blanket"
          style={{
            bottom: 0,
            left: 0,
            top: 0,
            right: 0,
            position: 'fixed',
            zIndex: 1,
          }}
          onClick={toggleOpenHandler}
        />
      ) : null}
    </div>
  );
};

export default SelectCheckbox;
