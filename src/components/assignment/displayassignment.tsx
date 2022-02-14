import NextLink from "next/link";
import {
  Box,
  Button,
  Collapse,
  Grid,
  Text,
  Heading,
  Spinner,
  useDisclosure,
  VStack,
  GridItem,
  Link,
  Flex,
  HStack,
  Divider,
} from "@chakra-ui/react";

import React, { Fragment, useEffect, useRef, useState } from "react";
import sanitize from "sanitize-html";
import {
  AssignmentFragment,
  CourseFragment,
  TaskFragment,
  useDeleteAssignmentMutation,
  useGetStudentsQuery,
  UserRole,
} from "../../generated/graphql";
import { formatGraphQLerror, formatDate, assignmentHasActivePeerAssesment } from "../../utils/utils";
import ModifyAssignment from "./modifyassignment";
import FileList from "../file/filelist";
import { ErrorMessage } from "../utils/errormessage";
import SettingsButton from "../utils/settingsbutton";
import { useCurrentUser } from "../providers/userprovider";
import DisplayTask from "./displaytaskstudent";
import TaskPreview from "./taskpreview";
import { InfoIcon } from "@chakra-ui/icons";
import { Status } from "../../utils/types";
import MissingSubmitsIcon from "../utils/missingsubmitsicon";
import Loading from "../utils/loading";
import DisplayRichtext from "../utils/displayrichtext";
import { useRouter } from "next/router";
import { useCurrentCourse } from "../providers/courseprovider";

interface displayassignmentProps {
  assignment: AssignmentFragment;
  course: CourseFragment;
  canModify?: boolean;
  defaultIsOpen?: boolean;
  // onTaskClick: (task: TaskFragment) => void;
  onModify?: () => void;
  taskLinkPrefix?: string;
  className?: string;
  onMount?: (ref: React.MutableRefObject<HTMLDivElement>) => void;
}

function mapOrDefault<T, D, R>(arr: T[], defaultVal: D, predicate: (elem: T, i: number, arr: T[]) => R, minLength = 1) {
  if (arr.length < minLength) {
    return defaultVal;
  }

  return arr.map(predicate);
}

const DisplayAssignment: React.FC<displayassignmentProps> = ({
  assignment,
  course,
  className = "",
  onModify = () => void 0,
  canModify = false,
  defaultIsOpen = false,
  taskLinkPrefix = "task-link",
  onMount = () => {},
}) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const user = useCurrentUser();
  const [{ fetching: deleteFetching }, deleteAssignment] = useDeleteAssignmentMutation();
  const [{ data: studentsData, fetching: studentsFetching }] = useGetStudentsQuery({
    variables: { courseId: course.id },
  });

  const isHidden = parseInt(assignment.options.reveal) > new Date().getTime();
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen });
  const ref = useRef(null as any);

  useEffect(() => {
    onMount(ref);
  }, []);

  const deadlineIsPast = assignment.options.deadline < new Date();

  return (
    <VStack
      className={"add-border assignment-wrapper " + className + (assignment.tasks.length == 1 ? " one-task " : "")}
      my={4}
      id={"assignment-" + assignment.id}
      ref={ref}
      maxW="100%"
    >
      <HStack
        className="animate-shrink"
        spacing={4}
        px={4}
        background="gray.100"
        _hover={{ background: "gray.200" }}
        w="100%"
      >
        <Button
          px={0}
          background="inherit"
          _hover={{ background: "inherit" }}
          w="100%"
          m={0}
          onClick={onToggle}
          _focus={{ border: "none" }}
        >
          {assignment.name}
        </Button>
        <Flex
          my={1}
          h={8}
          id={"settings-" + assignment.id}
          w="max-content"
          minH="max-content"
          direction="column"
          justify="center"
        >
          {canModify ? (
            <SettingsButton
              textColor="white"
              onModify={onModify}
              isDeleting={deleteFetching}
              onDelete={async () => {
                deleteAssignment({ id: assignment.id }).then((res) => {
                  if (res.error) {
                    console.log(res.error);
                    setError(formatGraphQLerror(res.error.message));
                  }
                  console.log(res.data?.deleteAssignment);
                });
              }}
            />
          ) : (
            <MissingSubmitsIcon assignment={assignment} />
          )}
        </Flex>
      </HStack>
      <Collapse in={isOpen} animateOpacity>
        <VStack
          h="max-content"
          w="100%"
          id={"assignment-" + assignment.id}
          className={" assignment " + (canModify ? " mod " : " view ") + (isHidden ? " hidden " : "  ")}
          p={3}
          alignItems="flex-start"
        >
          <DisplayRichtext content={assignment.description} />
          <Divider />
          {isHidden ? (
            <Box className="reveal-info">Näkyy opiskeilijoille: {formatDate(assignment.options.reveal)} </Box>
          ) : null}

          <Box className="deadline-info">
            <Heading fontSize="0.9em">Palautuspäivä: </Heading>{" "}
            {formatDate(assignment.options.deadline, { default: "Ei palautuspäivää", addPostFix: true })}
          </Box>
          <Box
            className={`peer-info ${
              assignment.options.hasPeerAssesment && assignment.peerAssesment?.options.deadline > new Date()
                ? ""
                : "hide"
            }`}
          >
            <Heading fontSize="0.9em">
              {deadlineIsPast ? "Vertaisarvioinnin palautuspäivä" : "Vertaisarviointi alkaa"}:{" "}
            </Heading>{" "}
            {formatDate(deadlineIsPast ? assignment.peerAssesment?.options.deadline : assignment.options.deadline, {
              addPostFix: true,
            })}
          </Box>
          <Divider />
          <VStack className="task-list" w="100%">
            <Box className={`task-list-header ${assignment.tasks.length == 1 ? "hide" : ""}`}>
              <Heading size="sm" pt={5}>
                Tehtävät:
              </Heading>
            </Box>

            {mapOrDefault(
              assignment.tasks,
              <Box w="100%" className="full-task">
                <TaskPreview task={assignment.tasks[0]} assignment={assignment} hideAssignmentInfo />
              </Box>,
              (t) => (
                <Box>
                  <Box className="task-info">
                    <NextLink
                      href={{
                        pathname: "/course/[courseId]/task/[taskId]",
                        query: { courseId: course.id, taskId: t.id },
                      }}
                      passHref
                    >
                      <Link h={"100%"} w={"100%"} id={taskLinkPrefix + t.id} className="task-link">
                        Tehtävä {t.number}
                      </Link>
                    </NextLink>
                  </Box>
                  <Box className="submit-info">
                    {user?.role === UserRole.Student ? (
                      t.mySubmit ? (
                        <Text className="has-submit">Palautettu</Text>
                      ) : (
                        <Text className="no-submit">Ei palautettu</Text>
                      )
                    ) : (
                      <Loading isLoading={studentsFetching}>
                        {`Palautuksia ${t.submits?.length}/${studentsData?.getStudents?.length}`}
                      </Loading>
                    )}
                  </Box>
                </Box>
              ),
              2
            )}
          </VStack>
          {assignmentHasActivePeerAssesment(assignment) ? (
            <Flex maxW="100%" w="100%" flexDir="row" flexWrap="wrap" justifyContent="flex-start">
              <Box mr="0.65em">
                <NextLink href={`/course/${course.id}/peer/${assignment.peerAssesment?.id}`} passHref>
                  <Link className="link">
                    {assignment.peerAssesment?.options.deadline > new Date()
                      ? "Vertaisarviointi käynnissä"
                      : "Vertaisarviointi sulkeutunut"}
                  </Link>
                </NextLink>
              </Box>
            </Flex>
          ) : null}
        </VStack>
      </Collapse>
    </VStack>
  );
};
export default DisplayAssignment;
