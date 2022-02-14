import { VStack, Box, Heading, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";

import React, { useState } from "react";
import Checkboxinput from "../../components/input/checkboxinput";
import LoginRequired from "../../components/utils/loginrequired";
import TextInputfield from "../../components/textinputfield";
import Wrapper from "../../components/wrapper";
import { useInsertCourseMutation } from "../../generated/graphql";
import { createErrorMap, formatGraphQLerror, getRandom } from "../../utils/utils";
import register from "../register";
import ErrorMessage from "../../components/utils/errormessage";

interface CourseProps {}
const Course: React.FC<CourseProps> = ({}) => {
  const [, insertCourse] = useInsertCourseMutation();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  return (
    <Wrapper>
      <Head>
        <title>Uusi kurssi</title>
      </Head>
      <LoginRequired />
      <Formik
        initialValues={{ description: "", name: "", abbreviation: "", icon: "" }}
        onSubmit={async (values, { setErrors }) => {
          setError(null);
          const icon = getRandom(process.env.NEXT_PUBLIC_COURSE_ICONS as unknown as string[]);
          values.icon = icon;
          const res = await insertCourse(values);

          if (res.error) {
            setError(formatGraphQLerror(res.error.message));
          } else {
            router.push("/view/course/" + res.data?.insertCourse?.id);
          }
        }}
        validate={({ abbreviation }) => {
          if (abbreviation.length > 6) {
            return { abbreviation: "Lyhenteen pituus saa olla enintään 6 merkkiä" };
          }
          return undefined;
        }}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <VStack
              spacing={3}
              sx={{
                ">div": { maxW: "20em", w: "100%", py: 2 },
              }}
            >
              <Box>
                <Heading size={"md"}>Uusi kurssi</Heading>
              </Box>
              <Box>
                <TextInputfield name="name" placeholder="Kurssin nimi" label="Kurssin nimi" isRequired={true} />
              </Box>
              <Box>
                <TextInputfield
                  name="abbreviation"
                  size={6}
                  placeholder="Vapaaehtoinen"
                  label="Lyhenne"
                  isRequired={false}
                  helperText="Lyhenettä käytetään etusivulla, jos kurssin koko nimi on liian pitkä näytettäväksi"
                />
              </Box>

              <Box>
                <Button type="submit" variant="save" isLoading={isSubmitting}>
                  Luo kurssi
                </Button>
              </Box>
              <ErrorMessage message={error} />
            </VStack>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};
export default Course;
