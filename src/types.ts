export interface PluginTypes {
  /**
   * Enable or disable plugin
   * @default false
   */
  enabled?: boolean;
  excludeCollections?: string[];
  redirectAfterImport?: boolean;
}

export interface NewCollectionTypes {
  title: string;
}
