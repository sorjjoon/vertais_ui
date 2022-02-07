import {
  Box,
  Button,
  FormLabel,
  VStack,
  Heading,
  Divider,
  NumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
  Flex,
} from "@chakra-ui/react";
import { Formik, Form, FieldArray } from "formik";
import React, { useEffect, useState } from "react";
import {
  AssignmentFragment,
  FileFragment,
  TaskFragment,
  useInsertAssignmentMutation,
  useUpdateAssignmentMutation,
  useUploadFilesMutation,
} from "../../generated/graphql";
import {
  formatGraphQLerror,
  getAllValues,
  multiMap,
  parseNumberDefaultIfNot,
  uploadFiles,
  uuid,
} from "../../utils/utils";
import SubmitCancel from "../input/submitcancel";
import TextInputfield from "../textinputfield";
import ErrorMessage from "../errormessage";
import TextFileInput from "../input/textfileinput";
import AssignmentOptionsInput from "../input/assignmentoptionsinput";
import { AssignmentOptionsSchema } from "../../utils/validation";
import { merge, forOwn, omitBy } from "lodash-es";
import { CloseIcon, TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import NumberInputfield from "../input/numberinput";

interface ModifyAssignmentProps {
  course: { id: number };
  afterSubmit?: () => void;
  onClose: () => void;
  onCancel?: () => void;
  oldData?: AssignmentFragment;
}

function emptyAssignment() {
  return {
    name: "",

    ...emptyInfo(),
    tasks: [emptyTask()],
    options: emptyOptions(),
    peerAssesmentOptions: emptyPeerAssesmentOptions(),
  };
}

function emptyInfo() {
  return {
    id: uuid("task-key") as number | string, //Dummy id, used as task array key
    description: "",
    filesToDelete: [] as number[],
    files: [] as FileFragment[],
    newFiles: [] as [] | FileList,
  };
}

function emptyTask() {
  return {
    points: undefined as undefined | number,

    ...emptyInfo(),
    answer: emptyInfo(),
  };
}
function emptyPeerAssesmentOptions() {
  return {
    peerAssesmentCount: 1,
    revealAutomatically: true,
    deadline: new Date() as null | Date,
  };
}
function emptyOptions() {
  return {
    hasPeerAssesment: false,

    reveal: new Date() as null | Date,
    deadline: new Date() as null | Date,
    revealNow: true,
    noDeadline: true,
  };
}
export const ModifyAssignment: React.FC<ModifyAssignmentProps> = ({
  course,
  oldData,
  onClose,
  onCancel = () => void 0,
  afterSubmit = () => void 0,
}) => {
  const [, insertAssignment] = useInsertAssignmentMutation();
  const [, updateAssignment] = useUpdateAssignmentMutation();

  const [, upload] = useUploadFilesMutation();
  const [error, setError] = useState("" as string | undefined);

  const data = emptyAssignment();
  data.name = oldData?.name ?? "";

  if (oldData) {
    const { deadline, reveal, ...filteredOldData } = oldData;
    merge(data, filteredOldData);
    data.options.noDeadline = oldData.options.deadline == undefined;
    data.options.revealNow = oldData.options.reveal < new Date();
    data.peerAssesmentOptions = oldData.peerAssesment?.options ?? data.peerAssesmentOptions;
    data.tasks.forEach((t) => {
      t.filesToDelete = [];
      t.newFiles = [];
      t.answer.filesToDelete = [];
      t.answer.newFiles = [];
    });
  }
  return (
    <Box className={"fresh-assignment mod"}>
      <Formik
        initialValues={data}
        validationSchema={AssignmentOptionsSchema}
        validateOnBlur
        validateOnChange
        validate={(values) => {
          //TODO, make this with Yup
          if (values.options.hasPeerAssesment && values.peerAssesmentOptions.deadline! < values.options.deadline!) {
            return {
              peerAssesmentOptions: {
                deadline: "Vertaisarvionnin palautuspäivä ei voi olla ennen tehtävän palautuspäivää",
              },
            };
          }
          return undefined;
        }}
        onSubmit={async (values, props) => {
          try {
            const assignmentFilesPromise = uploadFiles(upload, values.newFiles);
            const taskFilesPromise = Promise.all(values.tasks.map((t) => uploadFiles(upload, t.newFiles)));
            const answerFilesPromise = Promise.all(values.tasks.map((t) => uploadFiles(upload, t.answer.newFiles)));

            const [assignmentFilesToLink, taskFilesToLink, answerFilesToLink] = await Promise.all([
              assignmentFilesPromise,
              taskFilesPromise,
              answerFilesPromise,
            ]);
            const extraKeys = [
              "revealNow",
              "noDeadline",
              "files",
              "newFiles",
              "submits",
              "peerAssesment",
              "mySubmit",
              "createdAt",
              "updatedAt",
              "number",
              "task",
              "__typename",
            ];
            const filter = (value: any, key: string) => extraKeys.includes(key);
            const params = {
              ...(omitBy(values, filter) as typeof values),
              id: parseNumberDefaultIfNot(values.id, null),
              filesToLink: assignmentFilesToLink,
              filesToDelete: values.filesToDelete.map(Number),
              options: {
                ...(omitBy(values.options, filter) as typeof values.options),
                reveal: values.options.revealNow ? new Date() : values.options.reveal,
                deadline: values.options.noDeadline ? null : values.options.deadline,
              },
              peerAssesmentOptions: {
                ...(omitBy(values.peerAssesmentOptions, filter) as typeof values.peerAssesmentOptions),
              },
              tasks: values.tasks.map((t, i) => {
                return {
                  ...(omitBy(t, filter) as typeof t),
                  id: parseNumberDefaultIfNot(t.id, null),
                  filesToDelete: t.filesToDelete.map(Number),
                  filesToLink: taskFilesToLink[i],
                  answer: {
                    ...(omitBy(t.answer, filter) as typeof t.answer),
                    id: parseNumberDefaultIfNot(t.answer.id, null),
                    filesToLink: answerFilesToLink[i],
                    filesToDelete: t.answer.filesToDelete.map(Number),
                  },
                };
              }),
            };
            if (params.id == null) {
              console.log("inserting");
              const res = await insertAssignment({
                ...params,
                courseId: course.id,
              });
              if (res.error) {
                throw res.error;
              }
            } else {
              console.log("updating");
              const res = await updateAssignment({
                ...params,
                id: params.id,
              });
              if (res.error) {
                throw res.error;
              }
            }

            afterSubmit();
            onClose();
          } catch (err) {
            console.log(err);
            setError(formatGraphQLerror(err));
          }
          props.setSubmitting(false);
        }}
      >
        {({ setFieldValue, isSubmitting, values, errors, touched }) => {
          const errorsJoined = getAllValues(errors, 5).join("\n");
          console.log("val", values);
          console.log("old", oldData);
          return (
            <Form>
              <VStack
                align="flex-start"
                spacing={4}
                sx={{ hr: { w: "100%", flexShrink: 0, borderColor: "blackAlpha.800" } }}
              >
                <TextFileInput
                  fileFieldName={`newFiles`}
                  fileFieldLabel={`Kaikkien tehtävien liitteet:`}
                  abittiLabel="Palautuksen ohjeistus"
                  abittiName={`description`}
                  abittiOldData={oldData?.description ?? undefined}
                  oldFiles={values.files}
                  filesToDeleteName="filesToDelete"
                  filesToDelete={values.filesToDelete}
                >
                  {({ abittiEditor, abittiError, abittiLabel, fileFieldLabel, fileInput, fileList }) => (
                    <VStack w="100%" align="baseline" spacing={4}>
                      <TextInputfield name="name" label="Nimi" isRequired boxStyling={{ w: "100%" }} />
                      <Box w="100%">
                        {abittiLabel}
                        {abittiEditor}
                        {abittiError}
                      </Box>
                      <Box w="100%">
                        {fileFieldLabel}
                        {fileInput}
                      </Box>
                      <Box w="100%">{fileList}</Box>
                    </VStack>
                  )}
                </TextFileInput>
                <Divider />
                <AssignmentOptionsInput />
                <Divider />

                <FieldArray
                  name="tasks"
                  render={(arrayHelpers) => (
                    <VStack align="baseline" w="100%" spacing={8}>
                      {values.tasks.map((task, i, arr) => {
                        const oldTask = oldData?.tasks.find((t) => t.id === task.id);
                        return (
                          <Box key={task.id} id={`task-input-${i}`} className="task-input-wrapper" w="100%">
                            <Flex w="100%" alignItems="center" direction="row" justifyContent="flex-start">
                              <Heading size="sm" fontSize="1.1rem">
                                Tehtävä {i + 1}
                              </Heading>
                              <Box flexGrow={1} />
                              <Flex justify="flex-end" direction="row" alignContent="center">
                                <VStack spacing={1}>
                                  <Button
                                    display="flex"
                                    justifyContent="center"
                                    maxH="1em"
                                    minW="max-content"
                                    w="max-content"
                                    px={2}
                                    sx={{ span: { mx: 0 } }}
                                    leftIcon={<TriangleUpIcon />}
                                    disabled={i == 0}
                                    title="Siirrä ylös"
                                    onClick={() => {
                                      if (i > 0) {
                                        arrayHelpers.swap(i, i - 1);
                                      }
                                    }}
                                  />
                                  <Button
                                    display="flex"
                                    justifyContent="center"
                                    maxH="1em"
                                    w="max-content"
                                    minW="max-content"
                                    px={2}
                                    sx={{ span: { mx: 0 } }}
                                    leftIcon={<TriangleDownIcon />}
                                    disabled={i == arr.length - 1}
                                    title="Siirrä alas"
                                    onClick={() => {
                                      if (i < arr.length - 1) {
                                        arrayHelpers.swap(i, i + 1);
                                      }
                                    }}
                                  />
                                </VStack>
                                <Flex justify="center" align="center" ml={3}>
                                  <Button
                                    onClick={() => {
                                      const isEmptyTask =
                                        !task.description.trim() && !task.newFiles.length && !task.files.length;
                                      if (
                                        isEmptyTask ||
                                        window.confirm(
                                          "Oletko varma, että haluat poistaa tehtävän?\nJos opiskelijat ovat tehneet palautuksia tehtävään, kaikki tehdyt palautukset poistetaan myös."
                                        )
                                      ) {
                                        arrayHelpers.remove(i);
                                      }
                                    }}
                                    disabled={values.tasks.length <= 1}
                                    rightIcon={<CloseIcon />}
                                    size="xs"
                                    colorScheme="red"
                                    title={
                                      values.tasks.length <= 1
                                        ? "Et voi poistaa ainoaa tehtävää"
                                        : `Poista tehtävä ${i + 1}`
                                    }
                                  >
                                    Poista
                                  </Button>
                                </Flex>
                              </Flex>
                            </Flex>
                            <VStack
                              id={`task-${i}-wrapper`}
                              sx={{ ">div": { w: "100%" }, w: "100%" }}
                              align="center"
                              spacing={4}
                            >
                              <TextFileInput
                                fileFieldName={`tasks.${i}.newFiles`}
                                fileFieldLabel={`Tehtävän ${i + 1} liitteet`}
                                abittiLabel="Ohjeistus"
                                abittiName={`tasks.${i}.description`}
                                abittiOldData={oldTask?.description}
                                oldFiles={task.files}
                                filesToDelete={task.filesToDelete}
                                filesToDeleteName={`tasks.${i}.filesToDelete`}
                              >
                                {({ abittiEditor, abittiError, abittiLabel, fileFieldLabel, fileInput, fileList }) => (
                                  <>
                                    <VStack align="baseline" spacing={1}>
                                      {abittiLabel}
                                      {abittiEditor}
                                      {abittiError}
                                    </VStack>
                                    <VStack align="baseline" spacing={1}>
                                      {fileFieldLabel}
                                      {fileInput}
                                    </VStack>
                                    <VStack align="baseline" spacing={1}>
                                      {fileList}{" "}
                                    </VStack>
                                  </>
                                )}
                              </TextFileInput>
                              <VStack align="baseline" spacing={1}>
                                <NumberInputfield name={`tasks.${i}.points`} label={`Tehtävän ${i + 1} pisteet`} />
                              </VStack>
                              <Box>
                                <TextFileInput
                                  fileFieldName={`tasks.${i}.answer.newFiles`}
                                  fileFieldLabel={"Malliratkaisun liitteet"}
                                  abittiLabel={`Tehtävän ${i + 1} malliratkaisu`}
                                  abittiName={`tasks.${i}.answer.description`}
                                  abittiOldData={oldTask?.answer?.description}
                                  oldFiles={task.answer.files}
                                  filesToDelete={task.answer.filesToDelete}
                                  filesToDeleteName={`tasks.${i}.answer.filesToDelete`}
                                >
                                  {(answerInput) => (
                                    <VStack sx={{ ">*": { w: "100%" }, w: "100%" }} align="baseline" spacing={4}>
                                      <Box>
                                        <Heading my={2} size="sm">
                                          {answerInput.abittiLabel}
                                        </Heading>
                                        {answerInput.abittiEditor}
                                        {answerInput.abittiError}
                                      </Box>
                                      <Box>
                                        {answerInput.fileFieldLabel}
                                        {answerInput.fileInput}
                                      </Box>
                                      <Box>{answerInput.fileList}</Box>
                                    </VStack>
                                  )}
                                </TextFileInput>
                              </Box>

                              {i < values.tasks.length - 1 ? <Divider /> : null}
                            </VStack>
                          </Box>
                        );
                      })}
                      <Button
                        size="sm"
                        onClick={() => {
                          arrayHelpers.push(emptyTask());
                        }}
                      >
                        Lisää tehtävä
                      </Button>
                    </VStack>
                  )}
                />

                <Box w="100%">
                  <SubmitCancel
                    onCancel={() => {
                      onCancel();
                      onClose();
                    }}
                    submitDisabled={!!Object.values(errors).length}
                    isLoading={isSubmitting}
                    submitProps={{
                      title: errorsJoined ? errorsJoined : "Tallenna",
                    }}
                  />
                  <ErrorMessage>{error}</ErrorMessage>
                </Box>
              </VStack>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default ModifyAssignment;
