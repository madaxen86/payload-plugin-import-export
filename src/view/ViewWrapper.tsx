import { DefaultTemplate } from "payload/components/templates";
import { Meta, useAuth, useConfig } from "payload/components/utilities";
import { Forbidden } from "payload/errors";
import { AdminViewProps } from "payload/config";
import { getTranslation } from "payload/utilities";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import { ImportForm } from "../components/import/ImportForm";
import { useHistory } from "react-router-dom";
import { createUseStyles } from "react-jss";
import { useRedirect } from "../utils/useRedirect";

function ViewWrapper(props: AdminViewProps) {
  const { i18n } = useTranslation("general");
  const paths = window.location.pathname.split("/");
  const collectionSlug = paths[3];
  const config = useConfig();

  const styles = useStyles();
  const redirect = useRedirect();
  if (!props.canAccessAdmin || !props.user) {
    const route = `${config.routes.admin}/login?redirect=/collections/${collectionSlug}/import`;
    redirect(route);
    return null;
  }

  const hasPermissions = useMemo(() => {
    if (!config.custom.importExportPluginConfig.canImport) return true;
    return config.custom.importExportPluginConfig.canImport(props.user);
  }, [props.user]);

  return (
    <DefaultTemplate>
      <Meta
        title={getTranslation(
          collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1),
          i18n,
        )}
      />

      {!hasPermissions ? (
        <main className={styles.main}>
          <h1>
            Forbidden <h4>You are not allowed to import Data</h4>
          </h1>
        </main>
      ) : (
        <ImportForm />
      )}
      <ToastContainer position="bottom-center" autoClose={30000} />
    </DefaultTemplate>
  );
}

export default ViewWrapper;

const useStyles = createUseStyles({
  main: {
    display: "grid",
    placeItems: "center",
    height: "80vh",
    textAlign: "center",
  },
});
