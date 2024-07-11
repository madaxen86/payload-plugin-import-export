import { AdminView, Config } from "payload/config";
import ViewWrapper from "./ViewWrapper";
import { PluginTypes } from "../types";

type adminViews = { [key: string]: AdminView };

export const importViews: (config: Config, pluginOptions?: PluginTypes) => adminViews = (
  config,
  pluginOptions,
) => {
  let importViews: adminViews = {};
  if (!pluginOptions || !pluginOptions?.excludeCollections)
    return {
      Import: {
        Component: ViewWrapper,
        path: "/collections/:slug/import",
      },
    };
  config
    .collections!.filter(
      (collection) => !pluginOptions.excludeCollections?.includes(collection.slug),
    )
    .forEach((collection) => {
      importViews[`Import${collection.slug}`] = {
        Component: ViewWrapper,
        path: `/collections/:${collection.slug}/import`,
      };
    });

  return importViews;
};
