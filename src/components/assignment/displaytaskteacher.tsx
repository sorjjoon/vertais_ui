import { Box, Link } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  AssignmentFragment,
  TaskFragment,
  useDeleteSubmitMutation,
  useUpdateSubmitMutation,
  useUploadFilesMutation,
} from "../../generated/graphql";
import { parseDate } from "../../utils/utils";
import { useCurrentCourse } from "../providers/courseprovider";
import { useCurrentUser } from "../providers/userprovider";
import NextLink from "next/link";
import GradeTable from "./gradetable";
import LoginRequired from "../utils/loginrequired";

interface DisplayTaskTeacherProps {
  assignment: AssignmentFragment;
  task: TaskFragment;
}
export const DisplayTaskTeacher: React.FC<DisplayTaskTeacherProps> = ({
  task,

  assignment,
}) => {
  const user = useCurrentUser();
  const router = useRouter();
  const course = useCurrentCourse();

  const isSingleTask = assignment.tasks.length == 1;
  var content;

  const deadlineIsPast = assignment.deadline != null && parseDate(assignment.deadline)! < new Date();

  content = <GradeTable task={task} />;

  return <LoginRequired>{content} </LoginRequired>;
};

export default DisplayTaskTeacher;
