'use client'
import type { Locale } from 'payload'

import Papa from 'papaparse'
import { useEffect, useRef, useState } from 'react'

import { unflatten } from '../../utils/flat.js'
import { splitResults } from './utils.js'

type Data = Array<Record<string, any>>

import {
  Button,
  CheckboxInput,
  Collapsible,
  DrawerToggler,
  Link,
  SelectInput,
  toast,
  useConfig,
  useLocale,
  useModal,
  useTranslation,
} from '@payloadcms/ui'
import { useRouter } from 'next/navigation.js'

import { useCollectionContext } from '../../view/ViewWrapper.js'
import { Dropzone } from '../dropzone/Dropzone.js'
import styles from './ImportForm.module.css'
export const ImportForm = ({ onFinish }: { onFinish?: () => void }) => {
  const [file, setFile] = useState<File | null>(null)
  const [data, setData] = useState<Data>([])
  const [fields, setFields] = useState([''])
  const inputRef = useRef<HTMLInputElement>(null)
  const inputRef2 = useRef<HTMLInputElement>(null)
  const [createIfNotExist, setCreateIfNotExist] = useState(false)
  const [keepIds, setKeepIds] = useState(false)
  const [selectedFields, _setSelectedFields] = useState([{ label: 'id', value: 'id' }])
  const setSelectedFields: typeof _setSelectedFields = (newVal) => {
    if (newVal === null || newVal.length === 0) {
      return _setSelectedFields([{ label: 'id', value: 'id' }])
    }
    _setSelectedFields(newVal)
  }

  const { config } = useConfig()
  const { slug, importSlug } = useCollectionContext()
  const { t } = useTranslation()
  const locale = useLocale()
  const drawer = useModal()

  useEffect(() => {
    const parseInputFile = async () => {
      if (!file) {
        toast.error('Please select a file first.')
        return
      }

      if (file.type === 'text/csv') {
        // Parsing CSV file
        Papa.parse<Data>(file, {
          complete: (result) => {
            const data = result?.data || []
            const unflattenedData = data.map((doc) => unflatten(doc))
            setData(unflattenedData)
            setFields(Object.keys(unflattenedData[0] || {}))
          },
          header: true,
        })
      } else if (file.type === 'application/json') {
        // Fetching JSON data
        const response = await fetch(URL.createObjectURL(file)).then((res) => res.json())

        setData(response)
        setFields(Object.keys(response[0] || {}))
      } else {
        toast.error('Unsupported file format. Please select a CSV or JSON file.')
      }
    }

    if (file) {
      parseInputFile().catch((e) => e)
    }
  }, [file])

  const router = useRouter()
  const {
    routes: { api },
    serverURL,
  } = config

  const handleFileChange = (list: FileList | null | undefined) => {
    if (!list) {
      return setFile(null)
    } else {
      setFile(list[0])
    }

    // Reset data and fields when a new file is selected
    setData([])
    setFields([])
    setSelectedFields([])
  }

  const handleImport = async () => {
    if (!data) {
      return
    }

    const selectedData = data.map((row) => {
      const selectedRow: Record<string, any> = selectedFields.includes({ label: 'id', value: 'id' })
        ? {}
        : { id: row.id }
      selectedFields.forEach((field) => {
        selectedRow[field.value] = row[field.value]
      })
      return selectedRow
    })

    try {
      const res = (await fetch(
        `${serverURL}${api}/${slug}/import${locale ? '?locale=' + locale?.code : ''}`,
        {
          body: JSON.stringify(selectedData),
          credentials: 'include',
          headers: {
            'Content-type': 'application/json',
            ...(createIfNotExist && { 'x-import-if-not-exists': 'true' }),
            ...(createIfNotExist && keepIds && { 'x-import-keep-ids': 'true' }),
          },
          method: 'PATCH',
        },
      ).then((res) => res.json())) as PromiseSettledResult<{ id: number | string }>[]

      displayResults(res, slug, locale)
      //refresh the collection view
      router.refresh()
      drawer.closeModal(importSlug)
    } catch (_) {
      //no error should be thrown because we use Promise.allSettled on API
    }
  }

  return (
    <>
      <div className={styles.flex}>
        <h1>Import to {slug.charAt(0).toUpperCase() + slug.slice(1)}</h1>
        <Dropzone fileName={file?.name} mimeTypes={['.csv', '.json']} onChange={handleFileChange} />

        <section className={[styles.section, styles.fullwidth].join(' ')}>
          <h4 className={styles.textCenter}>Select Fields</h4>
          <SelectInput
            className={fields.length <= 1 ? styles.disabled : ''}
            hasMany={true}
            name="fields"
            //@ts-expect-error - Selectinput is not typed
            onChange={setSelectedFields}
            options={fields.map((field) => ({ label: field, value: field }))}
            path="fields"
            readOnly={fields.length <= 1}
            title="Select Fields"
            value={selectedFields.map((field) => field.value)}
          />
        </section>

        <section className={[styles.section, styles.fullwidth].join(' ')}>
          <Collapsible header={'Preview Data (5 items max)'} initCollapsed={true}>
            <div className={styles.xScroll}>
              <table>
                <thead>
                  <tr>
                    {selectedFields.map((field, index) => (
                      <th key={index}>{field.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, data.length > 5 ? 5 : data.length).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {selectedFields.map((field, fieldIndex) => {
                        const value = row[field.value]
                        return (
                          <td key={fieldIndex + field.value}>
                            {typeof value === 'object' ? JSON.stringify(value) : value}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Collapsible>
        </section>
        <section>
          <CheckboxInput
            checked={createIfNotExist}
            inputRef={inputRef}
            Label={
              <button
                className={styles.checkboxlabel}
                onClick={() => inputRef.current?.click()}
                type="button"
              >
                Create if not exists
              </button>
            }
            onToggle={() => {
              setCreateIfNotExist((prev) => !prev)
            }}
          />
          <CheckboxInput
            checked={keepIds}
            inputRef={inputRef2}
            Label={
              <button
                className={styles.checkboxlabel}
                onClick={() => inputRef2.current?.click()}
                type="button"
              >
                KeepIds
              </button>
            }
            onToggle={() => {
              setKeepIds((prev) => !prev)
            }}
            readOnly={!createIfNotExist}
          />
        </section>
        <div className={styles.btnGroup}>
          <DrawerToggler className={styles.importBtn} slug={importSlug}>
            {t('general:cancel')}
          </DrawerToggler>

          <Button
            className={styles.importBtn}
            disabled={selectedFields.length <= 1}
            onClick={handleImport}
          >
            Import
          </Button>
        </div>
      </div>
    </>
  )
}

function displayResults(
  res: PromiseSettledResult<{ id: number | string }>[],
  slug: string,
  locale: Locale,
) {
  const [success, errors] = splitResults(res)

  if (success.length > 0) {
    toast.success(`Imported ${success.length} items successfully`)
  }

  if (errors.length > 0) {
    const csv = Papa.unparse(
      errors.map((err) => ({
        data: err.reason.data,
        reason: err.reason.name,
        status: err.status,
      })),
    )

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const csvDownloadUrl = URL.createObjectURL(blob)
    const date = new Date().toISOString().replace(':', '')
    const lang = locale.code ? `_${locale.code}` : ''
    toast.error(
      <div>
        {`Failed to import ${errors.length} items`}
        <Link
          download={`Import_Errors_${slug}${lang}_${date}.json`}
          href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(errors))}`}
        >
          Click to Download as JSON
        </Link>
        <Link
          download={`Import_Errors_${slug}${lang}_${locale.code}_${date}.csv`}
          href={csvDownloadUrl}
        >
          Click to Download as CSV
        </Link>
      </div>,
    )
  }
}
