import { User } from "payload/dist/auth";

export interface PluginTypes {
  /**
   * Enable or disable plugin
   * @default false
   */
  enabled?: boolean;
  collections?: string[],
  // excludeCollections?: string[];
  redirectAfterImport?: boolean;
  canImport?: (user: unknown) => boolean;
}

export interface NewCollectionTypes {
  title: string;
}
