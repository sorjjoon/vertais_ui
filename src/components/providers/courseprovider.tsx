import { useRouter } from "next/router";
import React from "react";
import { CourseFragment, useGetCourseQuery } from "../../generated/graphql";
import { parseNumberDefaultIfNot } from "../../utils/utils";

const CurrentCourseContext = React.createContext<CourseFragment | null | undefined>(undefined);

export const CourseProvider: React.FC = ({ children }) => {
  const router = useRouter();
  const [{ data, error, fetching }] = useGetCourseQuery({
    variables: { id: parseNumberDefaultIfNot(router.query.courseId, 0) },
  });
  if (error) {
    console.log(error);
  }
  if (fetching) {
    return <CurrentCourseContext.Provider value={undefined}>{children}</CurrentCourseContext.Provider>;
  } else {
    return <CurrentCourseContext.Provider value={data?.getCourse ?? null}>{children}</CurrentCourseContext.Provider>;
  }
};

export const useCurrentCourse = () => React.useContext(CurrentCourseContext);
