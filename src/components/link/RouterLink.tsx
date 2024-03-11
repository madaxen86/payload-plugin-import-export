import React from "react";
import { Link as ReactRouterLink, LinkProps } from "react-router-dom";
import Link from ".";

function RouterLink(props: LinkProps) {
  if (process.env.NODE_ENV === "production") {
    return <ReactRouterLink {...props}>RouterLink</ReactRouterLink>;
  }

  const { to, ...rest } = props;
  return <a href={to as string} {...rest} />;
}

export default RouterLink;
