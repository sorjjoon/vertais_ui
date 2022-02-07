import { Formik, Form } from "formik";
import React from "react";
import { useUpdateFeedbackMutation } from "../../generated/graphql";
import PopUpTextInput from "../input/popuptextinput";
import SubmitCancel from "../input/submitcancel";
import TextInputfield from "../textinputfield";

type submitfeedbackProps = React.ComponentProps<typeof PopUpTextInput> & {
  childIndex: number;
  submitId: number;
  onSubmit: (() => void) | (() => Promise<void>);
};
export const SubmitFeedback: React.FC<submitfeedbackProps> = (props) => {
  const [, updateFeedback] = useUpdateFeedbackMutation();
  return (
    <Formik
      initialValues={{ data: props.oldData || "" }}
      onSubmit={async (values, formikProps) => {
        try {
          const res = await updateFeedback({
            description: values.data,
            targetId: props.submitId,
            childIndex: props.childIndex,
          });
          if (res.error) {
            throw res.error.message;
          }
          props.onSubmit();
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
  );
};

export default SubmitFeedback;
