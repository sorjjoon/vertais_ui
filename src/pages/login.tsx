import { Box, Button, VStack, Heading, Container, Link, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import TextInputfield from "../components/textinputfield";
import Wrapper from "../components/wrapper";
import { useLoginMutation } from "../generated/graphql";
import { createErrorMap } from "../utils/utils";
import { useRouter } from "next/router";
import NextLink from "next/link";
import Head from "next/head";
import { useClient } from "../components/providers/urqlclientprovider";
interface loginProps {}
const Login: React.FC<loginProps> = ({}) => {
  const [, login] = useLoginMutation();
  const router = useRouter();
  const { resetClient } = useClient();
  return (
    <Wrapper size="sm" addBorder={true}>
      <Head>
        <title>Kirjaudu sisäään</title>
      </Head>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const res = await login(values);
          if (res.data?.login?.errors) {
            console.log(res.data?.login?.errors);
            setErrors(createErrorMap(res.data.login.errors));
          } else if (res.error) {
            console.log(res.error);
            setErrors({
              username: "Olemme pahoillamme, mutta jokin meni pieleen",
              password: res.error.message,
            });
          } else {
            console.log("login success, redirecting");
            resetClient();
            if (router.query.next) {
              console.log("next location found, not directing to index");
              router.push(router.query.next as any, undefined, { shallow: false });
            } else {
              router.push("/", undefined, { shallow: false });
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <VStack
              spacing={3}
              sx={{
                ">:first-of-type": { mb: "calc(var(--chakra-space-3)*1.1)" },
                ">:last-of-type": { mt: "calc(var(--chakra-space-3)*1.1)" },
                ">*": { w: "100%" },
              }}
            >
              <Box>
                {" "}
                <Heading size={"md"}>Kirjaudu sisään</Heading>{" "}
              </Box>
              <Box>
                <TextInputfield name="username" placeholder="Käyttäjänimi" label="Käyttäjänimi" isRequired={true} />
              </Box>
              <Box>
                <TextInputfield
                  type="password"
                  name="password"
                  placeholder="Salasana"
                  label="Salasana"
                  isRequired={true}
                />
              </Box>
              <Flex>
                <Box ml="auto">
                  <NextLink href="/forgot-password">
                    <Link fontSize="small">Unohdin salasanani tai käyttäjänimeni</Link>
                  </NextLink>
                </Box>
              </Flex>
              <Box>
                <Button type="submit" variant="save" isLoading={isSubmitting}>
                  Kirjaudu sisään
                </Button>
              </Box>
            </VStack>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login;
