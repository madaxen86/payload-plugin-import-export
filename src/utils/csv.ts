import { flatten } from "./flat";

export function getCSVColumnNames(data: any, prefix: string = ""): string[] {
  let columns: string[] = [];
  for (let key in data) {
    if (typeof data[key] === "object" && !Array.isArray(data[key])) {
      columns = columns.concat(getCSVColumnNames(data[key], `${prefix}${key}.`));
    } else {
      data[key].length > 0 && columns.push(`${prefix}${key}`);
    }
  }
  return columns;
}

export function getCSVColumnNamesAndFlattendedData(
  data: any[],
  selectedFields?: string[],
): [string[], any[]] {
  let columns: string[] = [];
  let flat: any[] = [];
  data.forEach((obj) => {
    if (selectedFields && !selectedFields.includes(Object.keys(obj)[0])) return;
    const flattenedField = flatten(obj);
    flat.push(flattenedField);
    columns = columns.concat(getCSVColumnNames(flattenedField));
  });
  return [Array.from(new Set(columns)), flat];
}
