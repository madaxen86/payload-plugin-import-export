import type { Props as ListProps } from "payload/components/views/list";
import React, { useState } from "react";
import { ExportButtonList } from "../export";
import ExportExpand from "../export/ExportExpand";
import ImportList from "../import";
import styles from "./index.module.css";

export function Container(props: ListProps) {
  const [openExport, setOpenExport] = useState(false);

  return (
    <>
      <div className={styles.container}>
        <ExportButtonList onClick={() => setOpenExport(prev => !prev)} open={openExport} />
        <ImportList collection={props.collection} />
      </div>
      <ExportExpand open={openExport} collection={props.collection} />
    </>
  );
}

export default Container;
