import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import React from "react";

import { useRouter } from "next/router";
import Loading from "../../../../../components/utils/loading";
import { useGetAssignmentsQuery, UserRole } from "../../../../../generated/graphql";
import { parseNumberDefaultIfNot } from "../../../../../utils/utils";
import Link from "next/link";
import CourseBanner from "../../../../../components/course/coursebanner";
import { useCurrentCourse } from "../../../../../components/providers/courseprovider";
import Wrapper from "../../../../../components/wrapper";
import LoginRequired from "../../../../../components/utils/loginrequired";
import DisplayTask from "../../../../../components/assignment/displaytaskstudent";
import { useCurrentUser } from "../../../../../components/providers/userprovider";
import DisplayTaskTeacher from "../../../../../components/assignment/displaytaskteacher";
const TaskView: React.FC<{}> = () => {
  const router = useRouter();
  const course = useCurrentCourse();
  const user = useCurrentUser();
  const [{ data, fetching, error }] = useGetAssignmentsQuery({
    variables: { courseId: parseNumberDefaultIfNot(router.query.courseId, 0) },
  });
  if (fetching) {
    return <Loading />;
  }
  if (!data?.getAssignments) {
    return <Box> "Tehtävää ei löytynyt, jos kirjoitit linkin itse tarkasta linkin oikeinkirjoitus"</Box>;
  }
  const assignment = data.getAssignments.assignments.find((a) =>
    a.tasks.map((t) => t.id).includes(parseNumberDefaultIfNot(router.query.taskId, 0))
  );
  const task = assignment?.tasks.find((t) => t.id == parseNumberDefaultIfNot(router.query.taskId, 0));
  if (!assignment || !task) {
    return <Box> "Tehtävää ei löytynyt, jos kirjoitit linkin itse tarkasta linkin oikeinkirjoitus"</Box>;
  }
  const isSingleTask = assignment.tasks.length == 1;

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
            let name;
            if (isSingleTask) {
              name = assignment.name;
            } else {
              name = assignment.name + " - Tehtävä " + task.number;
            }
            if (user?.role === UserRole.Teacher) {
              name += " -  palautukset";
            }
            return name;
          }}
          customTabs={{
            1: (
              <>
                <Box className="link">
                  <Breadcrumb separator="-">
                    <BreadcrumbItem>
                      <Link href={`/course/${course?.id}`} passHref>
                        <BreadcrumbLink>{course?.name}</BreadcrumbLink>
                      </Link>
                    </BreadcrumbItem>
                    {isSingleTask ? (
                      <BreadcrumbItem>
                        <Link href={`/course/${course?.id}/task/${task.id}`} passHref>
                          <BreadcrumbLink>{assignment.name}</BreadcrumbLink>
                        </Link>
                      </BreadcrumbItem>
                    ) : (
                      <>
                        <BreadcrumbItem>
                          <Link href={`/course/${course?.id}?a=${assignment.id}&tab=1`} passHref>
                            <BreadcrumbLink>{assignment.name}</BreadcrumbLink>
                          </Link>
                        </BreadcrumbItem>
                        <BreadcrumbItem isCurrentPage>
                          <Link href={`/course/${course?.id}/task/${task.id}`} passHref>
                            <BreadcrumbLink>Tehtävä {task.number}</BreadcrumbLink>
                          </Link>
                        </BreadcrumbItem>
                      </>
                    )}
                  </Breadcrumb>
                </Box>
                {user?.role === UserRole.Student ? (
                  <DisplayTask task={task} assignment={assignment} showSubmitModButton />
                ) : (
                  <DisplayTaskTeacher task={task} assignment={assignment} />
                )}
              </>
            ),
          }}
        />
      </Wrapper>
    </LoginRequired>
  );
};

export default TaskView;
