import { CheckIcon } from "@chakra-ui/icons";
import { Box, Button, HStack, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { CombinedError } from "urql";
import ErrorMessage from "../errormessage";

interface SubmitCancelProps {
  onCancel?: () => void;
  onSubmit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
  cancelLabel?: string;

  isLoading: boolean;
  error?: string | CombinedError;
  cancelStyling?: React.ComponentProps<typeof Button>;
  wrapperStyling?: React.ComponentProps<typeof Box>;
  submitProps?: React.ComponentProps<typeof Button>;
  showCheckMarkAfterSubmit?: boolean;
}
export const SubmitCancel: React.FC<SubmitCancelProps> = ({
  onCancel,
  isLoading,
  children,
  error,
  cancelStyling,
  submitProps,
  onSubmit,
  wrapperStyling,
  submitDisabled,
  submitLabel = "Tallenna",
  cancelLabel = "Peruuta",
  showCheckMarkAfterSubmit = false,
}) => {
  console.log(children);
  return (
    <HStack {...wrapperStyling} className="submit-cancel-wrapper">
      <Button
        onClick={onSubmit}
        type="submit"
        className="submit"
        colorScheme="red"
        isLoading={isLoading}
        isDisabled={submitDisabled}
        {...submitProps}
      >
        {submitLabel}
      </Button>
      <Box className="filling">
        <VStack ml={5} color="green">
          {showCheckMarkAfterSubmit ? <CheckIcon boxSize={5} /> : null}
          <>{children}</>
        </VStack>
      </Box>
      <Button className="cancel" {...cancelStyling} onClick={onCancel} disabled={isLoading}>
        {cancelLabel}
      </Button>
      <ErrorMessage message={error} />
    </HStack>
  );
};

export default SubmitCancel;
