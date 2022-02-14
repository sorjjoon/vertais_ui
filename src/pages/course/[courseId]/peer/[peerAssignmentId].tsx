import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  VStack,
  Link,
  FormControl,
  FormLabel,
  Select,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import React, { useState } from "react";
import CourseBanner from "../../../../components/course/coursebanner";
import { useCurrentCourse } from "../../../../components/providers/courseprovider";
import Loading from "../../../../components/utils/loading";
import LoginRequired from "../../../../components/utils/loginrequired";
import Wrapper from "../../../../components/wrapper";
import FileList from "../../../../components/file/filelist";
import { useGetMyPeerAssesmentQuery, useUpdatePeerAssesmentMutation } from "../../../../generated/graphql";
import { parseNumberDefaultIfNot, sum } from "../../../../utils/utils";
import DisplayRichtext from "../../../../components/utils/displayrichtext";
import { Field, FieldProps, Form, Formik } from "formik";
import { range } from "lodash-es";
import SubmitCancel from "../../../../components/input/submitcancel";
import { CombinedError } from "urql";
import Abittieditor from "../../../../components/input/abittieditor";

interface PeerProps {}

export const Peer: React.FC<PeerProps> = () => {
  const router = useRouter();
  const course = useCurrentCourse();
  console.log(parseNumberDefaultIfNot(router.query.peerAssignmentId, 0), router.query);
  const [{ data, fetching, error }] = useGetMyPeerAssesmentQuery({
    variables: { assignmentId: parseNumberDefaultIfNot(router.query.peerAssignmentId, 0) },
  });
  const peerAssignment = data?.getMyPeerAssesment;
  const [currentPairIndex, setCurrentPairIndex] = useState(0);

  const [statusMessage, setStatusMessage] = useState("");
  const [submitError, setSubmitError] = useState(undefined as CombinedError | undefined);
  const [, updatePeerPoints] = useUpdatePeerAssesmentMutation();
  if (!peerAssignment || !peerAssignment.pairs?.length) {
    return (
      <Loading isLoading={fetching}>
        <Box>
          Tehtävää ei löytynyt tai vertaisarviointi ei ole vielä alkanut. Jos kirjoitit linkin itse tarkasta linkin
          oikeinkirjoitus
        </Box>
      </Loading>
    );
  }
  const assignment = peerAssignment.assignment;
  const isSingleTask = assignment.tasks.length === 1;
  const currentPair = peerAssignment.pairs[currentPairIndex];
  return (
    <LoginRequired>
      <Wrapper
        size="lg"
        flexDir="column"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ ">div": { w: "100%" } }}
      >
        <CourseBanner
          initialTab={1}
          errorMessage={error?.message}
          namePredicate={(args) => {
            if (args.tab != 1) {
              return undefined;
            }

            return `Vertaisarviointi - ${peerAssignment.assignment.name}`;
          }}
          customTabs={{
            1: (
              <Box>
                <Box>
                  <Breadcrumb separator="-">
                    <BreadcrumbItem>
                      <NextLink href={`/view/${course?.id}`}>
                        <BreadcrumbLink>{course?.name}</BreadcrumbLink>
                      </NextLink>
                    </BreadcrumbItem>
                  </Breadcrumb>
                </Box>
                <Loading isLoading={fetching}>
                  <VStack spacing={8} align="flex-start">
                    <Heading size="md">Vertaisarviointi: {peerAssignment.assignment.name}</Heading>
                    <VStack spacing={0} className="link" align="flex-start" p={2} w="100%">
                      <Heading size="sm">Arvioitavat palautukset:</Heading>
                      {peerAssignment.pairs.map((p, i) => {
                        return (
                          <HStack spacing={2}>
                            <Link
                              key={p.id}
                              textDecoration={i === currentPairIndex ? "underline" : "none"}
                              onClick={() => setCurrentPairIndex(i)}
                              textUnderlineOffset={"0.2em"}
                            >
                              Palautus {i + 1}
                            </Link>
                            <Box display="inline" color={p.points == null ? "red" : "green"}>
                              {p.points == null ? "(ei arvioitu)" : "(arvioitu)"}
                            </Box>
                          </HStack>
                        );
                      })}
                    </VStack>
                    <VStack spacing={3} align="flex-start" maxW="100%" key={currentPair.id}>
                      <Heading size="md">Palautus</Heading>
                      {currentPair.assessedSubmits.map((s) => (
                        <Box key={s.id}>
                          <Heading size="sm" display={isSingleTask ? "none" : undefined}>
                            Tehtävä {s.task.number}
                          </Heading>
                          <DisplayRichtext content={s.description} />
                          <FileList files={s.files} />
                        </Box>
                      ))}

                      <Formik
                        initialValues={{ points: currentPair.points, description: currentPair.description ?? "" }}
                        onSubmit={async (values, formikProps) => {
                          console.log(values);
                          setSubmitError(undefined);
                          setStatusMessage("");
                          const res = await updatePeerPoints({
                            pairId: currentPair.id,
                            points: parseNumberDefaultIfNot(values.points, null),
                            description: values.description,
                          });
                          if (res.error) {
                            setSubmitError(res.error);
                          } else {
                            const nextIndex = peerAssignment.pairs!.findIndex((pair) => {
                              if (pair.id == res.data?.updatePeerAssesment.id) {
                                return res.data.updatePeerAssesment.points == null;
                              }
                              return pair.points == null;
                            });
                            if (nextIndex < 0) {
                              setStatusMessage("Kaikki vertaisarvioinnit palautettu!");
                            } else {
                              setCurrentPairIndex(nextIndex);
                            }
                          }
                          formikProps.setSubmitting(false);
                        }}
                      >
                        {(formikProps) => {
                          return (
                            <Form>
                              <VStack align="flex-start">
                                <FormControl>
                                  <FormLabel htmlFor="description">Anna palautetta</FormLabel>
                                  <Abittieditor
                                    oldData={currentPair.description}
                                    onUpdate={({ answerHTML }) => {
                                      formikProps.setFieldValue("description", answerHTML);
                                    }}
                                  />
                                </FormControl>
                                <Field name="points">
                                  {({ field }: FieldProps) => (
                                    <FormControl>
                                      <FormLabel htmlFor="points">Pisteet</FormLabel>
                                      <Select
                                        name="points"
                                        placeholder=" "
                                        id="pointsId"
                                        onChange={field.onChange}
                                        defaultValue={currentPair.points ?? undefined}
                                        width="max-content"
                                      >
                                        {range(sum(1, ...assignment.tasks.map((t) => t.points))).map(
                                          (_, possiblePointValue) => (
                                            <option key={possiblePointValue} value={possiblePointValue}>
                                              {possiblePointValue}
                                            </option>
                                          )
                                        )}
                                      </Select>
                                    </FormControl>
                                  )}
                                </Field>

                                <SubmitCancel
                                  isLoading={formikProps.isSubmitting}
                                  cancelStyling={{ display: "none" }}
                                  error={submitError}
                                  submitLabel="Tallenna ja näytä seuraava"
                                  submitProps={{
                                    disabled:
                                      formikProps.values.description == null ||
                                      formikProps.values.description.length === 0,
                                    title:
                                      formikProps.values.description == null ||
                                      formikProps.values.description.length === 0
                                        ? "Sinun täytyy kommentoida palautusta, ennen kuin voit pisteyttää sen"
                                        : "Tallenna ja näytä seuraava",
                                  }}
                                >
                                  {statusMessage}
                                </SubmitCancel>
                              </VStack>
                            </Form>
                          );
                        }}
                      </Formik>
                    </VStack>
                  </VStack>
                </Loading>
              </Box>
            ),
          }}
        />
      </Wrapper>
    </LoginRequired>
  );
};

export default Peer;
