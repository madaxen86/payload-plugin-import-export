import React, { useState, useEffect, useRef } from "react";
import Papa from "papaparse";
import { Collapsible, Button } from "payload/components/elements";
import { useConfig, useLocale } from "payload/components/utilities";
import { Locale } from "payload/config";

import { Dropzone } from "../dropzone";
import Link from "../link";
import { MultiSelect } from "../multiSelect";
import { reactSelectStyle } from "../select";
import { splitResults } from "./utils";

import styles from "./index.module.css";

import { toast } from "react-toastify";
import { unflatten } from "../../utils/flat";

import type { Ctx } from "../container";

type Data = Array<Record<string, any>>;

export const ImportForm = ({ collection }: Pick<Ctx, "collection" | "resetParams">) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<Data>([]);
  const [fields, setFields] = useState([""]);
  const [selectedFields, _setSelectedFields] = useState([{ label: "id", value: "id" }]);
  const setSelectedFields: React.Dispatch<
    React.SetStateAction<
      {
        label: string;
        value: string;
      }[]
    >
  > = newVal => {
    if (newVal === null || newVal.length === 0)
      return _setSelectedFields([{ label: "id", value: "id" }]);

    _setSelectedFields(newVal);
  };

  const { slug } = collection;
  const config = useConfig();
  const locale = useLocale();
  const location = window?.location;
  const params = new URLSearchParams();

  useEffect(() => {
    if (file) {
      parseInputFile();
    }
  }, [file]);

  if (!(config && config.serverURL)) {
    return null;
  }
  const {
    routes: { api },
    serverURL,
  } = config;

  const handleFileChange = async (list: FileList) => {
    setFile(list[0]);

    // Reset data and fields when a new file is selected
    setData([]);
    setFields([]);
    setSelectedFields([]);
  };

  const parseInputFile = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    if (file.type === "text/csv") {
      // Parsing CSV file

      Papa.parse<Data>(file, {
        header: true,
        complete: result => {
          const data = result?.data || [];
          const unflattenedData = data.map(doc => unflatten(doc));
          setData(unflattenedData);
          setFields(Object.keys(unflattenedData[0] || {}));
        },
      });
    } else if (file.type === "application/json") {
      // Fetching JSON data
      const response = await fetch(URL.createObjectURL(file)).then(res => res.json());

      setData(response);
      setFields(Object.keys(response[0] || {}));
    } else {
      alert("Unsupported file format. Please select a CSV or JSON file.");
    }
  };

  const handleImport = async () => {
    if (!data) return;

    const selectedData = data.map(row => {
      const selectedRow: Record<string, any> = selectedFields.includes({ label: "id", value: "id" })
        ? {}
        : { id: row.id };
      selectedFields.forEach(field => {
        selectedRow[field.value] = row[field.value];
      });
      return selectedRow;
    });
    try {
      const res = (await fetch(`${serverURL}${api}/${slug}/import?locale=${locale.code}`, {
        method: "PATCH",
        body: JSON.stringify(selectedData),
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      }).then(res => res.json())) as PromiseSettledResult<{ id: string | number }>[];

      displayResults(res, slug, locale);
      history?.go(0);
    } catch (err) {}
  };

  return (
    <>
      <div className={styles.flex}>
        <Dropzone
          mimeTypes={[".csv", ".json"]}
          onChange={handleFileChange}
          className={styles.dropzoneImport}
          fileName={file?.name}
        />

        <section className={[styles.section, styles.fullwidth].join(" ")}>
          <h4 className={styles.textCenter}>Select Fields</h4>
          <MultiSelect
            title="Select Fields"
            selected={selectedFields}
            setSelected={setSelectedFields}
            isDisabled={fields.length <= 1}
            closeMenuOnSelect={false}
            options={fields.map(field => ({ value: field, label: field }))}
            value={selectedFields.map(field => ({ value: field, label: field }))}
            menuPlacement="top"
            className={fields.length <= 1 ? styles.disabled : ""}
            styles={reactSelectStyle}
          />
        </section>

        <section className={[styles.section, styles.fullwidth].join(" ")}>
          <Collapsible header={"Preview Data (5 items max)"} initCollapsed={true}>
            <div className={styles.xScroll}>
              <table>
                <thead>
                  <tr>
                    {selectedFields.map((field, index) => (
                      <th key={index}>{field.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, data.length > 5 ? 5 : data.length).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {selectedFields.map((field, fieldIndex) => {
                        const value = row[field.value];
                        return (
                          <td key={fieldIndex + field.value}>
                            {typeof value === "object" ? JSON.stringify(value) : value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Collapsible>
        </section>
        <Button
          onClick={handleImport}
          disabled={selectedFields.length <= 1}
          className={styles.importBtn}
        >
          Import
        </Button>
      </div>
    </>
  );
};

function displayResults(
  res: PromiseSettledResult<{ id: string | number }>[],
  slug: string,
  locale: Locale,
) {
  const [success, errors] = splitResults(res);

  success.length > 0 && toast.success(`Imported ${success.length} items successfully`);

  if (errors.length > 0) {
    const csv = Papa.unparse(
      errors.map(err => ({
        data: err.reason.data,
        status: err.status,
        reason: err.reason.name,
      })),
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const csvDownloadUrl = URL.createObjectURL(blob);
    const date = new Date().toISOString().replace(":", "");
    const lang = locale.code ? `_${locale.code}` : "";
    toast.error(
      <div>
        {`Failed to import ${errors.length} items`}
        <Link
          href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(errors))}`}
          download={`Import_Errors_${slug}${lang}_${date}.json`}
        >
          Click to Download as JSON
        </Link>
        <Link href={csvDownloadUrl} download={`Import_Errors_${slug}${lang}_${locale}_${date}.csv`}>
          Click to Download as CSV
        </Link>
      </div>,
    );
  }
}
