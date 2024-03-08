import Papa from "papaparse"; // For parsing CSV
import {
  Button,
  Collapsible,
  Drawer,
  DrawerToggler,
  useDrawerSlug,
} from "payload/components/elements";
import { useConfig, useLocale } from "payload/components/utilities";
import type { Props as ListProps } from "payload/components/views/list";
import { Locale } from "payload/config";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Dropzone } from "../dropzone";
import Link from "../link";
import { MultiSelect } from "../multiSelect";
import { reactSelectStyle } from "../select";
import styles from "./index.module.css";
import { splitResults } from "./utils";
import { unflatten } from "flat";
type Data = Array<Record<string, any>>;
type Props = { collection: ListProps["collection"] };

export function ImportList({ collection }: Props) {
  const slug = useDrawerSlug("import" + collection.slug);

  return (
    <>
      <DrawerToggler className="pill pill--has-action pill--style-light" slug={slug}>
        Import
      </DrawerToggler>

      <Drawer slug={slug}>
        <ImportForm collection={collection} />
        <ToastContainer position="bottom-center" autoClose={30000} />
      </Drawer>
    </>
  );
}

function ImportForm({ collection }: Props) {
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
    // const selectedFile = event.target?.files?.[0] || null;
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

      Papa.parse(file, {
        header: true,
        complete: result => {
          const data = result?.data || [];
          const unflattenedData = data.map(doc => unflatten(doc)) as Data;
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

  // const handleFieldSelect = (event: React.ChangeEvent<HTMLSelectElement> | string[]) => {
  //   if (Array.isArray(event)) return setSelectedFields(event);

  //   const selectedField = event?.target.value;
  //   if (!selectedFields.includes(selectedField)) {
  //     setSelectedFields([...selectedFields, selectedField]);
  //   }
  // };

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
    } catch (err) {}
  };

  return (
    <div className={styles.flex}>
      <Dropzone
        mimeTypes={[".csv", ".json"]}
        onChange={handleFileChange}
        className={styles.dropzoneImport}
        fileName={file?.name}
      />

      <section className={[styles.section, styles.fullwidth].join(" ")}>
        <h2 className={styles.textCenter}>Select Fields</h2>
        {/* <div className="flex">
          <button
            onClick={() => setSelectedFields(fields)}
            disabled={fields.length <= 1 || selectedFields.length === fields.length}
          >
            All
          </button>
          <button onClick={() => setSelectedFields([])} disabled={selectedFields.length === 1}>
            None
          </button>
        </div> */}
        {/* <select
          multiple
          value={selectedFields}
          onChange={handleFieldSelect}
          className={styles.select}
        >
          {fields.map((field, index) => (
            <option key={index} value={field}>
              {field}
            </option>
          ))}
        </select> */}

        <MultiSelect
          title="Select Fields"
          selected={selectedFields}
          setSelected={setSelectedFields}
          isDisabled={fields.length <= 1}
          closeMenuOnSelect={false}
          options={fields.map(field => ({ value: field, label: field }))}
          value={selectedFields.map(field => ({ value: field, label: field }))}
          // onChange={val =>
          //   handleFieldSelect((val as unknown as Array<{ value: string }>).map(o => o.value))
          // }
          className={fields.length <= 1 ? styles.disabled : ""}
          styles={reactSelectStyle}
        />
      </section>

      <section className={[styles.section, styles.fullwidth].join(" ")}>
        {/* <h2 className={styles.textCenter}>Preview data to import</h2> */}
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
  );
}

export default ImportList;

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
    const lang = locale.code ? "_" + locale.code : "";
    toast.error(
      <div>
        {`Failed to import ${errors.length} items`}
        <Link
          href={"data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(errors))}
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
