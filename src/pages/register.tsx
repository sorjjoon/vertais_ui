import { Box, Button, VStack, Heading, color } from "@chakra-ui/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React from "react";
import Checkboxinput from "../components/input/checkboxinput";
import TextInputfield from "../components/textinputfield";
import Wrapper from "../components/wrapper";
import { useRegisterMutation } from "../generated/graphql";
import { createErrorMap } from "../utils/utils";
import { useRouter } from "next/router";
import Head from "next/head";
import PasswordInput from "../components/input/passwordinput";
import { SignupSchema } from "../utils/validation";
import SubmitCancel from "../components/input/submitcancel";

interface registerProps {}
const Register: React.FC<registerProps> = ({}) => {
  const [, register] = useRegisterMutation();
  const route = useRouter();
  return (
    <Wrapper size="sm" addBorder={true}>
      <Head>
        <title>Rekisteröidy</title>
      </Head>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          username: "",
          password: "",
          password2: "",
          isTeacher: false,
        }}
        validationSchema={SignupSchema}
        validateOnChange={false}
        validateOnBlur={true}
        onSubmit={async (values, { setErrors }) => {
          const res = await register(values);
          if (res.data?.register?.errors) {
            console.log(res.data?.register?.errors);
            setErrors(createErrorMap(res.data.register.errors));
          } else if (res.error) {
            setErrors({ username: "Olemme pahoillamme, mutta jokin meni pieleen", password: res.error.message });
          } else {
            console.log("redirecting");
            route.push("/login");
          }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <VStack
              sx={{
                ">div:first-of-type": { mb: "calc(var(--chakra-space-3)*1.3)" },
                ">div:last-of-type": { mt: "calc(var(--chakra-space-3)*1.3)" },
                ">div": { maxW: "20em", w: "100%", py: 1 },
              }}
            >
              <Box>
                <Heading size={"md"}>Rekisteröidy</Heading>
              </Box>
              <Box>
                <TextInputfield name="username" placeholder="Käyttäjänimi" label="Käyttäjänimi" isRequired={true} />

                <TextInputfield
                  name="email"
                  placeholder="Vapaaehtoinen"
                  label="Sähköposti"
                  isRequired={false}
                  helperText={!values.email ? "Sähköpostia tarvitaan, jos hävität salasanasi tai käyttäjänimesi" : null}
                />
              </Box>
              <Box>
                <PasswordInput showPassword2 autoComplete="off" />
              </Box>
              <Box>
                <TextInputfield name="firstName" placeholder="Etunimi" label="Etunimi" isRequired={true} />

                <TextInputfield name="lastName" placeholder="Sukunimi" label="Sukunimi" isRequired={true} />
              </Box>
              <Box>
                <Checkboxinput name="isTeacher" label="Olen opettaja" />
              </Box>
              <Box>
                <SubmitCancel submitLabel="Rekisteröidy" hideCancel isLoading={isSubmitting} />
              </Box>
            </VStack>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
