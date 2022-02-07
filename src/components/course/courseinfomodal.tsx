import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Button,
  Heading,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { CourseFragment, useInsertCourseMutation, useUpdateCourseMutation } from "../../generated/graphql";
import { formatGraphQLerror, getRandom } from "../../utils/utils";
import SubmitCancel from "../input/submitcancel";
import TextInputfield from "../textinputfield";

interface CourseInfoModalProps {
  oldData?: CourseFragment;
  onClose: () => void;
  isOpen: boolean;
}
export const CourseInfoModal: React.FC<CourseInfoModalProps> = ({ oldData, onClose, isOpen }) => {
  const [, insertCourse] = useInsertCourseMutation();
  const [, updateCourse] = useUpdateCourseMutation();
  const [error, setError] = useState<string | null>(null);
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <Formik
        initialValues={{
          description: oldData?.description ?? "",
          name: oldData?.name ?? "",
          abbreviation: oldData?.abbreviation ?? "",
          icon: oldData?.icon ?? getRandom(process.env.NEXT_PUBLIC_COURSE_ICONS as unknown as string[]),
        }}
        onSubmit={async (values, { setErrors, setSubmitting }) => {
          setError(null);
          var res;
          if (!oldData) {
            res = await insertCourse(values);
          } else {
            res = await updateCourse({ id: oldData.id, ...values });
          }

          if (res.error) {
            setError(formatGraphQLerror(res.error.message));
          } else {
            onClose();
          }
          setSubmitting(false);
        }}
        validate={({ abbreviation, name }) => {
          if (abbreviation.length > 6) {
            return { abbreviation: "Lyhenteen pituus saa olla enintään 6 merkkiä" };
          }
          if (name.length < 1) {
            return { name: "Nimi ei voi olla tyhjä" };
          }
          return undefined;
        }}
      >
        {({ isSubmitting, values }) => (
          <Form>
            <ModalOverlay />
            <ModalContent p={8}>
              <ModalCloseButton />

              <TextInputfield name="name" placeholder="Pakollinen" label="Kurssin nimi" isRequired />

              <TextInputfield
                name="abbreviation"
                size={6}
                placeholder="Vapaaehtoinen"
                label="Lyhenne"
                helperText="Lyhenettä käytetään etusivulla, jos kurssin koko nimi on liian pitkä näytettäväksi"
              />

              <TextInputfield
                name="description"
                size={6}
                as="textarea"
                placeholder="Vapaaehtoinen"
                label="Selite"
                helperText="Kurssin selite"
                minH="5em"
              />

              {error ? (
                <Box colorScheme="red" sx={{ fontSize: "sm", color: "red.300" }}>
                  {error}
                </Box>
              ) : null}

              <ModalFooter pb={0} px={0}>
                <SubmitCancel wrapperStyling={{ w: "100%" }} isLoading={isSubmitting} onCancel={onClose} />
              </ModalFooter>
            </ModalContent>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default CourseInfoModal;
