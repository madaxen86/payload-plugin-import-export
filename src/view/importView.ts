import { AdminView, Config } from "payload/config";
import ViewWrapper from "./ViewWrapper";
import { PluginTypes } from "../types";

//@ts-ignore -- path should be string not string[] but it is accepted as in ReactRouterDocs
export const importView: (config: Config, pluginOptions?: PluginTypes) => AdminView = (
  config,
  pluginOptions,
) => {
  if (!pluginOptions || !pluginOptions?.excludeCollections)
    return { Component: ViewWrapper, path: "/collections/:slug/import" };

  return {
    Component: ViewWrapper,
    path: config
      .collections!.filter(
        (collection) => !pluginOptions.excludeCollections?.includes(collection.slug),
      )
      .map((collection) => `/collections/:${collection.slug}/import`),
  };
};
