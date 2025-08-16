'use client'

import { Drawer, DrawerToggler, PopupList } from '@payloadcms/ui'

import { useCollectionContext } from '../../view/ViewWrapper.js'
import styles from './ImportButton.module.css'
import { ImportForm } from './ImportForm.js'
export function ImportButton() {
  const { importSlug } = useCollectionContext()

  return (
    <>
      <PopupList.Button>
        <DrawerToggler className={styles.btn} slug={importSlug}>
          Import
        </DrawerToggler>
      </PopupList.Button>
      <Drawer slug={importSlug}>
        <ImportForm />
      </Drawer>
    </>
  )
}
export default ImportButton
