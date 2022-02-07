import { Box, Heading, Button, Flex, Text } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import Head from "next/head";
import React, { useState } from "react";
import PasswordInput from "../../components/input/passwordinput";
import { Loading } from "../../components/utils/loading";
import LoginRequired from "../../components/utils/loginrequired";
import StatusMessage from "../../components/statusmessage";
import TextInputfield from "../../components/textinputfield";
import { useCurrentUser } from "../../components/providers/userprovider";
import Wrapper from "../../components/wrapper";
import { useUpdateUserMutation } from "../../generated/graphql";

import { createErrorMap, formatDate } from "../../utils/utils";
import { PasswordSchema, UserInfoSchema } from "../../utils/validation";

export const User: React.FC = () => {
  const user = useCurrentUser();
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [userError, setUserError] = useState<string | null>(null);

  const [pswdStatus, setPswdStatus] = useState<string | null>(null);
  const [pswdError, setPswdError] = useState<string | null>(null);
  const [, updateQuery] = useUpdateUserMutation();
  if (user === undefined) {
    return <Loading />;
  }

  return (
    <LoginRequired>
      <Head>
        <title>Käyttäjätiedot</title>
      </Head>
      <Wrapper size={null}>
        <Flex
          flexDir="row"
          flexWrap="wrap"
          justifyContent="center"
          p={4}
          sx={{
            ">div": { mx: 4, minW: "max-content", w: "33%", maxW: "30em" },
            " .container ": {
              maxW: "25em",
            },
            " .container": {
              p: 6,
              m: 4,
              w: "100%",
              maxW: "max(25em, 33%)",

              maxH: "max-content",
              " >div": { my: 6, mx: 0 },
              " >div:last-child": { my: 0, mx: 0 },
            },
            //Duplicate value, in case min max is not supported

            " button": {
              mb: 0,
              mt: 0,
              mr: "auto",
            },

            " .errorMessage": {
              color: "red.600",
              ml: "auto",
              whiteSpace: "pre",
            },
            " .updatedAtContainer": {
              w: "100%",
              maxW: "100%",
              display: "flex",
              justifyContent: "center",
              flexDir: "row",
              mt: "3em",
            },
            " .updatedAt": {
              fontSize: "sm",
              p: 0,
              m: 0,
            },
          }}
        >
          <Box>
            <Formik
              initialValues={{ ...user, email: user?.email || "" }}
              validationSchema={UserInfoSchema}
              onSubmit={async (values, props) => {
                setUserError(null);
                setUserStatus(null);

                const res = await updateQuery(values);
                console.log(res);
                if (res.data?.updateUser?.errors) {
                  console.log(res.data?.updateUser?.errors);
                  props.setErrors(createErrorMap(res.data.updateUser.errors));
                } else if (res.error) {
                  props.setErrors({
                    username: "Olemme pahoillamme, mutta jokin meni pieleen: \n " + res.error.message,
                  });
                } else {
                  setUserStatus("Päivitetty");
                }
                props.setSubmitting(false);
              }}
            >
              {({ isSubmitting, values }) => (
                <Form>
                  <Box w="max-content" className="add-border">
                    <Heading mt={0} size={"md"}>
                      Käyttäjätiedot
                    </Heading>
                    <Box>
                      <TextInputfield
                        name="username"
                        placeholder="Käyttäjänimi"
                        label="Käyttäjänimi"
                        isRequired={true}
                        value={values.username}
                      />

                      <TextInputfield
                        name="email"
                        placeholder="Vapaaehtoinen"
                        label="Sähköposti"
                        isRequired={false}
                        value={values.email}
                      />
                    </Box>
                    <Box>
                      <TextInputfield
                        name="firstName"
                        placeholder="Etunimi"
                        label="Etunimi"
                        isRequired={true}
                        value={values.firstName}
                      />

                      <TextInputfield
                        name="lastName"
                        placeholder="Sukunimi"
                        label="Sukunimi"
                        isRequired={true}
                        value={values.lastName}
                      />
                    </Box>
                    <Flex>
                      <Button type="submit" colorScheme="red" isLoading={isSubmitting}>
                        Tallenna
                      </Button>
                      <Flex justify="center" align="center">
                        {userStatus ? <StatusMessage>{userStatus}</StatusMessage> : null}
                        {userError ? <Text className="errorMessage">{userError}</Text> : null}
                      </Flex>
                    </Flex>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
          <Box>
            <Formik
              initialValues={{ password2: "", password: "" }}
              onSubmit={async (values, props) => {
                setPswdError(null);
                setPswdStatus(null);
                const res = await updateQuery(values);
                if (res.data?.updateUser?.errors) {
                  console.log(res.data?.updateUser?.errors);
                  props.setErrors(createErrorMap(res.data.updateUser.errors));
                } else if (res.error) {
                  props.setErrors({
                    password: "Olemme pahoillamme, mutta jokin meni pieleen: \n " + res.error.message,
                  });
                }

                if (res.error) {
                  setPswdError("Jokin meni pieleen, pahoittelumme: \n" + res.error.message);
                } else if (res.data?.updateUser?.errors) {
                  props.setErrors(createErrorMap(res.data?.updateUser?.errors));
                } else {
                  setPswdStatus("Päivitetty");
                }
                props.setSubmitting(false);
              }}
              validationSchema={PasswordSchema}
            >
              {({ isSubmitting, values }) => (
                <Form>
                  <Box className="add-border">
                    <Heading size={"md"}>Salasana</Heading>
                    <Box>
                      <PasswordInput showPassword2 autoComplete="off" passwordLabel="Uusi salasana" />
                    </Box>
                    <Flex>
                      <Button type="submit" colorScheme="red" isLoading={isSubmitting}>
                        Tallenna
                      </Button>
                      <Flex justify="center" align="center">
                        {pswdStatus ? <StatusMessage>{userStatus}</StatusMessage> : null}
                        {pswdError ? <Text className="errorMessage">{userError}</Text> : null}
                      </Flex>
                    </Flex>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
          <Box className="updatedAtContainer">
            <Text className="updatedAt">Tietoja muokattu viimeksi: {formatDate(user?.updatedAt)}</Text>
          </Box>
        </Flex>
      </Wrapper>
    </LoginRequired>
  );
};

export default User;
