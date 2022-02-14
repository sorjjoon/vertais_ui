import React from "react";
import { Link, ListItem, UnorderedList, Box, Heading, HStack } from "@chakra-ui/react";
import { abstractEqualityIncludes, getFileUrl } from "../../utils/utils";
import { Field } from "formik";
interface FileListProps {
  files: { id: number; filename: string }[] | null;
  label?: string;
  name?: string;
  filesToDelete?: number[] | string[];
  canModify?: boolean;
  hideHeader?: boolean;
}
export const FileList: React.FC<FileListProps> = ({
  files,
  canModify,
  hideHeader,
  label = "Liitteet:",
  filesToDelete = [],
  name = "filesToDelete",
}) => {
  if (!files || files.length == 0) {
    return <></>;
  }
  return (
    <Box className="file-list" w="100%">
      {hideHeader ? null : (
        <Heading className="file-list-header" size="sm">
          {label}
        </Heading>
      )}

      <UnorderedList>
        {files.map((f) => (
          <ListItem key={"file" + f.id}>
            <HStack>
              <Link
                href={getFileUrl(f.id, f.filename)}
                isExternal
                className={`file-link ${abstractEqualityIncludes(filesToDelete, f.id) ? "to-delete" : ""}`}
                title={f.filename}
              >
                {f.filename}
              </Link>
              {canModify ? (
                <Field
                  type="checkbox"
                  name={name}
                  value={f.id}
                  checked={abstractEqualityIncludes(filesToDelete, f.id)}
                  title={`Poista ${f.filename}`}
                />
              ) : null}
            </HStack>
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
};

export default FileList;
