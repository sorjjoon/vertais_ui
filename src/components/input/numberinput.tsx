import {
  Box,
  CSSObject,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { useField, Field, FieldAttributes } from "formik";
import React, { InputHTMLAttributes } from "react";

type NumberInputFieldProps = {
  name: string;
  label: string;
  helperText?: string | null;
  placeholder?: string | null;
  isRequired?: boolean | null;
  boxStyling?: CSSObject | null;
  boxProps?: React.ComponentProps<typeof Box>;
  hideLabel?: boolean;
};

const NumberInputfield: React.FC<NumberInputFieldProps> = ({ name, hideLabel, label, helperText }) => {
  const [field, { error }, fieldProps] = useField({ name });
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel className={hideLabel ? "hide" : "label"} htmlFor={field.name}>
        {label}
      </FormLabel>
      <NumberInput
        defaultValue={field.value}
        size="sm"
        maxW={16}
        inputMode="numeric"
        min={0}
        precision={0}
        focusInputOnChange={false}
        {...field}
        onChange={(_, val) => {
          fieldProps.setValue(val);
        }}
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
      {helperText ? <FormHelperText sx={{ fontSize: "sm", color: "yellow.800" }}>{helperText}</FormHelperText> : null}
    </FormControl>
  );
};

export default NumberInputfield;
