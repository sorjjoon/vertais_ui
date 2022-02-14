import { CheckIcon } from "@chakra-ui/icons";
import { Box, Button, HStack, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { CombinedError } from "urql";
import ErrorMessage from "../utils/errormessage";

interface SubmitCancelProps {
  onCancel?: () => void;
  onSubmit?: () => void;
  submitDisabled?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  hideCancel?: boolean;
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
  hideCancel = false,
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
        variant="save"
        isLoading={isLoading}
        isDisabled={submitDisabled}
        {...submitProps}
      >
        {submitLabel}
      </Button>
      <Box className="filling">
        <HStack ml={5} color="green" justifyContent={"flex-start"}>
          {showCheckMarkAfterSubmit ? <CheckIcon boxSize={5} /> : null}
          <>{children}</>
        </HStack>
      </Box>
      {!hideCancel ? (
        <Button className="cancel" {...cancelStyling} onClick={onCancel} disabled={isLoading} variant="cancel">
          {cancelLabel}
        </Button>
      ) : null}

      <ErrorMessage message={error} />
    </HStack>
  );
};

export default SubmitCancel;
