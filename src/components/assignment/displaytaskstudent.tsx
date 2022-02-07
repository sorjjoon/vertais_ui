import { Box, Divider, Link, VStack } from "@chakra-ui/layout";
import React, { useState } from "react";
import {
  AssignmentFragment,
  TaskFragment,
  useDeleteSubmitMutation,
  useGetSubmitQuery,
  UserRole,
  useUpdateSubmitMutation,
  useUploadFilesMutation,
} from "../../generated/graphql";
import { sanitize } from "../../utils/sanitize";
import FileList from "../file/filelist";
import LoginRequired from "../utils/loginrequired";
import { useCurrentUser } from "../providers/userprovider";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { Button, Heading, Table, Tbody, Td, Th, Tr, useDisclosure } from "@chakra-ui/react";
import { confirmPromise, formatDate, parseDate, uploadFiles, uuid } from "../../utils/utils";
import TextFileInput from "../input/textfileinputlegacy";
import { Form, Formik } from "formik";
import SubmitCancel from "../input/submitcancel";
import ErrorMessage from "../errormessage";

import { useCurrentCourse } from "../providers/courseprovider";
import Loading from "../utils/loading";
import Displaycomment from "../comment/displaycomment";
import Commentable from "../input/commentable";
import SubmitTable from "./submittable";
import ModifySubmit from "./modifysubmit";
import DisplayRichtext from "../utils/displayrichtext";

interface DisplayTaskProps {
  assignment: AssignmentFragment;
  task: TaskFragment;
  hideAssignmentInfo?: boolean;
  showSubmitModButton?: boolean;
}
export const DisplayTask: React.FC<DisplayTaskProps> = ({
  task,

  assignment,
  hideAssignmentInfo,
  showSubmitModButton,
}) => {
  const user = useCurrentUser();
  const { isOpen, onToggle } = useDisclosure();
  const isSingleTask = assignment.tasks.length == 1;
  const [{ fetching, data: submitData }] = useGetSubmitQuery({ variables: { ownerId: user?.id, taskId: task.id } });
  const deadlineIsPast = assignment.options.deadline != null && parseDate(assignment.options.deadline)! < new Date();
  const canModify = !deadlineIsPast && !submitData?.getSubmit?.mySubmit?.grade;
  return (
    <LoginRequired>
      <Loading isLoading={fetching}>
        <VStack className="task-wrapper" spacing={4} alignItems="flex-start">
          <Heading size="md" className={hideAssignmentInfo ? "hide" : "assignment-info"}>
            {assignment.name}
            {!isSingleTask ? ` - Tehtävä ${task.number}` : null}
          </Heading>
          <DisplayRichtext content={assignment.description} />

          {task.description && task.description.trim() ? (
            <>
              <Divider />

              <Box w="100%" className="content" dangerouslySetInnerHTML={{ __html: task.description }} />
            </>
          ) : null}
          <FileList files={assignment.files.concat(task.files)} />
          <Divider />
          {!isOpen ? (
            <Box w="100%">
              <SubmitTable task={task} assignment={assignment} />{" "}
            </Box>
          ) : undefined}
          <Box className="submit-modify" w="100%">
            {isOpen ? (
              <ModifySubmit task={task} assignment={assignment} afterCancel={onToggle} afterSubmit={onToggle} />
            ) : (
              <Button
                className={showSubmitModButton ? "mod-submit-button" : "hide"}
                title={
                  deadlineIsPast ? "Palautusaika on umpetunut" : !canModify ? "Palautuksesi on jo arvioitu" : "Muokkaa"
                }
                onClick={() => {
                  onToggle();
                }}
                disabled={!canModify}
              >
                Muokkaa palautustasi
              </Button>
            )}
          </Box>
        </VStack>
      </Loading>
    </LoginRequired>
  );
};

export default DisplayTask;
