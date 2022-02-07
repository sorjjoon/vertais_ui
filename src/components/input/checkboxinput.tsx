import { FormControl, FormLabel, Checkbox, FormErrorMessage, Stack, VStack, Flex, HStack } from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type checkboxinputProps = React.ComponentProps<typeof Checkbox> & {
  name: string;
  label: string;
  fieldProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const Checkboxinput: React.FC<checkboxinputProps> = ({ label, size, fieldProps, name, ...props }) => {
  const [field, { error }] = useField({ type: "checkbox", ...fieldProps, name });
  return (
    <FormControl display="flex" flexDir="column" isInvalid={!!error}>
      <HStack>
        <FormLabel mb={0} mt={0} w="auto" htmlFor={field.name}>
          {label}
        </FormLabel>
        <Checkbox isChecked={field.value} checked={field.value} {...props} {...field} />
      </HStack>
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};

export default Checkboxinput;
