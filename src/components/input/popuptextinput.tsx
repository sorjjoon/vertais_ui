import { Box } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import TextInputfield from "../textinputfield";
import SubmitCancel from "./submitcancel";

interface PopUpTextInputProps {
  oldData?: string;
  onSubmit: (data: string) => Promise<void>;
  onCancel: (() => Promise<void>) | (() => void);
  top?: number;
  right?: number;
  left?: number;
  bottom?: number;
}
export const PopUpTextInput: React.FC<PopUpTextInputProps> = (props) => {
  return (
    <Box
      pos="absolute"
      top={props.top}
      right={props.right}
      left={props.left}
      bottom={props.bottom}
      zIndex={10}
      minH="max-content"
      w="max-content"
      bg="white"
      maxW="20em"
      className="popup-input"
    >
      <Formik
        initialValues={{ data: props.oldData || "" }}
        onSubmit={async (values, formikProps) => {
          try {
            await props.onSubmit(values.data);
          } catch (err) {
            formikProps.setErrors({ data: err });
          }

          formikProps.setSubmitting(false);
        }}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <TextInputfield value={values.data} boxStyling={{ mb: 3 }} name="data" as="textarea" minH="4em" h="100%" />
            <SubmitCancel
              onCancel={props.onCancel}
              isLoading={isSubmitting}
              cancelStyling={{ ml: "auto!important" }}
              wrapperStyling={{ w: "100%" }}
            />
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default PopUpTextInput;
