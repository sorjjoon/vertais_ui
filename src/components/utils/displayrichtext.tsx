import { Box } from "@chakra-ui/react";
import React from "react";

type DisplayRichtextProps = {
  content?: string | null;
} & React.ComponentProps<typeof Box>;
export const DisplayRichtext: React.FC<DisplayRichtextProps> = ({ content, className, ...props }) => {
  return content && content.trim() ? (
    <Box
      w="100%"
      dangerouslySetInnerHTML={{ __html: content }}
      className={"content " + className}
      wordBreak="normal"
      {...props}
    ></Box>
  ) : null;
};

export default DisplayRichtext;
