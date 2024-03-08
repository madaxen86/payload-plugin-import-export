import { StylesConfig } from "react-select";
export const reactSelectStyle: StylesConfig = {
  container: styles => ({ ...styles, width: "100%" }),
  valueContainer: styles => ({
    ...styles,
    padding: "0.5rem 0",
    maxHeight: "100%",
    overflow: "scroll",
  }),
  indicatorsContainer: styles => ({ ...styles, maxHeight: "100%" }),
  control: styles => ({
    ...styles,
    fontFamily: "var(--font-body)",
    width: "100%",
    height: "5rem",
    border: "1px solid var(--theme-elevation-150)",
    background: "var(--theme-input-bg)",
    color: "var(--theme-elevation-800)",
    padding: ".5rem 1.5rem",
    boxShadow: "none",
    "&:hover": {
      borderColor: "var(--theme-elevation-150)",
      boxShadow: "none",
    },
  }),
  singleValue: styles => ({
    ...styles,
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    color: "currentColor",
    padding: "0 1rem",
    width: "5rem",
  }),

  multiValue: styles => ({
    ...styles,
    display: "flex",
    border: "1px solid var(--theme-elevation-800)",
    background: "var(--theme-input-bg)",
  }),
  multiValueLabel: styles => ({
    ...styles,
    fontFamily: "var(--font-body)",
    fontSize: "11px",
    color: "currentColor",
  }),
  multiValueRemove: (styles, state) => ({
    ...styles,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "var(--theme-error-150)",
      color: "var(--theme-elevation-800)",
    },
  }),
  menu: styles => ({
    ...styles,
    backgroundColor: "var(--theme-input-bg)",
    color: "var(--theme-elevation-800)",
  }),
  option: (styles, state) => ({
    ...styles,
    backgroundColor: state.isSelected ? "var(--theme-elevation-200)" : "var(--theme-input-bg)",
    color: "var(--theme-elevation-800)",
    "&:hover": {
      backgroundColor: "var(--theme-elevation-150)",
    },

    cursor: "pointer",
  }),
};
