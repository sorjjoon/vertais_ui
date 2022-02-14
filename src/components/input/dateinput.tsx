import { FormControl, FormErrorMessage, FormHelperText, FormLabel } from "@chakra-ui/react";
import { Field, useField } from "formik";
import React from "react";
import ReactDatePicker from "react-datepicker";
import { parseDate } from "../../utils/utils";
type DateInputProps = {
  name: string;
  label: string;
  helperText?: string;
  fieldProps?: Partial<React.ComponentProps<typeof Field>>;
  hideLabel?: boolean;
} & Partial<React.ComponentProps<typeof ReactDatePicker>>;
export const DateInput: React.FC<DateInputProps> = ({
  name,
  label,
  hideLabel,
  helperText,
  fieldProps,
  wrapperClassName,
  ...props
}) => {
  const [field, meta, formikProps] = useField<Date | null>({
    name: name,
    ...fieldProps,
  });
  return (
    <FormControl pos="static" isInvalid={!!meta.error}>
      <FormLabel className={hideLabel ? "hide" : undefined} htmlFor={field.name}>
        {label}
      </FormLabel>
      <ReactDatePicker
        name={field.name}
        wrapperClassName={`date-picker-wrapper ${wrapperClassName} ${meta.error ? "has-error" : "no-error"}`}
        selected={parseDate(field.value)}
        onChange={(val) => {
          (formikProps.setValue as any)(val);
        }}
        timeCaption="Aika"
        showTimeSelect
        ariaInvalid={meta.error ? "true" : "false"}
        {...props}
      />
      {!meta.error && helperText ? (
        <FormHelperText minH={0} fontSize="sm">
          {helperText}
        </FormHelperText>
      ) : null}
      {meta.error ? <FormErrorMessage>{meta.error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export default DateInput;
