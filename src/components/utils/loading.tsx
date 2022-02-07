import { Box, Flex } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/react";
import React from "react";

interface loadingProps {
  isLoading?: boolean;
  spinnerSize?: "sm" | "md" | "lg" | "xl" | "xs";
}

export const Loading: React.FC<loadingProps> = ({ isLoading, children, spinnerSize }) => {
  if (isLoading || isLoading === undefined) {
    return (
      <Flex w="100%" justify="center" align="center" cursor="wait">
        <Box w="max-content" h="max-content">
          <Spinner size={spinnerSize} />
        </Box>
      </Flex>
    );
  }

  return <> {children} </>;
};

export default Loading;
