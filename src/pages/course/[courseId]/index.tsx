import React from "react";
import CourseBanner from "../../../components/course/coursebanner";
import Wrapper from "../../../components/wrapper";

const CourseView: React.FC<{}> = () => {
  return (
    <Wrapper
      size="lg"
      flexDir="column"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ ">div": { w: "100%" } }}
    >
      <CourseBanner />
    </Wrapper>
  );
};

export default CourseView;
