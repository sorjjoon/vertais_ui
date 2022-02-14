import React from "react";
import { Text, TextProps } from "@chakra-ui/react";
type statusMessageProps = {} & TextProps;
const StatusMessage: React.FC<statusMessageProps> = (props, { children }) => {
  return (
    <Text
      sx={{
        color: "green.600",
        ml: "auto",
        whiteSpace: "pre",
      }}
      className="statusMessage"
      {...props}
    >
      {children}
    </Text>
  );
};

export default StatusMessage;
