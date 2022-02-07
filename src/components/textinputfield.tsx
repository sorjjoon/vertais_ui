import { Box, CSSObject, FormControl, FormErrorMessage, FormHelperText, FormLabel, Input } from "@chakra-ui/react";
import { useField, Field, FieldAttributes } from "formik";
import React, { InputHTMLAttributes } from "react";

type TextInputfieldProps = React.ComponentProps<typeof Field> & {
  name: string;
  label?: string | null;
  helperText?: string | null;
  placeholder?: string | null;
  isRequired?: boolean | null;
  boxStyling?: CSSObject | null;
  boxProps?: React.ComponentProps<typeof Box>;
  hideLabel?: boolean;
};

export const TextInputfield: React.FC<TextInputfieldProps> = ({
  boxStyling = { w: "100%", ">*": { w: "100%", py: 1, my: 0 }, my: 2 },
  label,
  size,
  isRequired,
  helperText,
  boxProps,
  hideLabel,
  ...props
}) => {
  const [field, { error }] = useField(props);
  return (
    <Box {...boxProps} sx={{ ...boxStyling }}>
      <FormControl isInvalid={!!error}>
        <FormLabel className={hideLabel ? "hide" : "label"} htmlFor={field.name}>
          {label}
        </FormLabel>

        <Input
          {...field}
          {...props}
          name={props.name}
          value={props.value ?? field.value ?? undefined}
          placeholder={props.placeholder}
          isRequired={isRequired ? true : undefined}
        ></Input>
        {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        {helperText ? <FormHelperText sx={{ fontSize: "sm", color: "yellow.800" }}>{helperText}</FormHelperText> : null}
      </FormControl>
    </Box>
  );
};

export default TextInputfield;
