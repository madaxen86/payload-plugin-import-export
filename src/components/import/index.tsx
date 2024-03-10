import React from "react";
import { ToastContainer } from "react-toastify";
import { Drawer, DrawerToggler, useDrawerSlug } from "payload/components/elements";

import { ImportForm } from "./ImportForm";

import type { Ctx } from "../container";

export function ImportList(ctx: Ctx) {
  const slug = useDrawerSlug(`import${ctx.collection.slug}`);

  return (
    <>
      <DrawerToggler className="pill pill--has-action pill--style-light" slug={slug}>
        Import
      </DrawerToggler>

      <Drawer slug={slug}>
        <ImportForm {...ctx} />
        <ToastContainer position="bottom-center" autoClose={30000} />
      </Drawer>
    </>
  );
}
export default ImportList;
