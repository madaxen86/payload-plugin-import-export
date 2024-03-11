import { DefaultTemplate } from "payload/components/templates";
import React from "react";
import { ImportForm } from "../components/import/ImportForm";
import { ToastContainer } from "react-toastify";
import { Meta, useConfig, useDocumentInfo } from "payload/components/utilities";
import { getTranslation } from "payload/utilities";
import { AdminViewProps } from "payload/config";
import { useTranslation } from "react-i18next";

function ViewWrapper(props: AdminViewProps) {
  const { i18n } = useTranslation("general");
  const paths = window.location.pathname.split("/");
  const slug = paths[3];
  return (
    <DefaultTemplate>
      <Meta title={getTranslation(slug.charAt(0).toUpperCase() + slug.slice(1), i18n)} />
      <ImportForm />
      <ToastContainer position="bottom-center" autoClose={30000} />
    </DefaultTemplate>
  );
}

export default ViewWrapper;
