import Papa from "papaparse";
import { Button, Collapsible } from "payload/components/elements";
import { useConfig, useLocale } from "payload/components/utilities";
import { Locale } from "payload/config";
import React, { useEffect, useState } from "react";

import { Dropzone } from "../dropzone";

import { MultiSelect } from "../multiSelect";
import { reactSelectStyle } from "../select";
import { splitResults } from "./utils";

import { toast } from "react-toastify";
import { unflatten } from "../../utils/flat";

import { createUseStyles } from "react-jss";
import { useHistory } from "react-router-dom";
import { PluginTypes } from "../../types";
import { useSlug } from "../../utils/useSlug";
import Link from "../link";
import RouterLink from "../link/RouterLink";
import { useRedirect } from "../../utils/useRedirect";

type Data = Array<Record<string, any>>;

export const ImportForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<Data>([]);
  const [fields, setFields] = useState([""]);
  const [selectedFields, _setSelectedFields] = useState([{ label: "id", value: "id" }]);
  const setSelectedFields: typeof _setSelectedFields = (newVal) => {
    if (newVal === null || newVal.length === 0)
      return _setSelectedFields([{ label: "id", value: "id" }]);
    _setSelectedFields(newVal);
  };

  const styles = useStyles();
  const config = useConfig();
  const paths = window.location.pathname.split("/");
  const slug = useSlug();
  const backToCollection = `${paths.slice(0, paths.length - 1).join("/")}`;
  const locale = useLocale();
  const history = useHistory();
  const redirect = useRedirect();
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
    custom,
  } = config;
  const importExportPluginConfig = custom.importExportPluginConfig as PluginTypes;

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
        complete: (result) => {
          const data = result?.data || [];
          const unflattenedData = data.map((doc) => unflatten(doc));
          setData(unflattenedData);
          setFields(Object.keys(unflattenedData[0] || {}));
        },
      });
    } else if (file.type === "application/json") {
      // Fetching JSON data
      const response = await fetch(URL.createObjectURL(file)).then((res) => res.json());

      setData(response);
      setFields(Object.keys(response[0] || {}));
    } else {
      alert("Unsupported file format. Please select a CSV or JSON file.");
    }
  };

  const handleImport = async () => {
    if (!data) return;

    const selectedData = data.map((row) => {
      const selectedRow: Record<string, any> = selectedFields.includes({ label: "id", value: "id" })
        ? {}
        : { id: row.id };
      selectedFields.forEach((field) => {
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
      }).then((res) => res.json())) as PromiseSettledResult<{ id: string | number }>[];

      displayResults(res, slug, locale);
      if (!!importExportPluginConfig.redirectAfterImport) {
        redirect(backToCollection);
      }
    } catch (err) {
      //no error should be thrown because we use Promise.allSettled on API
      console.error(err);
    }
  };

  return (
    <>
      <div className={styles.flex}>
        <h1>Import to {slug.charAt(0).toUpperCase() + slug.slice(1)}</h1>
        <Dropzone mimeTypes={[".csv", ".json"]} onChange={handleFileChange} fileName={file?.name} />

        <section className={[styles.section, styles.fullwidth].join(" ")}>
          <h4 className={styles.textCenter}>Select Fields</h4>
          <MultiSelect
            title="Select Fields"
            selected={selectedFields}
            setSelected={setSelectedFields}
            isDisabled={fields.length <= 1}
            closeMenuOnSelect={false}
            options={fields.map((field) => ({ value: field, label: field }))}
            value={selectedFields.map((field) => ({ value: field, label: field }))}
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
        <div className={styles.btnGroup}>
          <RouterLink
            to={backToCollection}
            className={
              " btn btn--style-primary btn--icon-style-without-border btn--size-medium btn--icon-position-right"
            }
          >
            Cancel
          </RouterLink>

          <Button
            onClick={handleImport}
            disabled={selectedFields.length <= 1}
            className={styles.importBtn}
          >
            Import
          </Button>
        </div>
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
      errors.map((err) => ({
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

const useStyles = createUseStyles({
  select: {
    width: "clamp(150px, 80vw, 400px)",
  },
  fullwidth: {
    width: "100%",
  },
  textCenter: {
    textAlign: "center",
  },
  flex: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    margin: "1rem",
  },
  section: {
    margin: "var(--base) 0",
  },
  xScroll: {
    overflowX: "scroll",
  },
  btn: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  icon: {
    width: "1.5rem",
    height: "1.5rem",
  },
  disabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  btnGroup: {
    display: "flex",
    gap: "1rem",
    width: "100%",
  },
  importBtn: {
    flexGrow: "1",
  },
});
