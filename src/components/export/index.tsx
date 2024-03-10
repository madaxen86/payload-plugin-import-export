import React from "react";

type Props = {
  onClick: () => void;
  open: boolean;
};
export function ExportButtonList({ onClick, open }: Props) {
  return (
    <>
      <button
        className={`pill pill--style-light list-controls__toggle-columns  pill--has-action pill--has-icon pill--align-icon-right${
          open ? " list-controls__buttons-active " : ""
        }`}
        onClick={onClick}
      >
        <span className="pill__label">Export</span>
        <span className="pill__icon">
          <svg
            className="icon icon--chevron"
            viewBox="0 0 9 7"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
          >
            <path className="stroke" d="M1.42871 1.5332L4.42707 4.96177L7.42543 1.5332"></path>
          </svg>
        </span>
      </button>
    </>
  );
}

// async function getData(){
//   return = (await fetch(`${serverURL}${api}/${slug}/import?locale=${locale.code}`, {
//     method: "PATCH",
//     body: JSON.stringify(selectedData),
//     headers: {
//       "Content-type": "application/json",
//     },
//     credentials: "include",
//   }).then(res => res.json()))
// }
