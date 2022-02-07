import React from "react";
import { VStack, Box, Heading, Button, Flex, HStack, Text, TextProps, ComponentWithAs } from "@chakra-ui/react";
type statusMessageProps = {} & TextProps;
export const StatusMessage: React.FC<statusMessageProps> = (props, { children }) => {
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
