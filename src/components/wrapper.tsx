import { Box } from "@chakra-ui/react";
import React from "react";

type wrapperProps = React.ComponentProps<typeof Box> & {
  size?: "sm" | "md" | "lg" | "auto" | null;
  addBorder?: boolean;
};
export const Wrapper: React.FC<wrapperProps> = ({ addBorder, children, size = "auto", ...props }) => {
  const sizeClass = "size-" + size;
  const border = addBorder ? "add-border" : "";
  const classes = `wrapper ${border} ${sizeClass}`;

  return (
    <Box maxW="100vw" overflowY="auto" {...props} className={classes}>
      {children}
    </Box>
  );
};

export default Wrapper;
