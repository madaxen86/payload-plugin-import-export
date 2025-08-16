'use client'

import type { Dispatch, SetStateAction } from 'react'

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

  const isSelectAllSelected = () => valueRef.current.length === options.length
  const isOptionSelected = (option: Option) =>
    valueRef.current.some(({ value }) => value === option.value) || isSelectAllSelected()

  const getOptions = () => {
    if (!options) {
      return []
    }
    if (isSelectAllSelected()) {
      return options
    }
    return [selectAllOption, ...options]
  }

  const handleSelect = (newValues: Option[]) => {
    if (newValues?.some(({ value }) => value === '*')) {
      return setSelected(options)
    }
    setSelected(newValues || [])
  }

  useEffect(() => {
    initialAction?.()
  }, [initialAction])

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
