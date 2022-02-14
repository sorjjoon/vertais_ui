import { Box, Text } from "@chakra-ui/react";
import { CombinedError } from "@urql/core";
import React, { useRef } from "react";
import { formatGraphQLerror } from "../../utils/utils";

type ErrorMessageProps = React.ComponentProps<typeof Box> & { message?: string | null | CombinedError };

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ children, className, message, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);
  const noError = React.Children.count(children) === 0 && !message;
  // useEffect(() => {
  //   if (!noError) {
  //     ref.current?.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [message, children]);
  if (noError) {
    return <></>;
  }

  return (
    <Box ref={ref} className={"error-message " + (className ?? "")} {...props}>
      <Text> {formatGraphQLerror(message ?? undefined)} </Text>
      {children}
    </Box>
  );
};

export default ErrorMessage;
