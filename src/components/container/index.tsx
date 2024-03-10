import type { Props as ListProps } from "payload/components/views/list";
import React, { useState } from "react";
import { ExportButtonList } from "../export";
import ExportExpand from "../export/ExportExpand";
import ImportList from "../import";
import styles from "./index.module.css";

export type Ctx = ListProps;

export function Container(ctx: Ctx) {
  const [openExport, setOpenExport] = useState(false);

  return (
    <>
      <div className={styles.container}>
        <ExportButtonList onClick={() => setOpenExport(prev => !prev)} open={openExport} />
        <ImportList {...ctx} />
      </div>
      <ExportExpand open={openExport} collection={ctx.collection} />
    </>
  );
}

export default Container;
