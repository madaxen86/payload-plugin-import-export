import type { Props as ListProps } from "payload/components/views/list";
import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import { ExportButtonList } from "../export";
import ExportExpand from "../export/ExportExpand";
import RouterLink from "../link/RouterLink";

export type Ctx = ListProps;

export function Container(ctx: Ctx) {
  const [openExport, setOpenExport] = useState(false);
  const styles = useStyles();
  return (
    <>
      <div className={styles.container}>
        <ExportButtonList onClick={() => setOpenExport((prev) => !prev)} open={openExport} />
        <RouterLink
          to={ctx.collection.slug + "/import"}
          className="pill pill--style-light pill--has-link pill--has-action"
        >
          <span className="pill__label">Import</span>
        </RouterLink>
      </div>
      <ExportExpand open={openExport} collection={ctx.collection} />
    </>
  );
}

export default Container;

const useStyles = createUseStyles({
  container: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "var(--base)",
    backgroundColor: "var(--theme-elevation-50)",
    padding: "calc(var(--base) / 2)",
  },
});
