import { Box, Button, Heading, VStack } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import TextInputfield from "../../components/textinputfield";
import Wrapper from "../../components/wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createErrorMap } from "../../utils/utils";

const ResetPassword: NextPage = () => {
  const [, changePassword] = useChangePasswordMutation();
  const router = useRouter();

  return (
    <Wrapper size="sm" addBorder={true}>
      <Head>
        <title>Nollaa salasana</title>
      </Head>
      <Formik
        initialValues={{ password: "", password2: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            password: values.password,
            resetToken: typeof router.query.token === "string" ? router.query.token : "",
          });
          if (response.data?.updateUser?.errors) {
            setErrors(createErrorMap(response.data?.updateUser?.errors));
          } else if (response.data?.updateUser?.user) {
            router.push("/login");
          }
        }}
        validate={({ password, password2 }) => {
          if (password !== password2) {
            return { password2: "Salasanat eivät täsmää" };
          }
          return undefined;
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <VStack
              spacing={3}
              sx={{
                ">div:first-of-type": { mb: "calc(var(--chakra-space-3)*1.3)" },
                ">div:last-of-type": { mt: "calc(var(--chakra-space-3)*1.3)" },
                ">div": { maxW: "20em", w: "100%", py: 2 },
              }}
            >
              <Box>
                <Heading size={"md"}>Vaihda salasana</Heading>
              </Box>
              <Box>
                <TextInputfield
                  type="password"
                  name="password"
                  placeholder="Uusi salasana"
                  label="Uusi salasana"
                  isRequired={true}
                />
              </Box>
              <Box>
                <TextInputfield
                  type="password"
                  name="password2"
                  placeholder="Toista uusi salasana"
                  label="Toista uusi salasana"
                  isRequired={true}
                />
              </Box>
              <Box>
                <Button type="submit" variant="save" isLoading={isSubmitting}>
                  Tallenna
                </Button>
              </Box>
            </VStack>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

// export const getServerSideProps: GetServerSideProps = async function (context) {
//   if (!context.params?.courseId || Array.isArray(context.params.courseId)) {
//     return {
//       notFound: true,
//     };
//   }
//   return {
//     props: { token: context.params.token }, // will be passed to the page component as props
//   };
// };

export default ResetPassword;
