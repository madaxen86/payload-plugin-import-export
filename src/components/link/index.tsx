import React from "react";
import { createUseStyles } from "react-jss";

const Link = React.forwardRef<HTMLAnchorElement, React.HTMLProps<HTMLAnchorElement>>(
  ({ children, className, ...rest }, ref) => {
    const styles = useStyles();
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

const useStyles = createUseStyles({
  error: {
    margin: " 0 0.5rem",
  },
});
