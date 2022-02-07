import { Box, Divider, Flex, Heading, HStack, VStack } from "@chakra-ui/react";
import React from "react";
import { useGetSubmitQuery } from "../../generated/graphql";
import { formatGraphQLerror } from "../../utils/utils";
import Displaycomment from "../comment/displaycomment";
import ModifyComment from "../comment/modifycomment";
import Commentable from "../input/commentable";
import Loading from "../utils/loading";
import LoginRequired from "../utils/loginrequired";
import { useCurrentUser } from "../providers/userprovider";

interface SubmitGradeViewProps {
  ownerId: number;
  taskId: number;
}
export const SubmitGradeView: React.FC<SubmitGradeViewProps> = (props) => {
  const user = useCurrentUser();
  const [{ fetching: submitFetching, error: submitError, data: submitData }] = useGetSubmitQuery({
    variables: { taskId: props.taskId, ownerId: props.ownerId },
  });
  const submit = submitData?.getSubmit?.mySubmit;
  return (
    <LoginRequired>
      <VStack w="max-content" maxW="100%" h="100%" spacing={5}>
        <Loading isLoading={submitFetching || user === undefined} spinnerSize="xl">
          {submit ? (
            <Commentable
              content={submit.description ?? ""}
              feedbacks={submit.grade?.feedbacks ?? []}
              submitId={submit.id}
              canModify
            />
          ) : (
            <Flex
              color="errorColor.100"
              fontSize="lg"
              minH={20}
              w="100%"
              textAlign="center"
              justify="center"
              align="center"
            >
              {formatGraphQLerror(submitError) || "Ei palautettu"}
            </Flex>
          )}
          <Divider />

          {submit ? (
            <VStack align="flex-start" justify="center" spacing={3} w="100%">
              <Heading textAlign="left" fontSize="lg">
                Kommentit
              </Heading>
              {submit?.grade?.comments.map((com) => (
                <Box
                  key={"comment" + com.id}
                  p={2}
                  shadow="md"
                  borderWidth="1px"
                  borderRadius="md"
                  className="comment-container"
                >
                  <Displaycomment comment={com} canModify={user?.id === com.owner.id} />
                </Box>
              ))}
              <ModifyComment newCommentButtonText="Uusi kommentti" grade={{ id: submit.id }} />
            </VStack>
          ) : null}
        </Loading>
      </VStack>
    </LoginRequired>
  );
};

export default SubmitGradeView;
