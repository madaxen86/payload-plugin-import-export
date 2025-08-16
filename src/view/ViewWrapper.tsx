'use client'
import { useAuth, useConfig } from '@payloadcms/ui'
import { useRouter } from 'next/navigation.js'
import { createContext, useContext, useMemo } from 'react'

import { ExportButton } from '../components/export/ExportButton.js'
import { ImportButton } from '../components/import/ImportButton.js'

type CTX = {
  exportSlug: string
  importSlug: string
  slug: string
}
const Context = createContext<CTX | null>(null)
export const useCollectionContext = () => {
  const ctx = useContext(Context)
  if (!ctx) {
    throw new Error('useCollectionContext must be used within a CollectionProvider')
  }
  return ctx
}

export function ViewWrapper({ collectionSlug }: { collectionSlug: string }) {
  const { config } = useConfig()
  const user = useAuth()

  const router = useRouter()

  const hasPermissions = useMemo(() => {
    if (!config.custom?.importExportPluginConfig.canImport) {
      return true
    }
    return config.custom.importExportPluginConfig.canImport(user)
  }, [config.custom?.importExportPluginConfig, user])

  if (!user.permissions?.canAccessAdmin || !user) {
    router.back()
    return null
  }

  return (
    <Context.Provider
      value={{
        slug: collectionSlug,
        exportSlug: collectionSlug + '_export',
        importSlug: collectionSlug + '_import',
      }}
    >
      {hasPermissions ? (
        <>
          <ExportButton />
          <ImportButton />
        </>
      ) : null}
    </Context.Provider>
  )
}

export default ViewWrapper
