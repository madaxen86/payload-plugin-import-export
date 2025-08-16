'use client'
import { Button, Dropzone as PayloadDropzone, useTranslation, XIcon } from '@payloadcms/ui'
import React from 'react'

import styles from './Dropzone.module.css'

type Props = {
  className?: string
  fileName?: string
  mimeTypes?: string[]
  onChange: (e: FileList | null | undefined) => void
}
export const Dropzone: React.FC<Props> = ({ fileName, mimeTypes, onChange }) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const { t } = useTranslation()

  return (
    <PayloadDropzone className={styles.dropZone} multipleFiles={false} onChange={onChange}>
      <Button
        buttonStyle="secondary"
        onClick={() => {
          inputRef.current?.click()
        }}
        size="small"
      >
        {t('upload:selectFile')}
      </Button>

      <input
        accept={mimeTypes?.join(',')}
        aria-hidden="true"
        hidden
        id="file-upload"
        onChange={(e) => onChange(e.target.files)}
        ref={inputRef}
        type="file"
      />

      <label htmlFor="file-upload">{fileName || 'or drop file here'}</label>
      <Button
        buttonStyle="transparent"
        icon={<XIcon />}
        onClick={() => {
          onChange(null)
        }}
        round
      />
    </PayloadDropzone>
  )
}
