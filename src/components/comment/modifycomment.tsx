import { Box, Button, FormControl, FormLabel, HStack, Text, VStack } from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import React, { useState } from "react";
import {
  CommentFragment,
  InsertCommentMutation,
  UpdateCommentMutation,
  useInsertCommentMutation,
  useUpdateCommentMutation,
  useUploadFilesMutation,
} from "../../generated/graphql";
import FileList from "../file/filelist";
import { formatGraphQLerror, uuid } from "../../utils/utils";
import Abittieditor from "../input/abittieditor";
import DatePicker from "react-datepicker";
import { OperationResult } from "urql";
import ErrorMessage from "../utils/errormessage";
import FileInput from "../file/fileinput";
import SubmitCancel from "../input/submitcancel";

interface ModifyCommentProps {
  course?: { id: number };
  grade?: { id: number };
  showReveal?: boolean;
  oldData?: { id: number; reveal: string; content: string; files: { id: number; filename: string }[] };
  showInitially?: boolean;
  newCommentButtonText?: string;
  atferUpdate?: (newValue: CommentFragment) => void;
  atferInsert?: (newValue: CommentFragment) => void;
  onCancel?: () => void;
}

const ModifyComment: React.FC<ModifyCommentProps> = ({
  course,
  grade,
  oldData,
  showInitially = false,
  showReveal = false,
  atferUpdate = () => void 0,
  atferInsert = () => void 0,
  onCancel = () => void 0,
  newCommentButtonText = "Uusi viesti",
}) => {
  const id = uuid("new-comment-");

  const [, insertComment] = useInsertCommentMutation();
  const [, uploadFiles] = useUploadFilesMutation();
  const [, updateComment] = useUpdateCommentMutation();
  const [showNewComment, setShowNewComment] = useState<boolean>(showInitially);

  const [counter, setCounter] = useState(0);
  const [error, setError] = useState("" as string | undefined);
  const [reveal, setReveal] = useState<Date | null>(new Date());
  return (
    <Box w="100%" className={"fresh-comment " + (showNewComment ? "mod" : "")}>
      {showNewComment ? (
        <Box className="new-comment-wrapper">
          <Box>
            <Formik
              initialValues={{
                content: oldData?.content || "",
                reveal: oldData?.reveal || new Date(),
                revealNow: true,

                files: [],
                filesToDelete: [] as number[],
              }}
              onSubmit={async (values, { setErrors, setSubmitting, resetForm }) => {
                if (values.revealNow) {
                  values.reveal = new Date();
                }

                setError("");
                let fileIds: number[] | undefined = [];
                if (values.files.length) {
                  const uploadRes = await uploadFiles({
                    files: values.files,
                    target: oldData?.id ? { comment: { id: oldData.id } } : undefined,
                  });
                  if (uploadRes.error) {
                    setError(formatGraphQLerror(uploadRes.error.message));
                    return;
                  }
                  fileIds = uploadRes.data?.uploadFiles.map((f) => f.id);
                }
                let res: OperationResult<UpdateCommentMutation> | OperationResult<InsertCommentMutation>;
                if (oldData == null) {
                  res = await insertComment({
                    ...values,
                    filesToLink: fileIds,
                    course: course?.id,
                    grade: grade?.id,
                  });
                  atferInsert(res.data?.insertComment as any);
                } else {
                  const updateValues = {
                    id: oldData.id,
                    ...values,
                    filesToDelete: values.filesToDelete.map((fId) => Number(fId)),
                  };
                  res = await updateComment(updateValues);
                  atferUpdate(res.data?.updateComment as any);
                }
                setSubmitting(false);
                resetForm();
                if (res.error) {
                  setError(formatGraphQLerror(res.error.message));
                } else {
                  setCounter(counter + 1);
                  setShowNewComment(showInitially);
                }
              }}
            >
              {({ isSubmitting, values, setFieldValue, errors }) => (
                <Form>
                  <Abittieditor
                    onUpdate={(newData) => {
                      setFieldValue("content", newData.answerHTML);
                    }}
                    oldData={oldData?.content ? oldData.content : undefined}
                    key={counter}
                    id={id}
                  />

                  {showReveal ? (
                    <>
                      <FormControl id="showNow" as={VStack} alignItems="flex-start" py={4}>
                        <Text>Näkyy opiskelijoille: </Text>
                        <HStack>
                          <FormLabel htmlFor="revealNow" mb={0}>
                            Heti
                          </FormLabel>
                          <Field type="checkbox" name="revealNow" />
                        </HStack>

                        <DatePicker
                          wrapperClassName={values.revealNow ? " hide " : " date-picker-wrapper"}
                          showTimeSelect
                          disabled={values.revealNow}
                          selected={reveal}
                          onChange={(date) => {
                            setFieldValue("reveal", date as Date);
                            setReveal(date as Date);
                          }}
                        />
                      </FormControl>
                    </>
                  ) : null}

                  <Box>
                    <FileInput
                      name="files"
                      onChange={(event) => setFieldValue("files", event.currentTarget?.files ?? [])}
                      py={4}
                    />
                  </Box>
                  <Box>
                    <FileList files={oldData?.files ?? []} canModify filesToDelete={values.filesToDelete} />
                  </Box>
                  <HStack mt={4} w="100%">
                    <SubmitCancel
                      isLoading={isSubmitting}
                      onCancel={() => {
                        onCancel();
                        setCounter(counter + 1);
                        setShowNewComment(showInitially);
                      }}
                    />

                    <ErrorMessage>{error} </ErrorMessage>
                  </HStack>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      ) : (
        <Button
          className="new-comment"
          size="sm"
          onClick={() => {
            setShowNewComment(true);
          }}
        >
          {newCommentButtonText}
        </Button>
      )}
    </Box>
  );
};

export default ModifyComment;
