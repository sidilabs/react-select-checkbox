import { useState, useEffect } from 'react';
import { MultiSelectCheckbox } from '../../components';

type Option = {
  label: string;
  value: string;
};

type Options = Option[];

type Props = {
  options: Options;
  selectedIds: string[];
  isDisabled?: boolean;
  onOptionChange: (o: Options) => void;
  message?: string;
  onFocus?: () => void;
  onMenuClose?: () => void;
};

const SelectCheckboxAll = ({ options, selectedIds, isDisabled, onOptionChange, onFocus, onMenuClose }: Props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Options>([]);

  useEffect(() => {
    const selectedOptionsFromIds = options.filter((o) => !!selectedIds.find((id) => id == o.value));
    if (isLoaded && JSON.stringify(selectedOptionsFromIds) != JSON.stringify(selectedOptions)) {
      handleChange(selectedOptionsFromIds, {}, false);
    }
  }, [JSON.stringify(selectedIds), JSON.stringify(options)]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  function getDropdownButtonLabel({
    placeholderButtonLabel,
    value,
  }: {
    placeholderButtonLabel: string;
    value?: Option[];
  }) {
    if (value && value.some((o: Option) => o.value === '*')) {
      return `${placeholderButtonLabel} All`;
    } else if (value?.length === 1) {
      return value[0].label;
    } else {
      return `${placeholderButtonLabel} ${value?.length} selected`;
    }
  }

  function handleChange(value: Option[], event: { action?: string; option?: Option }, fireEvent = true) {
    let newSelection: Option[] = [];
    if (event.action === 'select-option' && event.option?.value === '*') {
      newSelection = [{ label: 'All', value: '*' }, ...options];
    } else if (event.action === 'deselect-option' && event.option?.value === '*') {
      newSelection = [];
    } else if (event.action === 'deselect-option') {
      newSelection = value.filter((o: Option) => o.value !== '*');
    } else if (value.length === options.length) {
      newSelection = [{ label: 'All', value: '*' }, ...options];
    } else {
      newSelection = value;
    }
    setSelectedOptions(newSelection);
    if (isLoaded && fireEvent) onOptionChange(newSelection.filter((s) => s.value !== '*'));
  }
  return (
    <MultiSelectCheckbox
      onFocus={onFocus}
      onMenuClose={onMenuClose}
      isDisabled={isDisabled}
      options={[{ label: 'All', value: '*' }, ...options]}
      placeholderButtonLabel=""
      getDropdownButtonLabel={getDropdownButtonLabel}
      value={selectedOptions}
      onChange={handleChange}
      styles={{
        menu: (provided) => ({ ...provided, zIndex: 9999 }),
        control: (provided, state) => {
          return {
            ...provided,
            borderColor: '#d8dbe0',
            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
            boxShadow: state.isFocused ? '0 0 0 0.2rem rgb(51 51 51 / 25%)' : '',
          };
        },
      }}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: '#777',
        },
      })}
    />
  );
};

export default SelectCheckboxAll;
