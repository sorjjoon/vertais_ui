import { Box } from "@chakra-ui/react";
import React from "react";
import { uuid } from "../../utils/utils";

type fileinputProps = {
  name: string;
  id?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & Omit<React.ComponentProps<typeof Box>, "onChange">;
export const FileInput: React.FC<fileinputProps> = ({ name, onChange, id = uuid("file-input-"), ...props }) => {
  return (
    <Box className="file-input-wrapper" {...props}>
      <input id={id} name={name} type="file" className="file-input" multiple onChange={onChange} />
    </Box>
  );
};

export default FileInput;
