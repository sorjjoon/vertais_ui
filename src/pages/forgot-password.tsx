import { VStack, Box, Heading, Flex, Link, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import Head from "next/head";
import React, { useState } from "react";
import TextInputfield from "../components/textinputfield";
import Wrapper from "../components/wrapper";
import { useResetPasswordMutation } from "../generated/graphql";
import { formatGraphQLerror } from "../utils/utils";

interface forgotPasswordProps {}
export const ForgotPassword: React.FC<forgotPasswordProps> = ({}) => {
  const [done, setDone] = useState(false);
  const [, forgotPasswordMutation] = useResetPasswordMutation();
  return (
    <Wrapper size="sm" addBorder={true}>
      <Head>
        <title>Salasanan nollaus</title>
      </Head>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values, { setErrors }) => {
          setDone(false);
          const res = await forgotPasswordMutation(values);
          if (res.error) {
            setErrors({ email: formatGraphQLerror(res.error.message) });
          } else {
            setDone(true);
          }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <VStack
              spacing={3}
              sx={{
                ">:first-of-type": { mb: "calc(var(--chakra-space-3)*1.3)" },
                ">:last-of-type": { mt: "calc(var(--chakra-space-3)*1.3)" },
                ">*": { w: "100%" },
              }}
            >
              <Box>
                <Heading size={"md"}>Salasanan nollaus</Heading>
              </Box>
              <Box>
                <TextInputfield name="email" label="Sähköposti" isRequired={false} />
              </Box>
              {done ? <Box color="green.500">Linkki salasanan nollaamiseen on lähetetty sähköpostiisi</Box> : null}
              <Box>
                <Button type="submit" colorScheme="red" isLoading={isSubmitting}>
                  Nollaa salasana
                </Button>
              </Box>
            </VStack>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default ForgotPassword;
