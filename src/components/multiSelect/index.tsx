import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import ReactSelect, { ActionMeta, Options } from "react-select";

import makeAnimated from "react-select/animated";
import { reactSelectStyle } from "../select";

const animate = makeAnimated();

interface Props extends React.ComponentProps<typeof ReactSelect> {
  options: Option[];
  selected: Option[];
  setSelected: Dispatch<SetStateAction<any>>;
  title: string;
  hide?: boolean;
  initialAction?: () => void;
}

export type Option = {
  value: number | string;
  label: string;
};

/* Advanced Dropdown Select Menu using React select
 * Inspired by https://stackoverflow.com/a/61250357/20007391 and
 * added typing.
 *
 * For more information about the react-select API, options, and
 * customization, see https://react-select.com/home
 *
 * This component is just the select box. Options are passed in from
 * the parent and the parent maintains the state of the object for
 * callbacks and function handling. */
export const selectAllOption = { value: "*", label: "Select All" };

export const MultiSelect = React.forwardRef<any, Props>(
  ({ title, selected, setSelected, options, hide, initialAction, ...rest }: Props, ref) => {
    // For component "memory"

    const valueRef = useRef(selected);
    valueRef.current = selected;

    const isSelectAllSelected = () => valueRef.current.length === options.length; // && options.length > 1;
    const isOptionSelected = (option: Option, selectValue: Options<Option>) =>
      valueRef.current.some(({ value }) => value === option.value) || isSelectAllSelected();

    // const getOptions = () => (isSelectAllSelected() ? [] : [selectAllOption, ...options]);
    const getOptions = () => (options.length > 1 ? [selectAllOption, ...options] : [...options]);
    const getValue = () => (isSelectAllSelected() ? [selectAllOption] : selected);

    const handleSelect = (newValue: unknown, actionMeta: ActionMeta<unknown>) => {
      const { action, option, removedValue } = actionMeta;
      // Reassigning for typing. Unknown by default
      const opt = option as Option;
      const removed = removedValue as Option;
      if (action === "select-option" && opt.value === selectAllOption.value) {
        setSelected(options);
      } else if (
        (action === "deselect-option" && opt.value === selectAllOption.value) ||
        (action === "remove-value" && removed.value === selectAllOption.value)
      ) {
        setSelected([]);
      } else if (actionMeta.action === "deselect-option" && isSelectAllSelected()) {
        setSelected(options.filter(({ value }) => value !== opt.value));
      } else {
        setSelected(newValue || []);
      }
      //
    };

    useEffect(() => {
      initialAction?.();
    }, []);

    return (
      <ReactSelect
        ref={ref}
        {...rest}
        animate={animate}
        // @ts-ignore
        isOptionSelected={isOptionSelected}
        closeMenuOnSelect={false}
        // defaultValue={selectAllOption} // Should default to select all option
        value={getValue()}
        isMulti
        placeholder={title}
        options={getOptions()}
        onChange={handleSelect}
        hideSelectedOptions={hide ?? false}
        instanceId={title}
        id={title}
        styles={reactSelectStyle}
      />
    );
  },
);
