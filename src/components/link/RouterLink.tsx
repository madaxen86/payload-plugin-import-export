import React from "react";
import { Link as ReactRouterLink, LinkProps } from "react-router-dom";

function RouterLink(props: LinkProps) {
  if (!process.env.PAYLOAD_PUBLIC_LOCAL_DEV) {
    return <ReactRouterLink {...props} />;
  }

  const { to, ...rest } = props;
  return <a href={to as string} {...rest} />;
}

export default RouterLink;
