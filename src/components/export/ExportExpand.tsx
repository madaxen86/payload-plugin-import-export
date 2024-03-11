import { Button } from "payload/components/elements";
import React, { useMemo, useRef, useState } from "react";
import AnimateHeight from "react-animate-height";
import ReactSelect from "react-select";
import { ToastContainer, toast } from "react-toastify";

import Papa from "papaparse";

import { useConfig, useLocale } from "payload/components/utilities";
import type { Props as ListProps } from "payload/components/views/list";
import { PaginatedDocs } from "payload/dist/database/types";
import flattenFields from "../../utils/flattenFields";
import Link from "../link";
import { MultiSelect } from "../multiSelect";
import { reactSelectStyle } from "../select";

import { createUseStyles } from "react-jss";
import { flatten } from "../../utils/flat";
import { getCSVColumnNamesAndFlattendedData } from "../../utils/csv";

type Props = {
  open: boolean;
  collection: ListProps["collection"];
};
const options = [
  { label: "JSON", value: "json" },
  { label: "CSV", value: "csv" },
];
type Option = (typeof options)[number];

export function ExportExpand({ open, collection }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [format, setFormat] = useState(options[0]);
  const fields = useMemo(createFlattenedFields(collection), [collection]);
  const [selectedFields, setSelectedFields] = useState<Option[]>(fields);

  const styles = useStyles();

  const config = useConfig();
  const locale = useLocale();

  if (!(config && config.serverURL)) {
    return null;
  }
  const {
    routes: { api },
    serverURL,
  } = config;

  const handleExport = async () => {
    if (selectedFields.length === 0) {
      return toast.error("Please select fields to export");
    }
    const search = new URLSearchParams(window?.location.toString());
    search.set("limit", "0"); // removes the limit
    locale.code && search.set("locale", locale.code);
    try {
      const data = (await fetch(`${serverURL}${api}/${collection.slug}?${search.toString()}`, {
        method: "GET",

        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      }).then((res) => res.json())) as PaginatedDocs<Record<string, any>>;

      let href = "";
      let download = "";
      const date = new Date().toISOString().replace(":", "");
      const lang = locale.code ? `_${locale.code}` : "";

      const docs = data.docs;

      if (format.value === "csv") {
        // const flattenedData = filteredData.map((doc) => flatten(doc));

        const [columns, flattenedData] = getCSVColumnNamesAndFlattendedData(
          docs,
          selectedFields?.map((o) => o.value),
        );

        const csv = Papa.unparse(flattenedData, { columns });
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
        href = URL.createObjectURL(blob);
        download = `Export_${collection.slug}${lang}_${date}.csv`;
      }

      if (format.value === "json") {
        const filteredData =
          selectedFields.length === fields.length
            ? docs
            : docs.map((doc) =>
                selectedFields
                  .map((o) => o.value)
                  .reduce(function (o: any, k: string) {
                    o[k] = doc[k];
                    return o;
                  }, {}),
              );
        href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(filteredData))}`;
        download = `Export_${collection.slug}${lang}_${date}.json`;
      }

      ref.current?.setAttribute("href", href);
      ref.current?.setAttribute("download", download);
      ref.current?.click();
    } catch (err) {
      toast.error("Failed to fetch data");
    }
  };

  return (
    <>
      <AnimateHeight height={open ? "auto" : 0}>
        <div className="card">
          <h5 className="title">Export</h5>

          <div className={styles.cardContent}>
            <div>
              <label className="field-label" htmlFor={"format"}>
                Output format
              </label>
              <ReactSelect
                required
                isSearchable={false}
                styles={reactSelectStyle}
                options={options}
                name="format"
                defaultValue={options[0]}
                value={format}
                onChange={(val) => setFormat(val as Option)}
              />
            </div>
            <div>
              <label className="field-label" htmlFor={"fields"}>
                Fields
              </label>

              <MultiSelect
                title="Fields"
                options={fields}
                selected={selectedFields}
                setSelected={setSelectedFields}
              />
            </div>

            <Button onClick={handleExport} className={styles.exportButton}>
              Export
            </Button>
          </div>
        </div>
        <Link ref={ref} className={styles.hidden} hidden />
      </AnimateHeight>
      <ToastContainer position="bottom-center" />
    </>
  );
}

export default ExportExpand;

const useStyles = createUseStyles({
  cardContent: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "var(--base)",
    width: "100%",
    flexWrap: "wrap",
  },
  hidden: {
    visibility: "hidden",
  },
  exportButton: {
    height: "4rem",
    marginTop: "auto",
    marginBottom: "6px",
  },
});
function createFlattenedFields(
  collection: Props["collection"],
): () => { label: string; value: string }[] {
  return () =>
    flattenFields(collection.fields).map((f) => ({
      label: `${typeof f.label === "string" ? f.label : f.name}`,
      value: `${f.name}`,
    }));
}
