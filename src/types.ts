export interface PluginTypes {
  /**
   * Enable or disable plugin
   * @default false
   */
  enabled?: boolean;
  excludeCollections?: string[];
}

export interface NewCollectionTypes {
  title: string;
}
