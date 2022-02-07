import { FormLabel } from "@chakra-ui/form-control";
import { HStack, Text } from "@chakra-ui/layout";
import { ErrorMessage, Field } from "formik";
import React, { useEffect } from "react";
import { uuid } from "../../utils/utils";
import Abittieditor from "./abittieditor";
import FileInput from "../file/fileinput";
import FileList from "../file/filelist";
import { FileFragment } from "../../generated/graphql";

interface TextFileInputProps {
  abittiName: string;
  abittiLabel: string | null;
  abittiOldData?: string | null;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;

  fileFieldName: string;
  fileFieldLabel: string | null;

  filesToDeleteName: string;
  filesToDelete?: number[] | null;
  oldFiles?: FileFragment[] | null;
}
export const TextFileInput: React.FC<TextFileInputProps> = ({
  abittiLabel,
  abittiOldData,
  abittiName,
  oldFiles,
  filesToDeleteName,
  filesToDelete,
  setFieldValue,
  fileFieldName,
  fileFieldLabel,
}) => {
  return (
    <>
      {abittiLabel ? <Text>{abittiLabel}</Text> : null}
      <Abittieditor
        id={uuid(abittiName)}
        oldData={abittiOldData ?? undefined}
        onUpdate={(newData) => {
          setFieldValue(abittiName, newData.answerHTML);
        }}
      />
      <Field name={abittiName} type="hidden" />
      <ErrorMessage name={abittiName} />
      <HStack>
        {fileFieldLabel ? (
          <FormLabel htmlFor={fileFieldName} mb={0}>
            {fileFieldLabel}
          </FormLabel>
        ) : null}

        <FileList name={filesToDeleteName} files={oldFiles ?? []} canModify filesToDelete={filesToDelete ?? []} />
        <FileInput
          name={fileFieldName}
          onChange={(event) => setFieldValue(fileFieldName, event.currentTarget?.files ?? [])}
          py={4}
        />
      </HStack>
    </>
  );
};

export default TextFileInput;
