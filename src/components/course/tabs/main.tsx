import { Box, Text } from "@chakra-ui/layout";
import { Stack, TabPanel } from "@chakra-ui/react";
import React from "react";
import { useGetAssignmentsQuery, UserRole } from "../../../generated/graphql";
import Displaycomment from "../../comment/displaycomment";
import ModifyComment from "../../comment/modifycomment";
import Loading from "../../utils/loading";
import { useCurrentCourse } from "../../providers/courseprovider";
import { useCurrentUser } from "../../providers/userprovider";

interface mainProps {}
const MainPanel: React.FC<mainProps> = ({}) => {
  const user = useCurrentUser();
  const course = useCurrentCourse();

  if (course == null) {
    return <Loading />;
  }
  return (
    <Box className="container" as="section">
      <Box as="section">{user?.role === UserRole.Teacher ? <ModifyComment showReveal course={course} /> : null}</Box>
      <Stack className="comment-list">
        {course.comments.length ? (
          course.comments.map((com) => (
            <Box
              key={"comment" + com.id}
              p={2}
              shadow="md"
              borderWidth="1px"
              borderRadius="md"
              className="comment-container"
            >
              <Displaycomment comment={com} canModify={user?.role === UserRole.Teacher} />
            </Box>
          ))
        ) : (
          <Text>Kurssilla ei ole vielä ilmoituksia</Text>
        )}
      </Stack>
    </Box>
  );
};

export default MainPanel;
