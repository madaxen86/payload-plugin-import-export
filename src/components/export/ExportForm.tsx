'use client'

import type { ClientCollectionConfig, Field, PaginatedDocs } from 'payload'

import { Button, SelectInput, toast, useConfig, useLocale } from '@payloadcms/ui'
import Papa from 'papaparse'
import { flattenTopLevelFields } from 'payload'
import { useMemo, useRef, useState } from 'react'

import { getCSVColumnNamesAndFlattendedData } from '../../utils/csv.js'
import { useCollectionContext } from '../../view/ViewWrapper.js'
import { MultiSelect } from '../multiSelect/index.js'
import styles from './ExportForm.module.css'
type Props = {
  collection: ClientCollectionConfig
}
const options = [
  { label: 'JSON', value: 'json' },
  { label: 'CSV', value: 'csv' },
]
type Option = (typeof options)[number]

export function ExportForm() {
  const ref = useRef<HTMLAnchorElement>(null)
  const [format, setFormat] = useState(options[0])
  const { config } = useConfig()
  const { slug } = useCollectionContext()
  const collection = config.collections.find((c) => c.slug === slug)
  const fields = useMemo(() => {
    if (!collection) {
      return []
    }
    return createFlattenedFields(collection)
  }, [collection])

  const [selectedFields, setSelectedFields] = useState<Option[]>(fields)

  const locale = useLocale()
  const {
    routes: { api },
    serverURL,
  } = config

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      return toast.error('Please select fields to export')
    }
    const search = new URLSearchParams(window?.location.toString())
    search.set('limit', '0') // removes the limit
    if (locale.code) {
      search.set('locale', locale.code)
    }
    try {
      const data = (await fetch(`${serverURL}${api}/${slug}?${search.toString()}`, {
        method: 'GET',

        credentials: 'include',
        headers: {
          'Content-type': 'application/json',
        },
      }).then((res) => res.json())) as PaginatedDocs<Record<string, any>>

      let href = ''
      let download = ''
      const date = new Date().toISOString().replace(':', '')
      const lang = locale.code ? `_${locale.code}` : ''

      const docs = data.docs

      if (format.value === 'csv') {
        // const flattenedData = filteredData.map((doc) => flatten(doc));

        const [columns, flattenedData] = getCSVColumnNamesAndFlattendedData(
          docs,
          selectedFields?.map((o) => o.value),
        )

        const csv = Papa.unparse(flattenedData, { columns })
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
        href = URL.createObjectURL(blob)
        download = `Export_${slug}${lang}_${date}.csv`
      }

      if (format.value === 'json') {
        const filteredData =
          selectedFields.length === fields.length
            ? docs
            : docs.map((doc) =>
                selectedFields
                  .map((o) => o.value)
                  .reduce(function (o: Record<string, unknown>, k: string) {
                    o[k] = doc[k]
                    return o
                  }, {}),
              )
        href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(filteredData))}`
        download = `Export_${slug}${lang}_${date}.json`
      }

      ref.current?.setAttribute('href', href)
      ref.current?.setAttribute('download', download)
      ref.current?.click()
    } catch (_) {
      toast.error('Failed to fetch data')
    }
  }

  return (
    <>
      <h1>Export</h1>
      <div className={'card'}>
        <div className={styles.cardContent}>
          <div>
            <label className="field-label" htmlFor={'format'}>
              Output format
            </label>
            <SelectInput
              // isSearchable={false}
              isClearable={false}
              name="format"
              onChange={(val) => setFormat(val as Option)}
              options={options}
              path="format"
              required
              value={format.value}
            />
          </div>
          <div>
            <label className="field-label" htmlFor={'fields'}>
              Fields
            </label>
            <MultiSelect
              options={fields}
              selected={selectedFields}
              setSelected={setSelectedFields}
              title="Fields"
            />
          </div>

          <Button className={styles.exportButton} onClick={handleExport}>
            Export
          </Button>
        </div>
      </div>

      <a
        aria-hidden="true"
        aria-label="hidden download link"
        className={styles.hidden}
        hidden
        href="/#"
        ref={ref}
      />
    </>
  )
}

function createFlattenedFields(
  collection: Props['collection'],
): { label: string; value: string }[] {
  if (!collection.fields) {
    return []
  }
  return flattenTopLevelFields(collection.fields as unknown as Field[]).map((f) => ({
    label: `${typeof f.label === 'string' ? f.label : f.name}`,
    value: `${f.name}`,
  }))
}
