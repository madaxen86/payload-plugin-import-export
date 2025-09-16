import type { Config } from 'payload'

import type { PluginTypes } from './types.js'

import { importEndpointConfig } from './endpoints/import.js'

export const plugin =
  (pluginOptions: PluginTypes) =>
  (config: Config): Config => {
    if (pluginOptions.enabled === false) {
      return config
    }
    if (!config.collections) {
      config.collections = []
    }

    if (!config.endpoints) {
      config.endpoints = []
    }

    if (!config.admin) {
      config.admin = {}
    }

    if (!config.admin.components) {
      config.admin.components = {}
    }

    config.collections.forEach((collection) => {
      if (pluginOptions.excludeCollections?.includes(collection.slug)) {
        return
      }

      if (!collection.endpoints && !Array.isArray(collection.endpoints)) {
        collection.endpoints = []
      }

      collection.endpoints.push({
        handler: importEndpointConfig,
        method: 'get',
        path: '/import',
      })
      collection.endpoints.push({
        handler: importEndpointConfig,
        method: 'patch',
        path: '/import',
      })

      if (!collection.hooks) {
        collection.hooks = {}
      }
      if (!collection.hooks.beforeValidate && !Array.isArray(collection.hooks.beforeValidate)) {
        collection.hooks.beforeValidate = []
      }

      collection.hooks.beforeValidate.push(async ({ context, data, operation, req }) => {
        if (operation !== 'create' || context?.keepId !== true || !context?.id) {
          return data
        }
        const idExists = await req.payload.count({
          collection: collection.slug,
          where: {
            id: context.id,
          },
        })
        if (idExists.totalDocs > 0) {
          return data
        }
        return {
          ...data,
          id: context.id,
        }
      })
      if (!collection.admin) {
        collection.admin = {}
      }

      if (!collection.admin.components) {
        collection.admin.components = {}
      }
      if (
        !collection.admin.components.listMenuItems &&
        !Array.isArray(collection.admin.components.listMenuItems)
      ) {
        collection.admin.components.listMenuItems = []
      }

      collection.admin?.components?.listMenuItems?.push({
        clientProps: {
          exportCollectionSlug: collection.slug,
        },
        path: 'payload-plugin-import-export/client#ViewWrapper',
      })
    })

    return config
  }

export default plugin
