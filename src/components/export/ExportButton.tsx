'use client'

import { Drawer, DrawerToggler, PopupList } from '@payloadcms/ui'

import { useCollectionContext } from '../../view/ViewWrapper.js'
import styles from '../import/ImportButton.module.css'
import { ExportForm } from './ExportForm.js'

export function ExportButton() {
  const { exportSlug } = useCollectionContext()

  return (
    <>
      <PopupList.Button>
        <DrawerToggler className={styles.btn} slug={exportSlug}>
          Export
        </DrawerToggler>
      </PopupList.Button>
      <Drawer slug={exportSlug}>
        <ExportForm />
      </Drawer>
    </>
  )
}
export default ExportButton
