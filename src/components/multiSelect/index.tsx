// import { ReactSelect, SelectInput } from '@payloadcms/ui'
// import React, { useEffect, useRef } from 'react'

// interface Props extends Pick<React.ComponentProps<typeof SelectInput>, 'value'> {
//   hide?: boolean
//   initialAction?: () => void
//   name: string
//   onChange: (option: Option[]) => void
//   options: Option[]
//   selected: Option[]
//   title: string
// }

// export type Option = {
//   label: string
//   value: string
// }

// /* Advanced Dropdown Select Menu using React select
//  * Inspired by https://stackoverflow.com/a/61250357/20007391 and
//  * added typing.
//  *
//  * For more information about the react-select API, options, and
//  * customization, see https://react-select.com/home
//  *
//  * This component is just the select box. Options are passed in from
//  * the parent and the parent maintains the state of the object for
//  * callbacks and function handling. */
// export const selectAllOption = { label: 'Select All', value: '*' }

// export const MultiSelect = React.forwardRef<any, Props>(
//   ({ name, initialAction, onChange, options, selected }: Props, ref) => {
//     // For component "memory"

//     const isSelectAllSelected = () => selected?.length === options?.length // && options.length > 1;

//     // const getOptions = () => (isSelectAllSelected() ? [] : [selectAllOption, ...options]);
//     const getOptions = () => {
//       if (!options) {
//         return []
//       }
//       if (isSelectAllSelected()) {
//         return options
//       }
//       return [selectAllOption, ...options]
//     }

//     const handleSelect = (values: Option[]) => {
//       // const { action, option, removedValue } = actionMeta
//       // // Reassigning for typing. Unknown by default
//       // const opt = option as Option
//       // const removed = removedValue as Option
//       // if (action === 'select-option' && opt.value === selectAllOption.value) {
//       //   setSelected(options)
//       // } else if (
//       //   (action === 'deselect-option' && opt.value === selectAllOption.value) ||
//       //   (action === 'remove-value' && removed.value === selectAllOption.value)
//       // ) {
//       //   setSelected([])
//       // } else if (actionMeta.action === 'deselect-option' && isSelectAllSelected()) {
//       //   setSelected(options?.filter(({ value }) => value !== opt.value))
//       // } else {
//       //   setSelected(newValue || [])
//       // }
//       //
//       if (values.some(({ value }) => value === '*')) {
//         return onChange(options)
//       }
//       onChange(values)
//     }

//     useEffect(() => {
//       initialAction?.()
//     }, [initialAction])

//     return (
//       <ReactSelect
//         ref={ref}
//         {...rest}
//         animate={animate}
//         // @ts-ignore
//         isOptionSelected={isOptionSelected}
//         closeMenuOnSelect={false}
//         // defaultValue={selectAllOption} // Should default to select all option
//         value={getValue()}
//         isMulti
//         placeholder={title}
//         options={getOptions()}
//         onChange={handleSelect}
//         hideSelectedOptions={hide ?? false}
//         instanceId={title}
//         id={title}
//         styles={reactSelectStyle}
//       />
//       // <SelectInput

import type { Dispatch, SetStateAction } from 'react'

//       //   hasMany
//       //   //@ts-expect-error - not typed
//       //   onChange={handleSelect}
//       //   options={getOptions()}
//       //   path={name}
//       //   ref={ref}
//       //   value={selected?.map((o) => o.value + '')}
//       // />
//     )
//   },
// )
import { ReactSelect } from '@payloadcms/ui'
import React, { useEffect, useRef } from 'react'

interface Props extends React.ComponentProps<typeof ReactSelect> {
  hide?: boolean
  initialAction?: () => void
  options: Option[]
  selected: Option[]
  setSelected: Dispatch<SetStateAction<any>>
  title: string
}

export type Option = {
  label: string
  value: number | string
}

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
export const selectAllOption = { label: 'Select All', value: '*' }

export const MultiSelect = ({
  initialAction,
  options,
  selected,
  setSelected,
  title,
  ...rest
}: Props) => {
  // For component "memory"

  const valueRef = useRef(selected)
  valueRef.current = selected

  const isSelectAllSelected = () => valueRef.current.length === options.length // && options.length > 1;
  const isOptionSelected = (option: Option) =>
    valueRef.current.some(({ value }) => value === option.value) || isSelectAllSelected()

  // const getOptions = () => (isSelectAllSelected() ? [] : [selectAllOption, ...options]);
  const getOptions = () => {
    if (!options) {
      return []
    }
    if (isSelectAllSelected()) {
      return options
    }
    return [selectAllOption, ...options]
  }
  const getValue = () => (isSelectAllSelected() ? [selectAllOption] : selected)

  const handleSelect = (newValues: Option[]) => {
    console.log('newValues', newValues)

    if (newValues?.some(({ value }) => value === '*')) {
      console.log('******')

      return setSelected(options)
    }
    setSelected(newValues || [])
  }

  useEffect(() => {
    initialAction?.()
  }, [])

  return (
    <ReactSelect
      {...rest}
      blurInputOnSelect={true}
      isMulti
      isOptionSelected={isOptionSelected}
      //@ts-expect-error - not typed as multivalue
      onChange={handleSelect}
      options={getOptions()}
      placeholder={title}
      value={selected}
    />
  )
}
