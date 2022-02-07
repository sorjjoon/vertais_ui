import { ChevronDownIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Comment, CommentFragment, useDeleteCommentMutation } from "../../generated/graphql";
import { sanitize } from "../../utils/sanitize";
import { compareDates, formatDate, formatGraphQLerror, uuid } from "../../utils/utils";
import ErrorMessage from "../errormessage";
import FileList from "../file/filelist";
import ModifyComment from "./modifycomment";

interface DisplaycommentProps {
  comment: CommentFragment;

  canModify?: boolean;
}
export const Displaycomment: React.FC<DisplaycommentProps> = ({ comment, canModify }) => {
  const [{ fetching }, deleteComment] = useDeleteCommentMutation();
  const [error, setError] = useState<string | undefined>(undefined);
  const [counter, setCounter] = useState(0);
  const [isModifying, setModifying] = useState(false);
  const isHidden = parseInt(comment.reveal) > new Date().getTime();
  return (
    <Box>
      <Box display={isModifying && canModify ? "block" : "none"}>
        <ModifyComment
          oldData={comment}
          key={counter}
          showInitially={true}
          atferUpdate={() => {
            setModifying(false);
            setCounter(counter + 1);
          }}
          onCancel={() => {
            setModifying(false);
            setCounter(counter + 1);
          }}
          atferInsert={() => {
            setCounter(counter + 1);
          }}
        />
      </Box>
      <Grid
        templateColumns="auto var(--chakra-sizes-5);"
        templateRows="repeat(6, max-content)"
        gap={0}
        h="max-content"
        w="100%"
        id={"comment-" + comment.id}
        className={
          "content comment " +
          (canModify ? " mod " : " view ") +
          (isModifying ? " hide " : "") +
          (isHidden ? " hidden " : "  ")
        }
        p={3}
      >
        <GridItem className="owner">
          {comment.owner.lastName}, {comment.owner.firstName}
        </GridItem>
        <GridItem>
          {canModify ? (
            <Menu>
              <MenuButton
                display="block"
                bg="inherit!important"
                w="100%"
                h="100%"
                transition="all 0.2s"
                _hover={{}}
                _expanded={{}}
                _focus={{}}
                as={IconButton}
                paddingInline={0}
                minW="max-content"
                overflow="hidden"
                icon={<SettingsIcon w="100%" h="100%" className="tools" maxW={5} maxH={5} />}
              ></MenuButton>
              <MenuList overflow="hidden">
                <MenuItem
                  onClick={() => {
                    setModifying(true);
                  }}
                >
                  Muokkaa
                </MenuItem>
                <MenuItem
                  onClick={async () => {
                    deleteComment({ id: comment.id }).then((res) => {
                      if (res.error) {
                        console.log(res.error);
                        setError(formatGraphQLerror(res.error.message));
                      }
                      console.log(res.data?.deleteComment);
                    });
                  }}
                >
                  {fetching ? <Spinner /> : "Poista"}
                </MenuItem>
              </MenuList>
            </Menu>
          ) : null}
        </GridItem>

        <GridItem colSpan={2} className=" created-at">
          {formatDate(comment.createdAt)}
        </GridItem>
        <GridItem colSpan={2} className=" updated-at">
          {compareDates(comment.createdAt, comment.updatedAt) !== 0 ? (
            <>Muokattu: {formatDate(comment.updatedAt)}</>
          ) : null}
        </GridItem>

        <GridItem
          colSpan={2}
          mt={3}
          w="100%"
          className="content"
          dangerouslySetInnerHTML={{ __html: sanitize(comment.content) }}
        />
        <GridItem colSpan={2}>{<FileList files={comment.files} />}</GridItem>
        <GridItem colSpan={2}>
          {isHidden ? <Box className="reveal-info">Näkyy opiskeilijoille: {formatDate(comment.reveal)} </Box> : null}
        </GridItem>
        <GridItem colSpan={2}>
          <ErrorMessage>{error}</ErrorMessage>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Displaycomment;
