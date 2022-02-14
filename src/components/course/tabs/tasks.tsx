import { TabPanel, Box, useDisclosure, Button, VStack } from "@chakra-ui/react";
import router from "next/router";
import React, { useState } from "react";
import { useGetAssignmentsQuery, UserRole } from "../../../generated/graphql";
import { parseNumberDefaultIfNot } from "../../../utils/utils";
import DisplayAssignment from "../../assignment/displayassignment";
import ModifyAssignment from "../../assignment/modifyassignment";
import ErrorMessage from "../../utils/errormessage";
import Loading from "../../utils/loading";
import { useCurrentCourse } from "../../providers/courseprovider";
import { useCurrentUser } from "../../providers/userprovider";

interface tasksProps {}
const TasksPanel: React.FC<tasksProps> = () => {
  const user = useCurrentUser();
  const course = useCurrentCourse();
  const [modAssignmentId, setModAssignmentId] = useState(null as null | number);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [{ data: assignmentData, fetching: assignmentFetching, error: assignmentError }] = useGetAssignmentsQuery({
    variables: { courseId: course?.id ?? 0 },
  });
  const [hasScorlled, setScrolled] = useState(false);

  const assignments = assignmentData?.getAssignments?.assignments ?? [];
  const initialScroll = parseNumberDefaultIfNot(router.query.a, 0);

  return (
    <VStack className="animate-shrink">
      <Box className={modAssignmentId != null || user?.role !== UserRole.Teacher ? "hide" : ""}>
        {isOpen ? (
          <ModifyAssignment course={course!} onClose={onClose} />
        ) : (
          <Button className="new-comment" onClick={onOpen}>
            Uusi palautus
          </Button>
        )}
      </Box>
      <ErrorMessage message={assignmentError}></ErrorMessage>
      <Box className={isOpen ? "hide" : "assignment-list-wrapper"} w="100%" h="100%">
        <Loading isLoading={course == null || assignmentFetching}>
          {modAssignmentId == null ? (
            <Box maxW="60em">
              {assignments.map((a) => (
                <DisplayAssignment
                  key={"assig" + a.id}
                  assignment={a}
                  canModify={user?.role === UserRole.Teacher}
                  course={course!}
                  onModify={() => {
                    setModAssignmentId(a.id);
                  }}
                  defaultIsOpen={a.id == initialScroll}
                  onMount={
                    !hasScorlled && initialScroll == a.id
                      ? (ref) => {
                          const div = ref.current;
                          div.scrollIntoView({ behavior: "smooth" });
                          setScrolled(false);
                        }
                      : undefined
                  }
                />
              ))}
            </Box>
          ) : (
            <ModifyAssignment
              oldData={assignments.find((a) => a.id == modAssignmentId)}
              course={course!}
              onClose={() => {
                setModAssignmentId(null);
              }}
            />
          )}
        </Loading>
      </Box>
    </VStack>
  );
};

export default TasksPanel;
