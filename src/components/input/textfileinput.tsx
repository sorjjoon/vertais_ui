import { FormLabel } from "@chakra-ui/form-control";
import { Text } from "@chakra-ui/layout";
import { ErrorMessage, useField } from "formik";
import React from "react";
import { uuid } from "../../utils/utils";
import Abittieditor from "./abittieditor";
import FileInput from "../file/fileinput";
import FileList from "../file/filelist";
import { FileFragment } from "../../generated/graphql";

interface TextFileInputProps {
  abittiName: string;
  abittiLabel: string | null;
  abittiOldData?: string | null;

  fileFieldName: string;
  fileFieldLabel: string | null;

  filesToDeleteName: string;
  filesToDelete?: number[] | null;
  oldFiles?: FileFragment[] | null;
  children: (elements: {
    abittiLabel: JSX.Element | null;
    abittiError: JSX.Element | null;
    abittiEditor: JSX.Element;
    fileFieldLabel: JSX.Element | null;
    fileList: JSX.Element;
    fileInput: JSX.Element;
  }) => JSX.Element;
}
const TextFileInput: React.FC<TextFileInputProps> = ({
  abittiLabel,
  abittiOldData,
  abittiName,
  oldFiles,
  filesToDeleteName,
  filesToDelete,
  fileFieldName,
  fileFieldLabel,
  children,
}) => {
  const [_, __, abittiFieldProps] = useField({ name: abittiName, type: "hidden" });
  const [___, ____, fileFieldProps] = useField({ name: fileFieldName, type: "hidden" });

  return children({
    abittiLabel: abittiLabel ? <Text>{abittiLabel}</Text> : null,
    abittiEditor: (
      <Abittieditor
        id={uuid(abittiName)}
        oldData={abittiOldData ?? undefined}
        onUpdate={(newData) => {
          abittiFieldProps.setValue(newData.answerHTML);
        }}
      />
    ),
    abittiError: <ErrorMessage name={abittiName} />,
    fileFieldLabel: fileFieldLabel ? (
      <FormLabel htmlFor={fileFieldName} mb={0}>
        {fileFieldLabel}
      </FormLabel>
    ) : null,
    fileInput: (
      <FileInput name={fileFieldName} onChange={(event) => fileFieldProps.setValue(event.currentTarget?.files ?? [])} />
    ),
    fileList: (
      <FileList
        name={filesToDeleteName}
        files={oldFiles ?? []}
        canModify
        filesToDelete={filesToDelete ?? []}
        label="Vanhat liitteet:"
      />
    ),
  });
};

export default TextFileInput;
