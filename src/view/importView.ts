import { AdminView, Config } from "payload/config";
import ViewWrapper from "./ViewWrapper";
import { PluginTypes } from "../types";

type adminViews = { [key: string]: AdminView };

export const importViews: (config: Config, pluginOptions?: PluginTypes) => adminViews = (
  config,
  pluginOptions,
) => {
  let importViews: adminViews = {};
  let paths: string[] = [];
  if (!pluginOptions || !pluginOptions?.excludeCollections) {
    paths.push("/collections/:slug/import");
  } else {
    paths = config
      .collections!.filter(
        (collection) => !pluginOptions.excludeCollections?.includes(collection.slug),
      )
      .map((collection) => `/collections/:${collection.slug}/import`);
  }
  paths.forEach((path) => {
    importViews[`Import${path}`] = {
      Component: ViewWrapper,
      path,
    };
  });
  return importViews;
};
