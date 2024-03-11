import { Drawer, DrawerToggler, useDrawerSlug } from "payload/components/elements";
import React from "react";
import { ToastContainer } from "react-toastify";

import type { Ctx } from "../container";
import RouterLink from "../link/RouterLink";

export function ImportList(ctx: Ctx) {
  const slug = useDrawerSlug(`import${ctx.collection.slug}`);

  return (
    <>
      <DrawerToggler className="pill pill--has-action pill--style-light" slug={slug}>
        Import
      </DrawerToggler>
      {/* <Link href={[ctx.collection.admin.,"collections", ctx.collection.slug, "import"].join("/")}>Import link</Link> */}
      <RouterLink to={ctx.collection.slug + "/import"}>Import link</RouterLink>
      <Drawer slug={slug}>
        {/* <ImportForm {...ctx} /> */}
        <ToastContainer position="bottom-center" autoClose={30000} />
      </Drawer>
    </>
  );
}
export default ImportList;
