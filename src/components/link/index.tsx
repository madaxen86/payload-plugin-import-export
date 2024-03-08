import React, { useRef } from "react";

import styles from "./index.module.css";

const Link = React.forwardRef<HTMLAnchorElement, React.HTMLProps<HTMLAnchorElement>>(
  ({ children, className, ...rest }, ref) => {
    return (
      <a
        ref={ref}
        {...rest}
        className={[
          "pill pill--style-light pill--has-link pill--has-action",
          styles.error,
          className,
        ].join(" ")}
      >
        {children}
      </a>
    );
  },
);

export default Link;
