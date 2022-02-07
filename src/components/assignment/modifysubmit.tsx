import { Box } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  AssignmentFragment,
  TaskFragment,
  useGetSubmitQuery,
  useUpdateSubmitMutation,
  useUploadFilesMutation,
} from "../../generated/graphql";
import { parseDate, uploadFiles } from "../../utils/utils";
import SubmitCancel from "../input/submitcancel";
import TextFileInput from "../input/textfileinputlegacy";
import Loading from "../utils/loading";
import { useCurrentCourse } from "../providers/courseprovider";
import { useCurrentUser } from "../providers/userprovider";

interface ModifySubmitProps {
  task: TaskFragment;
  assignment: AssignmentFragment;
  afterSubmit?: () => void;
  afterCancel?: () => void;
}
export const ModifySubmit: React.FC<ModifySubmitProps> = ({
  task,
  assignment,
  afterSubmit = () => void 0,
  afterCancel = () => void 0,
}) => {
  const user = useCurrentUser();

  const [, updateSubmit] = useUpdateSubmitMutation();
  const [, uploadFile] = useUploadFilesMutation();
  const [{ fetching, data: submitData }] = useGetSubmitQuery({ variables: { ownerId: user?.id, taskId: task.id } });

  const mySubmit = submitData?.getSubmit?.mySubmit;
  console.log(submitData);
  return (
    <Loading isLoading={fetching}>
      <Formik
        initialValues={{
          description: mySubmit?.description ?? "",
          files: [],
          id: task.id,
          filesToDelete: [],
        }}
        onSubmit={async (values, props) => {
          const filesToLink = await uploadFiles(uploadFile, values.files);
          const { files, filesToDelete, ...data } = values;
          const res = await updateSubmit({
            data: { ...data, filesToLink, filesToDelete: filesToDelete?.map((f) => Number(f)) },
          });
          props.setSubmitting(false);
          if (!res.error) {
            afterSubmit();
          } else {
            props.setErrors({ description: res.error.message });
          }
        }}
      >
        {(props) => (
          <Form id={`submit-update-${task.id}`}>
            <Box>
              <TextFileInput
                setFieldValue={props.setFieldValue}
                fileFieldName={`files`}
                fileFieldLabel={`Liitteet`}
                abittiLabel=""
                abittiName={`description`}
                abittiOldData={mySubmit?.description}
                oldFiles={mySubmit?.files}
                filesToDeleteName="filesToDelete"
                filesToDelete={props.values.filesToDelete}
              />
            </Box>
            <Box>
              <SubmitCancel
                onCancel={() => {
                  afterCancel();
                }}
                isLoading={props.isSubmitting}
              />
            </Box>
          </Form>
        )}
      </Formik>
    </Loading>
  );
};

export default ModifySubmit;
