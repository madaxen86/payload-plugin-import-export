import { useConfig } from "payload/components/utilities";

export function useSlug() {
  const paths = window.location.pathname.split("/");
  return paths[paths.indexOf("collections") + 1];
}
