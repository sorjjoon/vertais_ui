import { Table, Tbody, Tr, Th, Td, Box, Button } from "@chakra-ui/react";
import { ErrorMessage } from "../utils/errormessage";
import FileList from "../file/filelist";
import React from "react";
import { AssignmentFragment, TaskFragment, useDeleteSubmitMutation, useGetSubmitQuery } from "../../generated/graphql";
import { formatDate, confirmPromise, uuid, parseDate } from "../../utils/utils";
import Displaycomment from "../comment/displaycomment";
import Commentable from "../input/commentable";
import { useCurrentUser } from "../providers/userprovider";
import Loading from "../utils/loading";
import DisplayRichtext from "../utils/displayrichtext";

interface SubmitTableProps {
  assignment: AssignmentFragment;
  task: TaskFragment;
}
export const SubmitTable: React.FC<SubmitTableProps> = ({ assignment, task }) => {
  const user = useCurrentUser();
  const [{ fetching, data }] = useGetSubmitQuery({ variables: { ownerId: user?.id, taskId: task.id } });
  const [{ fetching: deleteFetching, error }, deleteSubmit] = useDeleteSubmitMutation();

  const mySubmit = data?.getSubmit?.mySubmit;
  const deadlineIsPast = assignment.deadline != null && parseDate(assignment.deadline)! < new Date();
  const isGraded = !!mySubmit?.grade;
  console.log(data);
  return (
    <Loading isLoading={fetching}>
      <Table className="submit-status-table" variant="simple">
        <Tbody>
          <Tr>
            <Th>Palautuspäivä: </Th>
            <Td> {formatDate(assignment.deadline, { default: "Ei palautuspäivää", addPostFix: true })} </Td>
          </Tr>
          <Tr>
            <Th>Palautettu:</Th>
            <Td color={mySubmit?.updatedAt ? undefined : "errorColor.100"}>
              <Box w="max-content">
                {formatDate(mySubmit?.updatedAt, { default: "Ei palautettu" })}
                {mySubmit && !deadlineIsPast && !isGraded ? (
                  <Button
                    isLoading={deleteFetching}
                    colorScheme="red"
                    disabled={isGraded}
                    title="Poista"
                    w="95%"
                    size="xs"
                    onClick={() => {
                      confirmPromise(
                        "Oletko varma, että haluat poistaa palautuksesi? \nTätä toiminta ei voi peruuttaa"
                      ).then((r) => {
                        if (r) {
                          deleteSubmit({ id: mySubmit.id });
                        }
                      });
                    }}
                  >
                    Poista palautuksesi
                  </Button>
                ) : null}
              </Box>
              <ErrorMessage>{error}</ErrorMessage>
            </Td>
          </Tr>
          <Tr>
            <Th verticalAlign="top">
              <Box mt={1}>Palautuksesi:</Box>
            </Th>
            <Td>
              {mySubmit?.grade ? (
                <Box>
                  <Commentable
                    content={mySubmit.description ?? ""}
                    feedbacks={mySubmit.grade.feedbacks}
                    submitId={mySubmit.id}
                  />
                </Box>
              ) : (
                <DisplayRichtext content={mySubmit?.description} />
              )}
            </Td>
          </Tr>
          <Tr>
            <Th>Liitteet: </Th>
            <Td>
              <FileList files={mySubmit?.files ?? []} hideHeader />
            </Td>
          </Tr>
          <Tr>
            <Th>Arvionti: </Th>
            <Td>
              {mySubmit?.grade ? (
                <Box>
                  <Box>
                    {mySubmit.grade.points}/{task.points}
                  </Box>
                  <Box>
                    {mySubmit.grade.comments.map((com) => (
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
                  </Box>
                </Box>
              ) : (
                "Ei arvioitu"
              )}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Loading>
  );
};

export default SubmitTable;
