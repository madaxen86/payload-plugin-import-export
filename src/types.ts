export type PluginTypes = {
  canImport?: (user: unknown) => boolean
  enabled?: boolean
  excludeCollections?: string[]
}
