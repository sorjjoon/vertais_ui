import { Box, Heading, Button, Flex, Text, VStack, Wrap } from "@chakra-ui/react";
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
import ErrorMessage from "../../components/utils/errormessage";
import SubmitCancel from "../../components/input/submitcancel";

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
        <VStack spacing={14}>
          <Wrap spacing={14} justify="center" w="100%">
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
                {({ isSubmitting, values, resetForm }) => (
                  <Form>
                    <VStack w="max-content" className="add-border" p={6} align="flex-start">
                      <Heading mt={0} size={"md"}>
                        Käyttäjätiedot
                      </Heading>
                      <Box w="100%">
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
                      <Box w="100%">
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
                        <SubmitCancel
                          isLoading={isSubmitting}
                          wrapperStyling={{ w: "100%" }}
                          showCheckMarkAfterSubmit={false}
                          onCancel={() => {
                            setUserStatus(null);
                            resetForm();
                          }}
                        >
                          {userStatus}
                        </SubmitCancel>
                        <ErrorMessage message={userError} />
                      </Flex>
                    </VStack>
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
                {({ isSubmitting, resetForm }) => (
                  <Form>
                    <Box className="add-border" p={6}>
                      <Heading size={"md"}>Salasana</Heading>
                      <Box w="100%">
                        <PasswordInput showPassword2 autoComplete="off" passwordLabel="Uusi salasana" />
                      </Box>
                      <SubmitCancel
                        isLoading={isSubmitting}
                        wrapperStyling={{ w: "100%" }}
                        showCheckMarkAfterSubmit={false}
                        onCancel={() => {
                          setPswdStatus(null);
                          resetForm();
                        }}
                      >
                        {pswdStatus}
                      </SubmitCancel>
                    </Box>
                  </Form>
                )}
              </Formik>
            </Box>
          </Wrap>
          <Box className="updatedAtContainer" w="100%" maxW="100%" display="flex" justifyContent="center" flexDir="row">
            <Text className="updatedAt">Tietoja muokattu viimeksi: {formatDate(user?.updatedAt)}</Text>
          </Box>
        </VStack>
      </Wrapper>
    </LoginRequired>
  );
};

export default User;
