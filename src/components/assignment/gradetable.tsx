import {
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  LinkBox,
  LinkOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { Field, FieldArray, FieldProps, Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  AccountDetailsFragment,
  TaskFragment,
  useGetSubmitsQuery,
  UserRole,
  useUpdateGradeMutation,
} from "../../generated/graphql";
import { ensureValIsBetween, parseNumberDefaultIfNot } from "../../utils/utils";
import { GradeSchema } from "../../utils/validation";
import ErrorMessage from "../errormessage";
import SubmitCancel from "../input/submitcancel";
import Loading from "../utils/loading";
import { useCurrentUser } from "../providers/userprovider";
import SubmitGradeView from "./submitgradeview";

interface GradeTableProps {
  task: TaskFragment;
  onStudentChange?: (student: AccountDetailsFragment) => void;
}
const GradeTable: React.FC<GradeTableProps> = (props) => {
  const user = useCurrentUser();
  const router = useRouter();

  const [{ fetching, error, data }] = useGetSubmitsQuery({
    variables: {
      taskId: props.task.id,
    },
  });
  const [studentIndex, setStudentIndex] = useState(parseNumberDefaultIfNot(router.query.student, 0));
  const [errorMessage, setErrorMessage] = useState("");

  const [, updateGrade] = useUpdateGradeMutation();
  const [updateOk, setUpdateOk] = useState(false);

  if (user?.role !== UserRole.Teacher) {
    return null;
  }

  const submits = data?.getSubmits ?? [];
  const allStudents = submits.map((s) => s.owner);
  const currentStudent = allStudents[studentIndex] ?? allStudents[0];
  return (
    <Loading isLoading={fetching}>
      <Flex py={20} w="100%" minH="200px" direction="row" wrap="wrap" gridColumnGap={10} gridRowGap={10}>
        <Formik
          initialValues={{
            allVisible: false,
            studentGrades: allStudents.map((student) => {
              const s = submits.find((x) => x.owner.id == student.id);
              return {
                points: s?.grade?.points?.toLocaleString() ?? "",
                isRevealed: s?.grade?.isRevealed ?? false,
                studentId: student.id,
              };
            }),
          }}
          onSubmit={async function (values, formikHelpers) {
            setUpdateOk(false);
            const work = values.studentGrades.map((x) => {
              const sub = submits.find((s) => s.owner.id == x.studentId)!;

              let points = parseNumberDefaultIfNot(x?.points?.replace(",", "."), undefined);

              if (points !== undefined) {
                points = ensureValIsBetween(points, 0, props.task.points);
              }

              return updateGrade({
                isRevealed: x.isRevealed,
                points,
                submitId: sub.id,
              });
            });
            const results = await Promise.all(work);

            var submitOk = true;
            results.forEach((r) => {
              if (r.error) {
                setErrorMessage(r.error.message);
                submitOk = false;
              }
            });
            formikHelpers.setSubmitting(false);
            setUpdateOk(submitOk);
            setTimeout(() => {
              setUpdateOk(false);
            }, 3000);
          }}
          validateOnBlur={true}
          validationSchema={GradeSchema}
          validateOnChange={false}
          validateOnMount={true}
        >
          {({ values, isSubmitting, errors, setFieldValue }) => {
            return (
              <Form>
                <Box maxW="30em" minW={20} h="100%" w="max-content" flex="auto">
                  <ErrorMessage message={errorMessage || error} />
                  <Flex dir="row" justifyContent="left" align="center" px={4}>
                    <SubmitCancel
                      cancelStyling={{ display: "none" }}
                      wrapperStyling={{ w: "max-content" }}
                      onCancel={() => void 0}
                      isLoading={isSubmitting}
                      submitLabel="Tallenna muutokset"
                      submitDisabled={!!errors.studentGrades?.length}
                      showCheckMarkAfterSubmit={updateOk}
                    />
                    <Box minW={6} flexGrow={1} />
                    <Checkbox
                      bg="white"
                      size="lg"
                      onChange={(e) => {
                        values.studentGrades.forEach((_, i) => {
                          setFieldValue(`studentGrades.${i}.isRevealed`, e.target.checked);
                        });
                      }}
                      isChecked={!values.studentGrades.map((x) => x.isRevealed).includes(false)}
                    >
                      Kaikki
                    </Checkbox>
                  </Flex>
                  <Table w="100%" minH={10}>
                    <Thead>
                      <Tr>
                        <Th>Opiskelija</Th>
                        <Th>
                          Arviointi <br /> (max {props.task.points} p)
                        </Th>
                        <Th maxW="10em" style={{ hyphens: "auto" }}>
                          Palaute näkyy opiskelijalle
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <FieldArray name="studentGrades">
                        {(arrayHelpers) =>
                          values.studentGrades.map((fieldValues, i) => {
                            const s = allStudents.find((x) => x.id == fieldValues.studentId)!;
                            return (
                              <Tr bg={i == studentIndex ? "gray.100" : "white"} key={s.id}>
                                <Td>
                                  <LinkBox w="100%" h="100%" _hover={{ color: "blue.500", textDecor: "underline" }}>
                                    <LinkOverlay
                                      href="#"
                                      onClick={() => {
                                        router.push(
                                          {
                                            pathname: router.pathname,
                                            query: { ...router.query, student: i },
                                          },
                                          undefined,
                                          {
                                            shallow: true,
                                          }
                                        );
                                        setStudentIndex(i);
                                        if (props.onStudentChange) {
                                          props.onStudentChange(s);
                                        }
                                      }}
                                    >
                                      {s.lastName}, {s.firstName}
                                    </LinkOverlay>
                                  </LinkBox>
                                </Td>
                                <Td maxW="7em">
                                  <Field name={`studentGrades.${i}.points`}>
                                    {({ field, meta }: FieldProps<string>) => (
                                      <FormControl isInvalid={!!meta.error}>
                                        <FormLabel className="hide" htmlFor={field.name}>
                                          Pisteet
                                        </FormLabel>

                                        <NumberInput
                                          defaultValue={field.value}
                                          min={0}
                                          max={props.task.points}
                                          size="sm"
                                          bg="white"
                                        >
                                          <NumberInputField {...field} />
                                          <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                          </NumberInputStepper>
                                        </NumberInput>
                                        {meta.error ? <FormErrorMessage>{meta.error}</FormErrorMessage> : null}
                                      </FormControl>
                                    )}
                                  </Field>
                                </Td>
                                <Td>
                                  <Field name={`studentGrades.${i}.isRevealed`}>
                                    {({ field, meta, form }: FieldProps<string>) => {
                                      return (
                                        <FormControl
                                          display="flex"
                                          alignContent="center"
                                          justifyContent="center"
                                          h="100%"
                                          isInvalid={!!meta.error}
                                        >
                                          <FormLabel className="hide" htmlFor={field.name}>
                                            Palaute näkyy opiskelijalle
                                          </FormLabel>
                                          <Checkbox {...field} bg="white" size="lg" isChecked={!!field.value} />
                                          {meta.error ? <FormErrorMessage>{meta.error}</FormErrorMessage> : null}
                                        </FormControl>
                                      );
                                    }}
                                  </Field>
                                </Td>
                              </Tr>
                            );
                          })
                        }
                      </FieldArray>
                    </Tbody>
                  </Table>
                </Box>
              </Form>
            );
          }}
        </Formik>
        <Flex direction="column" align="baseline" className="grade-view-wrapper" flexGrow={1} minH={10} minW="20em">
          <SubmitGradeView ownerId={currentStudent?.id ?? 0} taskId={props.task.id} />
        </Flex>
      </Flex>
    </Loading>
  );
};

export default GradeTable;
