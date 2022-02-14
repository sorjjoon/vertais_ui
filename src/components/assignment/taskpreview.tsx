import { Box, Divider, Heading, Link, VStack, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { AssignmentFragment, TaskFragment, UserRole } from "../../generated/graphql";
import NextLink from "next/link";
import { useCurrentUser } from "../providers/userprovider";
import { formatDate } from "../../utils/utils";
import LoginRequired from "../utils/loginrequired";

import FileList from "../file/filelist";
import DisplayRichtext from "../utils/displayrichtext";

interface TaskPreviewProps {
  task: TaskFragment;
  assignment: AssignmentFragment;
  hideAssignmentInfo?: boolean;
}
export const TaskPreview: React.FC<TaskPreviewProps> = ({ task, assignment, hideAssignmentInfo }) => {
  const user = useCurrentUser();
  const router = useRouter();

  const isSingleTask = assignment.tasks.length == 1;

  const isReturned = !!task.mySubmit;
  return (
    <LoginRequired>
      <VStack className="task-wrapper" align="flex-start" justifyContent="flex-start">
        <Heading className={hideAssignmentInfo ? "hide" : "assignment-info"} size="lg">
          {assignment.name}
          {!isSingleTask ? ` - Tehtävä ${task.number}` : null}
        </Heading>
        <DisplayRichtext content={assignment.description} />

        <Divider display={!assignment.description ? "none" : undefined} my={8} />
        <DisplayRichtext content={task.description} />

        <FileList files={assignment.files.concat(task.files)} />
        <Divider my={8} />
        <Flex maxW="100%" w="100%" flexDir="row" flexWrap="wrap" justifyContent="flex-start">
          <Box mr="0.65em">
            <NextLink href={`/course/${router.query.courseId}/task/${task.id}`} passHref>
              <Link color="linkColor.100">
                {user?.role == UserRole.Student ? "Muokkaa palautustani" : "Tarkastele palautuksia"}
              </Link>
            </NextLink>
          </Box>
          <Box fontSize="smaller" color={isReturned ? "green.500" : "red.500"}>
            {user?.role == UserRole.Student
              ? formatDate(task?.mySubmit?.updatedAt, {
                  addPostFix: true,

                  prefix: "Palautettu: ",
                  default: "Ei palautettu",
                })
              : null}
          </Box>
        </Flex>
      </VStack>
    </LoginRequired>
  );
};

export default TaskPreview;
