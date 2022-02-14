import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Link,
  ListItem,
  StackDivider,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import router from "next/router";
import React, { useState } from "react";
import {
  useGetUpcomingAssignmentsQuery,
  useMyCoursesQuery,
  UserRole,
  useSignUpCourseMutation,
} from "../generated/graphql";
import { formatGraphQLerror } from "../utils/utils";
import NextLink from "next/link";
import Image from "next/image";
import { useCurrentUser } from "../components/providers/userprovider";

import LoginRequired from "../components/utils/loginrequired";
import Head from "next/head";
import Wrapper from "../components/wrapper";
import { Form, Formik } from "formik";

import { concat } from "lodash-es";
import TextInputfield from "../components/textinputfield";
import { CodeSchema } from "../utils/validation";
import StatusMessage from "../components/statusmessage";
import Loading from "../components/utils/loading";
import ErrorMessage from "../components/utils/errormessage";
interface MyPageProps {}
export const My: React.FC<MyPageProps> = () => {
  const [{ fetching, data, error }] = useMyCoursesQuery();
  const [msg, setMessage] = useState("");
  const [, signUp] = useSignUpCourseMutation();
  const user = useCurrentUser();
  const [upcomingDataState] = useGetUpcomingAssignmentsQuery();
  let content;
  console.log(upcomingDataState);
  if (fetching || user === undefined) {
    content = <Loading />;
  } else if (error) {
    console.log(error);
    content = <div>{formatGraphQLerror(error.message)}</div>;
  } else if (data?.getMyCourses?.length === 0) {
    content = (
      <Text textAlign="left" className="noCourseText" w="20em" maxW="100%">
        {user?.role == UserRole.Student
          ? "Et ole vielä liittynyt kursseille"
          : "Et ole vielä luonut kursseja. Uuden kurssin voi luoda oikeasta yläkulmasta"}
      </Text>
    );
  } else {
    content = data?.getMyCourses?.map((course) => (
      <Box
        id={"course-" + course.id}
        w={"33%"}
        minW={"18em"}
        maxW={{ base: "100%", sm: "100%", md: "23em" }}
        _hover={{ background: "#f0f2f5" }}
        className="courseContainer"
        pb={1}
        key={course.id}
      >
        <NextLink
          href={{
            pathname: "/course/[courseId]",
            query: { courseId: course.id },
          }}
        >
          <Link h={"100%"} w={"100%"}>
            <img
              src={course.icon.includes("course-icons") ? course.icon : "/course-icons/" + course.icon}
              alt={"Kurssi ikoni: " + course.name}
              title={course.name.length > 10 ? course.abbreviation || course.name : course.name}
            ></img>
            <Text fontSize={"1.2em"}>{course.name}</Text>
          </Link>
        </NextLink>
      </Box>
    ));
  }

  return (
    <LoginRequired>
      <Head>
        <title>Kurssini</title>
      </Head>
      <Flex
        id="mainWrapper"
        flexDir="row"
        justify={{ base: "center", sm: "center", md: "flex-start" }}
        wrap="wrap"
        w="100%"
        maxW="100vw"
        sx={{
          ">div": {
            mb: "5em",
          },
          ".courseContainer": {
            m: 5,
            ml: 0,
          },
        }}
      >
        <Box w={{ base: "min-content", sm: "min-content", md: "60%", lg: "65%" }} minH="10em">
          <Heading mt={0} size={"md"}>
            Kurssini
          </Heading>

          <Flex
            w={{ base: "min-content", sm: "min-content", md: "100%" }}
            my={2}
            direction="row"
            wrap="wrap"
            justify={{ base: "center", sm: "center", md: "flex-start" }}
          >
            <Divider my={3} w="100%" />
            {content}
          </Flex>
        </Box>

        {user?.role == UserRole.Student ? (
          <Box w={{ base: "18em", sm: "18em", md: "30%", lg: "25%" }} maxW="100%">
            <Box my={14}>
              <Formik
                initialValues={{ code: "" }}
                validateOnChange={true}
                validateOnBlur={true}
                onSubmit={async (values, actions) => {
                  const res = await signUp(values);
                  if (res.error) {
                    actions.setErrors({ code: formatGraphQLerror(res.error.message) });
                  } else {
                    setMessage("Lisätty");
                  }
                  actions.setSubmitting(false);
                }}
                validationSchema={CodeSchema}
              >
                {({ isSubmitting, isValid }) => (
                  <Form>
                    <VStack spacing={1} sx={{}} justify="left" alignItems="start">
                      <Heading size={"sm"}>Lisää minut kurssille</Heading>
                      <Box>
                        <TextInputfield name="code" placeholder="" label="Kurssikoodi" isRequired={true} />
                      </Box>

                      <Flex>
                        <Button type="submit" colorScheme="red" isLoading={isSubmitting} disabled={!isValid}>
                          Lisää
                        </Button>
                        <StatusMessage ml="auto">{msg}</StatusMessage>
                      </Flex>
                    </VStack>
                  </Form>
                )}
              </Formik>
            </Box>
          </Box>
        ) : null}
      </Flex>
    </LoginRequired>
  );
};

export default My;
