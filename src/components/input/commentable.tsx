import { Box, Flex, Text } from "@chakra-ui/layout";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Divider,
  Tooltip,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React from "react";
import { FeedbackFragment, useDeleteFeedbackMutation, useUpdateFeedbackMutation } from "../../generated/graphql";
import { formatGraphQLerror } from "../../utils/utils";
import Loading from "../utils/loading";
import TextInputfield from "../textinputfield";
import SubmitCancel from "./submitcancel";

import { sortBy } from "lodash-es";

interface CommentableProps {
  content: string;
  feedbacks: FeedbackFragment[];
  submitId: number;
  canModify?: boolean;
}
interface CommentableState {
  visibleFeedbacks: number[];
  modifingFeedBack?: {
    feedback: { description: string; childIndex: number };
    x: number;
    y: number;
  };
}

type FeedbackMouseInfo = {
  feedback: { id?: number; description: string; childIndex: number };
  mouseX?: number;
  mouseY?: number;
};

const Commentable: React.FC<CommentableProps> = (props) => {
  const [modifingFeedBack, setModifingFeedBack] = React.useState(undefined as undefined | FeedbackMouseInfo);
  const [, updateFeedback] = useUpdateFeedbackMutation();
  const [, deleteFeedback] = useDeleteFeedbackMutation();

  function handleClick(childIndex: number, mouseX?: number, mouseY?: number) {
    if (!props.canModify) {
      return;
    }
    console.log("click", childIndex);

    const feedback = props.feedbacks.find((f) => f.childIndex == childIndex) ?? { description: "", childIndex };
    if (childIndex >= 0) {
      setModifingFeedBack({
        feedback,
        mouseX,
        mouseY,
      });
    }
  }

  function getContentChildNodes() {
    const temp = document.createElement("div");
    temp.innerHTML = props.content;
    return Array.from(temp.childNodes);
  }
  console.log("rendering");
  return (
    <Loading isLoading={false}>
      <Box className={`commentable-wrapper ${props.canModify ? "can-modify" : ""}`}>
        {getContentChildNodes().map((node, i) => {
          const modFeedBackIndex = modifingFeedBack?.feedback?.childIndex ?? -1;

          let containerType: "div" | "span";
          if (node.nodeName == "BR") {
            return <br key={i} />;
          }
          if (node.nodeType == Node.TEXT_NODE) {
            containerType = "span";
          } else {
            containerType = "div";
          }
          const feedback = props.feedbacks.find((f) => f.childIndex == i);

          return (
            <Tooltip
              key={"feedback" + i + feedback?.id}
              hasArrow
              label={feedback?.description}
              isDisabled={!feedback}
              placement="bottom"
              closeDelay={200}
              bg="#555"
            >
              <Box
                className={`feedback-wrapper 
                             ${!!feedback ? " has-feedback " : " no-feedback"} 
                             ${modFeedBackIndex === i ? "is-modifying " : ""}
                             ${containerType == "div" ? " img-child" : " text-child"}`}
                title={`${props.canModify ? "Kommentoi" : feedback?.description ?? ""}`}
                onClick={(e) => handleClick(i, e.clientX, e.clientY)}
              >
                <Box
                  as={containerType}
                  dangerouslySetInnerHTML={{ __html: (node as any).outerHTML ?? node.textContent ?? "" }}
                ></Box>
              </Box>
            </Tooltip>
          );
        })}
      </Box>
      {props.feedbacks.length ? (
        <>
          <Divider />
          <Flex w="100%" direction="column" align="baseline">
            {sortBy(props.feedbacks, (f) => f.childIndex).map((f, i) => (
              <Box key={f.childIndex} my={1}>
                <Text as="span" color="blue" mr={2}>
                  {i + 1 + ") "}
                </Text>
                {f.description}
              </Box>
            ))}
          </Flex>
        </>
      ) : null}
      {props.canModify ? (
        <Modal onClose={() => setModifingFeedBack(void 0)} isOpen={modifingFeedBack !== undefined} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Lisää kommentti</ModalHeader>
            <ModalCloseButton />
            <Formik
              initialValues={{
                data:
                  props.feedbacks.find((f) => f.childIndex === modifingFeedBack?.feedback?.childIndex)?.description ||
                  "",
                oldId: props.feedbacks.find((f) => f.childIndex === modifingFeedBack?.feedback?.childIndex)?.id ?? 0,
              }}
              onSubmit={async (values, formikProps) => {
                try {
                  var res = undefined;
                  if (values.data.trim()) {
                    res = await updateFeedback({
                      description: values.data,
                      targetId: props.submitId,
                      childIndex: modifingFeedBack!.feedback.childIndex,
                    });
                  } else if (values.oldId) {
                    res = await deleteFeedback({ id: values.oldId });
                  }

                  if (res?.error) {
                    throw res.error;
                  }
                  setModifingFeedBack(void 0);
                } catch (err) {
                  formikProps.setErrors({ data: formatGraphQLerror(err) });
                }

                formikProps.setSubmitting(false);
              }}
            >
              {({ isSubmitting, values }) => (
                <Form>
                  <ModalBody>
                    <TextInputfield
                      value={values.data}
                      boxStyling={{ mb: 3 }}
                      name="data"
                      as="textarea"
                      minH="4em"
                      h="100%"
                      w="100%"
                    />
                  </ModalBody>
                  <ModalFooter>
                    <SubmitCancel
                      onCancel={() => setModifingFeedBack(void 0)}
                      isLoading={isSubmitting}
                      cancelStyling={{ ml: "auto!important" }}
                      wrapperStyling={{ w: "100%" }}
                    />
                  </ModalFooter>
                </Form>
              )}
            </Formik>
          </ModalContent>
        </Modal>
      ) : null}
    </Loading>
  );
};

export default Commentable;
